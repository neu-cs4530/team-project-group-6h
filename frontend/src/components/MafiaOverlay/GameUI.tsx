import { Container, Heading, Text, VStack, HStack } from '@chakra-ui/react';
import React from 'react';
import { GameUIHeader, GameUITimer, GameUIRoleDescription, GameUIRoleList, GameUIVideoOverlay, GameUIAlivePlayerList, GameUIDeadPlayerList, GameUILobbyHeader, GameUILobbyRules, GameUILobbyPlayersList } from './GameUIComponents';
// import ConversationAreasList from './ConversationAreasList';
// import PlayersList from './PlayersList';

// this UI container just needs a hook for whether game has begun, time of day
export default function GameUI(): JSX.Element {
    const showUI = false;
    const inLobby = true;
    const isDay = true;
    
    if (showUI) {
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
                    <Heading fontSize='xl' as='h1'>Welcome to [Game Name]</Heading>
                        <HStack
                            width='full'
                            borderColor='gray.500'>
                            <GameUILobbyHeader />
                            <div className='game-lobby-divider'/>
                            <GameUILobbyRules />
                            <div className='game-lobby-divider'/>
                            <GameUILobbyPlayersList />
                        </HStack>
                        <Container>
                            buttons to be placed here
                        </Container>

                    </VStack>
                </Container>  
            );
        }
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
                            <GameUIHeader />
                        </div>
                        <Container width='455px' />
                        <GameUITimer />
                        </HStack>
                        <HStack
                            width='full'
                            alignItems='stretch'
                            align='flex-start'>
                            <VStack align='left'>
                                <GameUIRoleDescription />
                                <GameUIRoleList />
                            </VStack>
                            <GameUIVideoOverlay />
                            <VStack>
                                <GameUIAlivePlayerList />
                                <GameUIDeadPlayerList />
                            </VStack>
                        </HStack>
                    </VStack>
                </Container>
            );
        } 
        return (<></>);
    }