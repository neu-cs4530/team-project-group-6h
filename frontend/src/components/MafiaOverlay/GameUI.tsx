import {
  Button,
  Container,
  Heading,
  HStack,
  StackDivider,
  Tooltip,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { Role, Team } from '../../classes/GamePlayer';
import MafiaGame from '../../classes/MafiaGame';
import Player from '../../classes/Player';
import RecreationArea, { RecreationAreaListener } from '../../classes/RecreationArea';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import StartGameButton from '../SocialSidebar/StartGameButton';
import {
  GameUIAlivePlayerList,
  GameUIDeadPlayerList,
  GameUIHeader,
  GameUILobbyPlayersList,
  GameUILobbyRoles,
  GameUILobbyRules,
  GameUIRoleList,
  GameUITimer,
  GameUIVideoOverlay,
} from './GameUIComponents';
import GameUIRoleDescription from './GameUIRoleDescription';
import GameUIWinOverlay from './GameUIWinOverlay';
import NextPhaseButton from './NextPhaseButton';

type GameUIProps = {
  recArea: RecreationArea | undefined;
};

type PlayerVoteTally = {
  playerID: string;
  voteTally: number;
};

// this UI container just needs a hook for whether game has begun, time of day
export default function GameUI({ recArea }: GameUIProps): JSX.Element {
  const { apiClient, sessionToken, currentTownID, myPlayerID } = useCoveyAppState();
  const [gameInstance, setGameInstance] = useState<MafiaGame | undefined>(recArea?.mafiaGame);
  const [gamePlayers, setGamePlayers] = useState<Player[]>([]);
  const [numGamePlayers, setNumGamePlayers] = useState<number>(gameInstance?.players.length || 0);
  const [gameCanStart, setGameCanStart] = useState<boolean>(gameInstance?.canStart() || false);
  const [isPlayerHost, setIsPlayerHost] = useState<boolean>(false);
  const [host, setHost] = useState<Player | undefined>(gameInstance?.host);
  const [gamePhase, setGamePhase] = useState<string | undefined>(gameInstance?.phase);
  const [playerRole, setPlayerRole] = useState<Role | undefined>(Role.Unassigned);
  const [playerRoleInfo, setPlayerRoleInfo] = useState<string | undefined>();
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [playerTeam, setPlayerTeam] = useState<Team | undefined>(undefined);
  // const [playerVoteTally, setPlayerVoteTally] = useState<number | undefined>(undefined);
  const [playerVoteTallies, setPlayerVoteTallies] = useState<PlayerVoteTally[]>();

  const toast = useToast();

  const voteFunc = useCallback(async () => {
    setHasVoted(true);
  }, [setHasVoted]);

  const disbandLobby = useCallback(async () => {
    if (myPlayerID === recArea?.mafiaGame?.host.id) {
      try {
        await apiClient.destroyGameLobby({
          coveyTownID: currentTownID,
          sessionToken,
          recreationAreaLabel: recArea?.label,
        });
        toast({
          title: 'Mafia Game Lobby Disbanded.',
          status: 'success',
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast({
            title: 'Unable to disband lobby',
            description: err.toString(),
            status: 'error',
          });
        }
      }
    } else {
      toast({
        title: `Only the host can disband the lobby.`,
      });
    }
  }, [apiClient, currentTownID, myPlayerID, recArea, sessionToken, toast]);

  const startGame = useCallback(async () => {
    if (recArea) {
      try {
        await apiClient.startGame({
          coveyTownID: currentTownID,
          sessionToken,
          recreationAreaLabel: recArea.label,
          playerStartID: myPlayerID,
        });
        toast({
          title: 'Mafia Game Started!',
          status: 'success',
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast({
            title: 'Unable to start Mafia Game',
            description: err.toString(),
            status: 'error',
          });
        }
      }
    } else {
      toast({
        title: 'Unable to start Mafia Game, rec area is undefined',
        description: '',
        status: 'error',
      });
    }
  }, [apiClient, sessionToken, currentTownID, toast, recArea, myPlayerID]);

  const leaveLobby = useCallback(async () => {
    if (recArea) {
      try {
        await apiClient.leaveGameLobby({
          coveyTownID: currentTownID,
          sessionToken,
          recreationAreaLabel: recArea.label,
          playerID: myPlayerID,
        });
        toast({
          title: 'Left mafia game',
          status: 'success',
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast({
            title: 'Unable to leave Mafia Game',
            description: err.toString(),
            status: 'error',
          });
        }
      }
    } else {
      toast({
        title: 'Unable to leave Mafia Game, rec area is undefined',
        description: '',
        status: 'error',
      });
    }
  }, [apiClient, sessionToken, currentTownID, toast, recArea, myPlayerID]);

  const resetVoteTallies = (game: MafiaGame) => {
    const voteTallies: PlayerVoteTally[] = [];
    for (let i = 0; i < game.alivePlayers.length; i += 1) {
      const voteTally = { playerID: game.alivePlayers[i].id, voteTally: 0 };
      voteTallies.push(voteTally);
    }
    return voteTallies;
  };

  const phaseDuration = 90;
  const [timeLeft, setTimeLeft] = useState(phaseDuration);

  useEffect(() => {
    const updateListener: RecreationAreaListener = {
      onMafiaGameCreated: (game: MafiaGame) => {
        setGameInstance(game);
        setIsPlayerHost(game.host.id === myPlayerID);
        setGamePlayers(game.players);
        setGamePhase(game.phase);
      },
      onMafiaGameUpdated: (game: MafiaGame) => {
        setGameInstance(game);
        setGameCanStart(game.canStart());
        setHost(game.host);
        setIsPlayerHost(game.host.id === myPlayerID);
        setGamePlayers([...game.players]);
        setNumGamePlayers(game.players.length);

        if (game.phase !== gamePhase) {
          setTimeLeft(phaseDuration);
        }

        setGamePhase(game.phase);
        setPlayerRole(game.playerRole(myPlayerID));
        const player = game.gamePlayers.find(p => p.id === myPlayerID);
        setPlayerRoleInfo(player?.roleInfo);
        setHasVoted(player?.votedPlayer !== undefined);
        setPlayerVoteTallies([...resetVoteTallies(game)]);
        const result = player?.result;
        if (result) {
          toast({
            title: `TOWN NEWS`,
            description: result,
          });
        }
      },
      onMafiaGameStarted: (game: MafiaGame) => {
        setGamePhase(game.phase);
        const myGamePlayer = game.gamePlayers.find(p => p.id === myPlayerID);
        setPlayerRole(game.playerRole(myPlayerID));
        setPlayerRoleInfo(myGamePlayer?.roleInfo);
        setPlayerTeam(myGamePlayer?.team);
        setPlayerVoteTallies([...resetVoteTallies(game)]);
      },
      onMafiaGameDestroyed: () => {
        setGameInstance(undefined);
        setGameCanStart(false);
        setGamePlayers([]);
      },
      onMafiaGamePlayerVoted: (voterID: string, votedID: string) => {
        if (voterID === myPlayerID) {
          setHasVoted(true);
        }
        const tallies = playerVoteTallies;
        tallies?.forEach(p => {
          if (p.playerID === votedID) {
            p.voteTally += 1;
          }
        });
        setPlayerVoteTallies(tallies ? [...tallies] : undefined);
      },
    };
    recArea?.addRecListener(updateListener);
    return () => {
      recArea?.removeRecListener(updateListener);
    };
  }, [
    myPlayerID,
    gameInstance,
    setGameInstance,
    gamePlayers,
    setGamePlayers,
    recArea,
    numGamePlayers,
    setNumGamePlayers,
    gamePhase,
    host,
    setGamePhase,
    playerRole,
    setPlayerRole,
    playerTeam,
    setPlayerTeam,
    playerVoteTallies,
    setPlayerVoteTallies,
    toast,
  ]);

  if (!gamePlayers.map(p => p.id).includes(myPlayerID)) {
    return <></>;
  }

  if (recArea && gameInstance && gamePlayers.map(p => p.id).includes(myPlayerID)) {
    // inLobby = gameInstance._phase === Phase.lobby;
    if (gamePhase === 'lobby') {
      return (
        <Container
          border='2px'
          padding='15'
          borderColor='gray.500'
          minWidth='100%'
          minHeight='100%'
          borderRadius='50px'
          backgroundColor='#ededed'>
          <VStack>
            <Heading fontSize='xl' as='h1'>
              Welcome to MAFIA - {recArea.label}
            </Heading>
            <h2>{`Host: ${gameInstance.host.userName}`}</h2>
            <HStack
              width='full'
              borderColor='gray.500'
              divider={<StackDivider borderColor='black' />}>
              <GameUILobbyRoles />
              <GameUILobbyRules />
              <GameUILobbyPlayersList players={gamePlayers} />
            </HStack>
            <HStack>
              {!gameCanStart && (
                <Tooltip label='At least four players are required to start!'>
                  <h3>Waiting for players...</h3>
                </Tooltip>
              )}

              {gameInstance && isPlayerHost && gameCanStart && (
                <StartGameButton area={recArea} myPlayerID={myPlayerID} />
              )}

              {gameInstance && !isPlayerHost && gameCanStart && (
                <h3>Waiting for host to start game...</h3>
              )}

              {gameInstance && isPlayerHost && (
                <Button colorScheme='red' onClick={disbandLobby}>
                  Disband Lobby
                </Button>
              )}

              {gameInstance && !isPlayerHost && (
                <Button colorScheme='red' onClick={leaveLobby}>
                  Leave Game
                </Button>
              )}
            </HStack>
          </VStack>
        </Container>
      );
    }
    let lobbyButton;
    if (isPlayerHost && gameInstance) {
      if (gamePhase !== 'win') {
        lobbyButton = (
          <NextPhaseButton
            area={recArea}
            myPlayerID={myPlayerID}
            gameInstanceID={gameInstance.id}
          />
        );
      } else {
        lobbyButton = <Button onClick={disbandLobby}>Exit Game</Button>;
      }
    } else {
      lobbyButton = <></>;
    }

    if (gamePhase !== 'win') {
      const isDay = gamePhase === 'day_discussion' || gamePhase === 'day_voting';
      return (
        <Container
          border='2px'
          padding='15'
          borderColor='gray.500'
          minWidth='100%'
          minHeight='100%'
          borderRadius='50px'
          backgroundColor={isDay ? '#ededed' : '#7d7d7d'}
          className={isDay ? 'ui-container-day' : 'ui-container-night'}>
          <VStack>
            <HStack>
              <div margin-left='100px'>
                <GameUIHeader gameName={recArea.label} gamePhase={gameInstance.phase} />
              </div>
              <Container width='300px' />
              {lobbyButton}
              <GameUITimer
                gameInstanceID={gameInstance.id}
                isPlayerHost={isPlayerHost}
                timeLeft={timeLeft}
                setTimeLeft={setTimeLeft}
              />
            </HStack>
            <HStack width='full' alignItems='stretch' align='flex-start'>
              <VStack align='left'>
                <GameUIRoleDescription
                  playerRole={playerRole}
                  playerRoleInfo={playerRoleInfo || 'Error: no role info'}
                  playerTeam={playerTeam}
                  gamePlayers={gameInstance.gamePlayers}
                />
                <GameUIRoleList gamePlayers={[...gameInstance.alivePlayers]} />
              </VStack>
              <GameUIVideoOverlay game={gameInstance} gamePhase={gamePhase} />
              <VStack>
                <GameUIAlivePlayerList
                  myPlayerID={myPlayerID}
                  players={[...gameInstance.alivePlayers].sort((p1, p2) =>
                    p1.userName.localeCompare(p2.userName, undefined, {
                      numeric: true,
                      sensitivity: 'base',
                    }),
                  )}
                  playerTeam={gameInstance.playerTeam(myPlayerID)}
                  playerRole={playerRole}
                  gamePhase={gamePhase}
                  hasVoted={hasVoted}
                  voteFunc={voteFunc}
                />
                <GameUIDeadPlayerList players={gameInstance.deadPlayers} />
              </VStack>
            </HStack>
          </VStack>
        </Container>
      );
    }
  }
  return recArea && gameInstance && gamePhase === 'win' ? (
    <GameUIWinOverlay
      game={gameInstance}
      isPlayerHost={isPlayerHost}
      disbandLobby={disbandLobby}
      startGame={startGame}
      leaveLobby={leaveLobby}
    />
  ) : (
    <></>
  );
}
