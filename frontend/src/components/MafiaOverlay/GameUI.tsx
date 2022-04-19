import { Button, Container, Heading, HStack, StackDivider, VStack } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import MafiaGame, { Phase } from '../../classes/MafiaGame';
import RecreationArea, { RecreationAreaListener } from '../../classes/RecreationArea';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import StartGameButton from '../SocialSidebar/StartGameButton';
import {
  GameUIAlivePlayerList,
  GameUIDeadPlayerList,
  GameUIHeader,
  GameUILobbyPlayersList,
  GameUILobbyRoles,
  GameUILobbyRules,
  GameUIRoleDescription,
  GameUIRoleList,
  GameUITimer,
  GameUIVideoOverlay,
} from './GameUIComponents';
import NextPhaseButton from './NextPhaseButton';

type GameUIProps = {
  myID: string;
  recArea: RecreationArea | undefined;
};

// this UI container just needs a hook for whether game has begun, time of day
export default function GameUI({ myID, recArea } : GameUIProps): JSX.Element {
    const [gameInstance, setGameInstance] = useState<MafiaGame | undefined>(recArea?.mafiaGame);
    // tracks list of game players
    const [gamePlayers, setGamePlayers] = useState<Player[]>(recArea?.mafiaGame?.players || []);
    const [gameCanStart, setGameCanStart] = useState<boolean>(gameInstance?.canStart() || false);
    const [isPlayerHost, setIsPlayerHost] = useState<boolean>(false);
    const players = usePlayersInTown();

    // checks if my player is in a game
    const isPlayerInGame = useCallback((): boolean => {
        const foundPlayer = gamePlayers.find(p => p.id === myID);
        return foundPlayer !== undefined;
    }, [gamePlayers, myID]);

    // keeps track of my player's game state
    const [playerInGame, setPlayerInGame] = useState(isPlayerInGame());

    const isPlayerInArea = (_occupants: string[] | undefined): boolean => {
    if (_occupants === undefined) {
      return false;
    }
    const found = _occupants.includes(myID);
    return found;
  };

    useEffect(() => {
        const updateListener: RecreationAreaListener = {
            onMafiaGameCreated: (game: MafiaGame) => {
                setGameInstance(game); 
                setGamePlayers(game.players);
                setPlayerInGame(isPlayerInGame());
                setIsPlayerHost(game.host.id === myID);
            },
            onMafiaGameUpdated: (game: MafiaGame) => {
                console.log('In onMafiaGameUpdated')
                setGameInstance(game);
                setGamePlayers(game.players);
                setPlayerInGame(isPlayerInGame());
                setGameCanStart(game.canStart());
            },
            
        };
        recArea?.addRecListener(updateListener);
        return () => {
            recArea?.removeListener(updateListener);
        };
    }, [gameInstance, setGameInstance, recArea, gamePlayers, isPlayerInGame]);

    if (recArea && gameInstance && isPlayerInGame()) {
        const inLobby = (gameInstance._phase === Phase.lobby);

    if (inLobby) {
      return (
        <Container
          align='left'
          spacing={2}
          border='2px'
          padding={15}
          borderColor='gray.500'
          minWidth='100%'
          minHeight='100%'
          borderRadius='50px'
          backgroundColor='#ededed'>
          <VStack>
            <Heading fontSize='xl' as='h1'>
              Welcome to MAFIA - {recArea.label}
            </Heading>
            <HStack
              width='full'
              borderColor='gray.500'
              divider={<StackDivider borderColor='black' />}>
              <GameUILobbyRoles />
              <GameUILobbyRules />
              {/* <GameUILobbyPlayersList players={playersInRecArea} /> */}
            </HStack>
            <HStack>
              {gameInstance && isPlayerHost && gameCanStart ? (
                <StartGameButton area={recArea} myPlayerID={myID} />
              ) : (
                <> </>
              )}
              <Button colorScheme='red'>Disband Lobby</Button>
            </HStack>
          </VStack>
        </Container>
      );
    }
    const isDay = gameInstance.phase === 'day_discussion' || gameInstance.phase === 'day_voting';
    return (
      <Container
        align='left'
        spacing={2}
        border='2px'
        padding={15}
        borderColor='gray.500'
        minWidth='100%'
        minHeight='100%'
        borderRadius='50px'
        backgroundColor={isDay ? '#ededed' : '#7d7d7d'}
        className={isDay ? 'ui-container-day' : 'ui-container-night'}>
        <VStack>
          <HStack>
            <div margin-left='100px'>
              <GameUIHeader gameName={recArea.label} gamePhase={gameInstance.phase.toString()} />
            </div>
            <Container width='455px' />
            <GameUITimer />
          </HStack>
          <HStack width='full' alignItems='stretch' align='flex-start'>
            <VStack align='left'>
              <GameUIRoleDescription playerRole={gameInstance.playerRole(myID)} />
              <GameUIRoleList />
            </VStack>
            <GameUIVideoOverlay />
            <VStack>
              <GameUIAlivePlayerList
                players={gameInstance.alivePlayers.map(player => player.userName)}
              />
              <GameUIDeadPlayerList
                players={gameInstance.deadPlayers.map(player => player.userName)}
              />
            </VStack>
          </HStack>
          <HStack>
            <NextPhaseButton area={recArea} />
          </HStack>
        </VStack>
      </Container>
    );
  }
  return <></>;
}
