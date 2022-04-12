import { Container, Heading, StackDivider, VStack, HStack, Button } from '@chakra-ui/react';
import React, { useEffect, useReducer, useState } from 'react';
import { Socket } from 'socket.io-client';
// import MafiaGame, { Phase } from '../../../../services/townService/src/lib/mafia_lib/MafiaGame';
import MafiaGame, { Phase } from '../../classes/MafiaGame';
import RecreationArea, { RecreationAreaListener } from '../../classes/RecreationArea';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import useRecreationAreas from '../../hooks/useRecreationAreas';
import { GameUIHeader, GameUITimer, GameUIRoleDescription, GameUIRoleList, GameUIVideoOverlay, GameUIAlivePlayerList, GameUIDeadPlayerList, GameUILobbyHeader, GameUILobbyRoles, GameUILobbyRules, GameUILobbyPlayersList } from './GameUIComponents';

type GameUIProps = {
    myID: string;
    recArea: RecreationArea | undefined;
}

// this UI container just needs a hook for whether game has begun, time of day
export default function GameUI({myID, recArea} : GameUIProps): JSX.Element {
    const [gameInstance, setGameInstance] = useState<MafiaGame | undefined>(recArea?.mafiaGame);
    const players = Array.from(usePlayersInTown());

    useEffect(() => {
        const updateListener: RecreationAreaListener = {
            onMafiaGameCreated: (game: MafiaGame) => {
                setGameInstance(game); 
            },
            onMafiaGameUpdated: (game: MafiaGame) => {
                setGameInstance(game);
            }
        };
        recArea?.addRecListener(updateListener);
        return () => {
            recArea?.removeListener(updateListener);
        };
    }, [gameInstance, setGameInstance, recArea]);

    if (recArea && gameInstance) {
        const inLobby = (gameInstance.phase === Phase.lobby);

        const playersInRecArea = recArea.occupants.map((id) => (players.find((player) => player.id === id))?.userName);

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
                    <Heading fontSize='xl' as='h1'>Welcome to MAFIA - {recArea.label}</Heading>
                        <HStack
                            width='full'
                            borderColor='gray.500'
                            divider={<StackDivider borderColor='black' />}>
                            <GameUILobbyRoles />
                            <GameUILobbyRules />
                            <GameUILobbyPlayersList players={playersInRecArea}/>
                        </HStack>
                        <HStack>
                            <Button colorScheme='blue'>Start Game</Button>   
                            <Button colorScheme='red'>Disband Lobby</Button>
                        </HStack>
                    </VStack>
                </Container>  
            );
        }
        const isDay = (gameInstance.phase.toString() === 'day_discussion' || gameInstance.phase.toString() === 'day_voting');
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
                            <GameUIHeader gameName={recArea.label} gamePhase={gameInstance.phase.toString()}/>
                        </div>
                        <Container width='455px' />
                        <GameUITimer />
                        </HStack>
                        <HStack
                            width='full'
                            alignItems='stretch'
                            align='flex-start'>
                            <VStack align='left'>
                                <GameUIRoleDescription playerRole={gameInstance.playerRole(myID)} />
                                <GameUIRoleList />
                            </VStack>
                            <GameUIVideoOverlay />
                            <VStack>
                                <GameUIAlivePlayerList players={gameInstance.alivePlayers.map((player) => (player.userName))}/>
                                <GameUIDeadPlayerList players={gameInstance.deadPlayers.map((player) => (player.userName))} />
                            </VStack>
                        </HStack>
                    </VStack>
                </Container>
            );
        } 
        return (<></>);
    }