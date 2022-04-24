import { ChakraProvider } from '@chakra-ui/react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import assert from 'assert';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { BrowserRouter } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import './App.css';
import ConversationArea, { ServerConversationArea } from './classes/ConversationArea';
import GamePlayer, { ServerGamePlayer } from './classes/GamePlayer';
import MafiaGame from './classes/MafiaGame';
import Player, { ServerPlayer, UserLocation } from './classes/Player';
import RecreationArea, { ServerRecreationArea } from './classes/RecreationArea';
import TownsServiceClient, { TownJoinResponse } from './classes/TownsServiceClient';
import Video from './classes/Video/Video';
import Login from './components/Login/Login';
import { ChatProvider } from './components/VideoCall/VideoFrontend/components/ChatProvider';
import ErrorDialog from './components/VideoCall/VideoFrontend/components/ErrorDialog/ErrorDialog';
import UnsupportedBrowserWarning from './components/VideoCall/VideoFrontend/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import { VideoProvider } from './components/VideoCall/VideoFrontend/components/VideoProvider';
import useLocalAudioToggle from './components/VideoCall/VideoFrontend/hooks/useLocalAudioToggle/useLocalAudioToggle';
import useLocalVideoToggle from './components/VideoCall/VideoFrontend/hooks/useLocalVideoToggle/useLocalVideoToggle';
import AppStateProvider, { useAppState } from './components/VideoCall/VideoFrontend/state';
import theme from './components/VideoCall/VideoFrontend/theme';
import { Callback } from './components/VideoCall/VideoFrontend/types';
import useConnectionOptions from './components/VideoCall/VideoFrontend/utils/useConnectionOptions/useConnectionOptions';
import VideoOverlay from './components/VideoCall/VideoOverlay/VideoOverlay';
import WorldMap from './components/world/WorldMap';
import ConversationAreasContext from './contexts/ConversationAreasContext';
import CoveyAppContext from './contexts/CoveyAppContext';
import CurrentRecreationAreaContext from './contexts/CurrentRecreationAreaContext';
import IsDeadContext from './contexts/IsDeadContext';
import NearbyPlayersContext from './contexts/NearbyPlayersContext';
import PlayerMovementContext, { PlayerMovementCallback } from './contexts/PlayerMovementContext';
import PlayersInTownContext from './contexts/PlayersInTownContext';
import RecreationAreasContext from './contexts/RecreationAreasContext';
import VideoContext from './contexts/VideoContext';
import { CoveyAppState } from './CoveyTypes';

export const MOVEMENT_UPDATE_DELAY_MS = 0;
export const CALCULATE_NEARBY_PLAYERS_MOVING_DELAY_MS = 300;
type CoveyAppUpdate =
  | {
      action: 'doConnect';
      data: {
        userName: string;
        townFriendlyName: string;
        townID: string;
        townIsPubliclyListed: boolean;
        sessionToken: string;
        myPlayerID: string;
        socket: Socket;
        emitMovement: (location: UserLocation) => void;
      };
    }
  | { action: 'disconnect' };

function defaultAppState(): CoveyAppState {
  return {
    myPlayerID: '',
    currentTownFriendlyName: '',
    currentTownID: '',
    currentTownIsPubliclyListed: false,
    sessionToken: '',
    userName: '',
    socket: null,
    emitMovement: () => {},
    apiClient: new TownsServiceClient(),
  };
}
function appStateReducer(state: CoveyAppState, update: CoveyAppUpdate): CoveyAppState {
  const nextState = {
    sessionToken: state.sessionToken,
    currentTownFriendlyName: state.currentTownFriendlyName,
    currentTownID: state.currentTownID,
    currentTownIsPubliclyListed: state.currentTownIsPubliclyListed,
    myPlayerID: state.myPlayerID,
    userName: state.userName,
    socket: state.socket,
    emitMovement: state.emitMovement,
    apiClient: state.apiClient,
  };

  switch (update.action) {
    case 'doConnect':
      nextState.sessionToken = update.data.sessionToken;
      nextState.myPlayerID = update.data.myPlayerID;
      nextState.currentTownFriendlyName = update.data.townFriendlyName;
      nextState.currentTownID = update.data.townID;
      nextState.currentTownIsPubliclyListed = update.data.townIsPubliclyListed;
      nextState.userName = update.data.userName;
      nextState.emitMovement = update.data.emitMovement;
      nextState.socket = update.data.socket;
      break;
    case 'disconnect':
      state.socket?.disconnect();
      return defaultAppState();
    default:
      throw new Error('Unexpected state request');
  }

  return nextState;
}

