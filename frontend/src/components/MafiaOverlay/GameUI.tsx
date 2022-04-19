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
import MafiaGame, { Phase } from '../../classes/MafiaGame';
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
  GameUIRoleDescription,
  GameUIRoleList,
  GameUITimer,
  GameUIVideoOverlay,
} from './GameUIComponents';
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
  const [gameCanStart, setGameCanStart] = useState<boolean>(gameInstance?.canStart() || false);
  const [isPlayerHost, setIsPlayerHost] = useState<boolean>(false);
  let inLobby = false;

  const toast = useToast();

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
      },
      onMafiaGameUpdated: (game: MafiaGame) => {
        setGameInstance(game);
        setGameCanStart(game.canStart());
        setGamePlayers(game.players);
        setNumGamePlayers(game.players.length);
      },
      onMafiaGameDestroyed: () => {
        setGameInstance(undefined);
        setGameCanStart(false);
        setGamePlayers([]);
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
  ]);

  if (recArea && gameInstance && gamePlayers.map(p => p.id).includes(myPlayerID)) {
    inLobby = gameInstance._phase === Phase.lobby;
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
              <GameUILobbyPlayersList players={gamePlayers} />
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
              <GameUIRoleDescription playerRole={gameInstance.playerRole(myPlayerID)} />
              <GameUIRoleList />
            </VStack>
            <GameUIVideoOverlay />
            <VStack>
              <GameUIAlivePlayerList players={gameInstance.alivePlayers} />
              <GameUIDeadPlayerList players={gameInstance.deadPlayers} />
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
