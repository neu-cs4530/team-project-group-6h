import {
  Button,
  Container,
  Heading,
  HStack,
  StackDivider,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import GamePlayer, { Role, Team } from '../../classes/GamePlayer';
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
import NextPhaseButton from './NextPhaseButton';

type GameUIProps = {
  recArea: RecreationArea | undefined;
};

// this UI container just needs a hook for whether game has begun, time of day
export default function GameUI({ recArea }: GameUIProps): JSX.Element {
  const { apiClient, sessionToken, currentTownID, myPlayerID } = useCoveyAppState();
  const [gameInstance, setGameInstance] = useState<MafiaGame | undefined>(recArea?.mafiaGame);
  const [gamePlayers, setGamePlayers] = useState<Player[]>([]);
  const [numGamePlayers, setNumGamePlayers] = useState<number>(gameInstance?.players.length || 0);
  const [alivePlayers, setAlivePlayers] = useState<GamePlayer[]>(gameInstance?.alivePlayers || []);
  const [deadPlayers, setDeadPlayers] = useState<GamePlayer[]>(gameInstance?.deadPlayers || []);
  const [gameCanStart, setGameCanStart] = useState<boolean>(gameInstance?.canStart() || false);
  const [isPlayerHost, setIsPlayerHost] = useState<boolean>(false);
  const [host, setHost] = useState<Player | undefined>(gameInstance?.host);
  const [gamePhase, setGamePhase] = useState<string | undefined>(gameInstance?.phase);
  const [playerRole, setPlayerRole] = useState<Role | undefined>(Role.Unassigned);
  const [playerRoleInfo, setPlayerRoleInfo] = useState<string | undefined>();
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [playerTeam, setPlayerTeam] = useState<Team | undefined>(undefined);


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
        setGamePlayers(game.players);
        setDeadPlayers(game.deadPlayers);
        setAlivePlayers(game.alivePlayers);
        setNumGamePlayers(game.players.length);
        setGamePhase(game.phase);
        setPlayerRole(game.playerRole(myPlayerID));
        setPlayerRoleInfo(game.gamePlayers.find(p => p.id === myPlayerID)?.roleInfo);
        setHasVoted(game.gamePlayers.find(p=>p.id===myPlayerID)?.votedPlayer !== undefined);
      },
      onMafiaGameStarted: (game: MafiaGame) => {
        setGamePhase(game.phase);
        const myGamePlayer = game.gamePlayers.find(p => p.id === myPlayerID);
        setPlayerRole(game.playerRole(myPlayerID));
        setPlayerRoleInfo(myGamePlayer?.roleInfo);
        setPlayerTeam(myGamePlayer?.team);
      },
      onMafiaGameDestroyed: () => {
        setGameInstance(undefined);
        setGameCanStart(false);
        setGamePlayers([]);
        setAlivePlayers([]);
        setDeadPlayers([]);
      },
    };
    recArea?.addRecListener(updateListener);
    return () => {
      recArea?.removeListener(updateListener);
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
    alivePlayers,
    deadPlayers,
    host,
    setGamePhase,
    playerRole,
    setPlayerRole,
    playerTeam,
    setPlayerTeam,
  ]);

  if (recArea && gameInstance && gamePlayers.map(p => p.id).includes(myPlayerID)) {
    // inLobby = gameInstance._phase === Phase.lobby;
    if (gamePhase === 'lobby') {
      return (
        <Container
          align='left'
          spacing={2}
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
            <h2>{`Host: ${host?.userName}`}</h2>
            <HStack
              width='full'
              borderColor='gray.500'
              divider={<StackDivider borderColor='black' />}>
              <GameUILobbyRoles />
              <GameUILobbyRules />
              <GameUILobbyPlayersList 
              players={gamePlayers}/>
            </HStack>
            <HStack>
              {gameInstance && isPlayerHost && gameCanStart ? (
                <StartGameButton area={recArea} myPlayerID={myPlayerID} />
              ) : (
                <> </>
              )}
              <Button colorScheme='red' onClick={disbandLobby}>
                Disband Lobby
              </Button>
            </HStack>
          </VStack>
        </Container>
      );
    }
    let lobbyButton;
    if (isPlayerHost && gameInstance) {
      if (gamePhase !== 'win') {
        lobbyButton = (<NextPhaseButton
          area={recArea}
          myPlayerID={myPlayerID}
          gameInstanceID={gameInstance.id}
          />);
      } else {
        lobbyButton = <Button onClick={disbandLobby}>Exit Game</Button>;
      }
    } else {
      lobbyButton = <></>;
    }

    const isDay = gamePhase === 'day_discussion' || gamePhase === 'day_voting';
    return (
      <Container
        align='left'
        spacing={2}
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
            <GameUITimer gameName={recArea.label} gamePhase={gameInstance.phase} />
          </HStack>
          <HStack width='full' alignItems='stretch' align='flex-start'>
            <VStack align='left'>
              <GameUIRoleDescription
                playerRole={playerRole}
                playerRoleInfo={playerRoleInfo || 'Error: no role info'}
                playerTeam={playerTeam}
              />
              <GameUIRoleList />
            </VStack>
            <GameUIVideoOverlay game={gameInstance} gamePhase={gamePhase} />
            <VStack>
              <GameUIAlivePlayerList 
              players={gameInstance.alivePlayers} 
              playerTeam={gameInstance.playerTeam(myPlayerID)} 
              playerRole={playerRole} 
              gamePhase={gamePhase} 
              hasVoted={hasVoted} 
              voteFunc={voteFunc}/>
              <GameUIDeadPlayerList players={gameInstance.deadPlayers} />
            </VStack>
          </HStack>
        </VStack>
      </Container>
    );
  }
  return <></>;
}