function calculateNearbyPlayers(players: Player[], currentLocation: UserLocation) {
  const isWithinCallRadius = (p: Player, location: UserLocation) => {
    if (p.location && location) {
      if (location.conversationLabel || p.location.conversationLabel) {
        return p.location.conversationLabel === location.conversationLabel;
      }
      const dx = p.location.x - location.x;
      const dy = p.location.y - location.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      return d < 80;
    }
    return false;
  };
  return players.filter(p => isWithinCallRadius(p, currentLocation));
}
function samePlayers(a1: Player[], a2: Player[]) {
  if (a1.length !== a2.length) return false;
  const ids1 = a1.map(p => p.id).sort();
  const ids2 = a2.map(p => p.id).sort();
  return !ids1.some((val, idx) => val !== ids2[idx]);
}

function App(props: { setOnDisconnect: Dispatch<SetStateAction<Callback | undefined>> }) {
  const [appState, dispatchAppUpdate] = useReducer(appStateReducer, defaultAppState());
  const [playerMovementCallbacks] = useState<PlayerMovementCallback[]>([]);
  const [playersInTown, setPlayersInTown] = useState<Player[]>([]);
  const [nearbyPlayers, setNearbyPlayers] = useState<Player[]>([]);
  // const [currentLocation, setCurrentLocation] = useState<UserLocation>({moving: false, rotation: 'front', x: 0, y: 0});
  const [conversationAreas, setConversationAreas] = useState<ConversationArea[]>([]);
  const [recreationAreas, setRecreationAreas] = useState<RecreationArea[]>([]);
  const [currentRecArea, setCurrentRecArea] = useState<RecreationArea>();
  const [isDead, setIsDead] = useState<boolean>(false);
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();

  const setupGameController = useCallback(
    async (initData: TownJoinResponse) => {
      const gamePlayerID = initData.coveyUserID;
      const sessionToken = initData.coveySessionToken;
      const url = process.env.REACT_APP_TOWNS_SERVICE_URL;
      assert(url);
      const video = Video.instance();
      assert(video);
      const townName = video.townFriendlyName;
      assert(townName);

      const socket = io(url, { auth: { token: sessionToken, coveyTownID: video.coveyTownID } });
      socket.on('disconnect', () => {
        dispatchAppUpdate({ action: 'disconnect' });
      });
      let lastMovement = 0;
      let lastRecalculateNearbyPlayers = 0;
      let currentLocation: UserLocation = { moving: false, rotation: 'front', x: 0, y: 0 };

      let localPlayers = initData.currentPlayers.map(sp => Player.fromServerPlayer(sp));
      let localCurrentRecArea: RecreationArea | undefined;
      let localConversationAreas = initData.conversationAreas.map(sa =>
        ConversationArea.fromServerConversationArea(sa),
      );
      let localRecreationAreas = initData.recreationAreas.map(sa =>
        RecreationArea.fromServerRecreationArea(sa),
      );
      let localNearbyPlayers: Player[] = [];
      let localAudioEnabled: boolean = isAudioEnabled;
      let localVideoEnabled: boolean = isVideoEnabled;
      setPlayersInTown(localPlayers);
      setConversationAreas(localConversationAreas);
      setRecreationAreas(localRecreationAreas);
      setNearbyPlayers(localNearbyPlayers);

      const recalculateNearbyPlayers = () => {
        const newNearbyPlayers = calculateNearbyPlayers(localPlayers, currentLocation);
        if (!samePlayers(localNearbyPlayers, newNearbyPlayers)) {
          localNearbyPlayers = newNearbyPlayers;
          setNearbyPlayers(localNearbyPlayers);
        }
      };
      const emitMovement = (location: UserLocation) => {
        const now = Date.now();
        currentLocation = location;
        if (now - lastMovement > MOVEMENT_UPDATE_DELAY_MS || !location.moving) {
          lastMovement = now;
          socket.emit('playerMovement', location);
          if (
            now - lastRecalculateNearbyPlayers > CALCULATE_NEARBY_PLAYERS_MOVING_DELAY_MS ||
            !location.moving
          ) {
            lastRecalculateNearbyPlayers = now;
            recalculateNearbyPlayers();
          }
        }
      };
      socket.on('newPlayer', (player: ServerPlayer) => {
        localPlayers = localPlayers.concat(Player.fromServerPlayer(player));
        recalculateNearbyPlayers();
      });
      socket.on('playerMoved', (player: ServerPlayer) => {
        if (player._id !== gamePlayerID) {
          const now = Date.now();
          playerMovementCallbacks.forEach(cb => cb(player));
          if (
            !player.location.moving ||
            now - lastRecalculateNearbyPlayers > CALCULATE_NEARBY_PLAYERS_MOVING_DELAY_MS
          ) {
            lastRecalculateNearbyPlayers = now;
            const updatePlayer = localPlayers.find(p => p.id === player._id);
            if (updatePlayer) {
              updatePlayer.location = player.location;
            } else {
              localPlayers = localPlayers.concat(Player.fromServerPlayer(player));
              setPlayersInTown(localPlayers);
            }
            recalculateNearbyPlayers();
          }
        }
      });
      socket.on('playerDisconnect', (disconnectedPlayer: ServerPlayer) => {
        localPlayers = localPlayers.filter(player => player.id !== disconnectedPlayer._id);
        setPlayersInTown(localPlayers);
        recalculateNearbyPlayers();
      });
      socket.on('conversationUpdated', (_conversationArea: ServerConversationArea) => {
        const updatedConversationArea = localConversationAreas.find(
          c => c.label === _conversationArea.label,
        );
        if (updatedConversationArea) {
          updatedConversationArea.topic = _conversationArea.topic;
          updatedConversationArea.occupants = _conversationArea.occupantsByID;
        } else {
          localConversationAreas = localConversationAreas.concat([
            ConversationArea.fromServerConversationArea(_conversationArea),
          ]);
        }
        setConversationAreas(localConversationAreas);
        recalculateNearbyPlayers();
      });
      socket.on('recreationUpdated', (_recreationArea: ServerRecreationArea) => {
        const updatedRecreationArea = localRecreationAreas.find(
          c => c.label === _recreationArea.label,
        );

        const updateCurrentRecArea = _recreationArea.occupantsByID.includes(gamePlayerID);
        const removeCurrentRecArea =
          localCurrentRecArea?.label === _recreationArea.label && !updateCurrentRecArea;

        if (updatedRecreationArea) {
          updatedRecreationArea.topic = _recreationArea.topic;
          updatedRecreationArea.occupants = _recreationArea.occupantsByID;
          updatedRecreationArea.mafiaGame = _recreationArea.mafiaGame;
          if (updateCurrentRecArea) localCurrentRecArea = updatedRecreationArea;
          else if (removeCurrentRecArea) localCurrentRecArea = undefined;
        } else {
          const newRecArea = RecreationArea.fromServerRecreationArea(_recreationArea);
          localConversationAreas = localConversationAreas.concat([newRecArea]);
          localRecreationAreas = localRecreationAreas.concat([newRecArea]);
          if (updateCurrentRecArea) localCurrentRecArea = newRecArea;
          else if (removeCurrentRecArea) localCurrentRecArea = undefined;
        }
        setCurrentRecArea(() => localCurrentRecArea);
        setConversationAreas(localConversationAreas);
        setRecreationAreas(localRecreationAreas);
        recalculateNearbyPlayers();
      });
      socket.on(
        'lobbyCreated',
        (_recreationArea: ServerRecreationArea, _hostID: string, _mafiaGameID: string) => {
          const existingRecArea = localRecreationAreas.find(a => a.label === _recreationArea.label);

          const host = localPlayers.find(p => p.id === _hostID);

          if (existingRecArea && host) {
            existingRecArea.addMafiaGame(new MafiaGame(_mafiaGameID, host));
            setRecreationAreas(localRecreationAreas);
          }
        },
      );
      socket.on('playerJoinedGame', (_recreationAreaLabel: string, _playerID: string) => {
        const existingRecArea = localRecreationAreas.find(a => a.label === _recreationAreaLabel);
        const player = localPlayers.find(p => p.id === _playerID);
        if (existingRecArea?.mafiaGame && player) {
          existingRecArea.addPlayerToGame(player);
        }
        setRecreationAreas(localRecreationAreas);
      });
      socket.on('lobbyDestroyed', (recreationAreaLabel: string) => {
        const existingRecArea = localRecreationAreas.find(a => a.label === recreationAreaLabel);
        if (existingRecArea?.mafiaGame) {
          existingRecArea.mafiaGame = undefined;
          existingRecArea.endGame();
          console.log(`Lobby disbanded in recArea ${recreationAreaLabel}.`);
        }
        if (localCurrentRecArea?.label === recreationAreaLabel) {
          setIsDead(false);
        }
        setRecreationAreas(localRecreationAreas);
      });
      socket.on('mafiaGameStarted', (_recAreaLabel: string, _playerRoles: ServerGamePlayer[]) => {
        const recArea = localRecreationAreas.find(rec => rec.label === _recAreaLabel);

        if (recArea) {
          recArea.startGame(_playerRoles);
        }
      });
      socket.on(
        'mafiaGameUpdated',
        (_mafiaGameID: string, _phase: string, _gamePlayers: ServerGamePlayer[]) => {
          const mafiaGame = localRecreationAreas.find(area => area.mafiaGame?.id === _mafiaGameID)
            ?.mafiaGame;
          if (mafiaGame) {
            const updatedGamePlayers: GamePlayer[] = [];
            for (let i = 0; i < _gamePlayers.length; i += 1) {
              const player = mafiaGame.players.find(p => p.id === _gamePlayers[i].player);
              if (player) {
                updatedGamePlayers.push(GamePlayer.fromServerGamePlayer(player, _gamePlayers[i]));
              }
            }

            mafiaGame.gamePlayers = updatedGamePlayers;
            mafiaGame.updatePhase();

            const recArea = localRecreationAreas.find(area => area.mafiaGame?.id === _mafiaGameID);
            recArea?.notifyGameUpdated();
            mafiaGame.resetFields();

            if (
              updatedGamePlayers
                .filter(p => !p.isAlive)
                .map(p => p.id)
                .includes(gamePlayerID)
            ) {
              setIsDead(true);
              if (localAudioEnabled) {
                toggleAudioEnabled();
                localAudioEnabled = false;
              }
              if (localVideoEnabled) {
                toggleVideoEnabled();
                localVideoEnabled = false;
              }
            } else {
              setIsDead(false);
            }
          }
        },
      );
      socket.on('playerVoted', (_mafiaGameID: string, _playerID: string, _targetID: string) => {
        const mafiaGame = localRecreationAreas.find(area => area.mafiaGame?.id === _mafiaGameID)
          ?.mafiaGame;
        if (mafiaGame) {
          const player = mafiaGame.gamePlayers.find(p => p.id === _playerID);
          const target = mafiaGame.gamePlayers.find(p => p.id === _targetID);
          if (player && target) {
            player.votedPlayer = _targetID;
            target.vote();
            const recArea = localRecreationAreas.find(rec => rec.mafiaGame?.id === _mafiaGameID);
            recArea?.notifyPlayerVoted(_playerID, _targetID);
          }
        }
      });

      socket.on('mafiaGameEnded', () => {
        // TODO
      });

      socket.on('conversationDestroyed', (_conversationArea: ServerConversationArea) => {
        const existingArea = localConversationAreas.find(a => a.label === _conversationArea.label);
        if (existingArea) {
          existingArea.topic = undefined;
          existingArea.occupants = [];
        }
        localConversationAreas = localConversationAreas.filter(
          a => a.label !== _conversationArea.label,
        );
        setConversationAreas(localConversationAreas);
        recalculateNearbyPlayers();
      });
      socket.on('recreationDestroyed', (_recreationArea: ServerRecreationArea) => {
        const existingRecArea = localRecreationAreas.find(a => a.label === _recreationArea.label);
        if (existingRecArea) {
          existingRecArea.topic = undefined;
          existingRecArea.occupants = [];
          existingRecArea.mafiaGame = undefined;
          existingRecArea.endGame();
        }
        if (localCurrentRecArea?.label === _recreationArea.label) {
          setCurrentRecArea(undefined);
          setIsDead(false);
        }
        localRecreationAreas = localRecreationAreas.filter(a => a.label !== _recreationArea.label);
        localConversationAreas = localConversationAreas.filter(
          a => a.label !== _recreationArea.label,
        );
        setRecreationAreas(localRecreationAreas);
        setConversationAreas(localConversationAreas);
        recalculateNearbyPlayers();
      });
      dispatchAppUpdate({
        action: 'doConnect',
        data: {
          sessionToken,
          userName: video.userName,
          townFriendlyName: townName,
          townID: video.coveyTownID,
          myPlayerID: gamePlayerID,
          townIsPubliclyListed: video.isPubliclyListed,
          emitMovement,
          socket,
        },
      });

      return true;
    },
    [
      playerMovementCallbacks,
      isAudioEnabled,
      isVideoEnabled,
      toggleAudioEnabled,
      toggleVideoEnabled,
    ],
  );
  const videoInstance = Video.instance();

  const { setOnDisconnect } = props;
  useEffect(() => {
    setOnDisconnect(() => async () => {
      // Here's a great gotcha: https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
      dispatchAppUpdate({ action: 'disconnect' });
      return Video.teardown();
    });
  }, [dispatchAppUpdate, setOnDisconnect]);

  const page = useMemo(() => {
    if (!appState.sessionToken) {
      return <Login doLogin={setupGameController} />;
    }
    if (!videoInstance) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <WorldMap />
        <VideoOverlay preferredMode='fullwidth' isDead={isDead} />
      </div>
    );
  }, [appState.sessionToken, videoInstance, isDead, setupGameController]);

  return (
    <CoveyAppContext.Provider value={appState}>
      <VideoContext.Provider value={Video.instance()}>
        <ChatProvider>
          <PlayerMovementContext.Provider value={playerMovementCallbacks}>
            <PlayersInTownContext.Provider value={playersInTown}>
              <NearbyPlayersContext.Provider value={nearbyPlayers}>
                <ConversationAreasContext.Provider value={conversationAreas}>
                  <RecreationAreasContext.Provider value={recreationAreas}>
                    <CurrentRecreationAreaContext.Provider value={currentRecArea}>
                      <IsDeadContext.Provider value={isDead}>{page}</IsDeadContext.Provider>
                    </CurrentRecreationAreaContext.Provider>
                  </RecreationAreasContext.Provider>
                </ConversationAreasContext.Provider>
              </NearbyPlayersContext.Provider>
            </PlayersInTownContext.Provider>
          </PlayerMovementContext.Provider>
        </ChatProvider>
      </VideoContext.Provider>
    </CoveyAppContext.Provider>
  );
}

function EmbeddedTwilioAppWrapper() {
  const { error, setError } = useAppState();
  const [onDisconnect, setOnDisconnect] = useState<Callback | undefined>();
  const connectionOptions = useConnectionOptions();
  return (
    <UnsupportedBrowserWarning>
      <VideoProvider options={connectionOptions} onError={setError} onDisconnect={onDisconnect}>
        <ErrorDialog dismissError={() => setError(null)} error={error} />
        <App setOnDisconnect={setOnDisconnect} />
      </VideoProvider>
    </UnsupportedBrowserWarning>
  );
}

export default function AppStateWrapper(): JSX.Element {
  return (
    <BrowserRouter>
      <ChakraProvider>
        <MuiThemeProvider theme={theme}>
          <AppStateProvider>
            <EmbeddedTwilioAppWrapper />
          </AppStateProvider>
        </MuiThemeProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
}
