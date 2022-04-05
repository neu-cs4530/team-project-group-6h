import { Container, Heading, Text } from '@chakra-ui/react';
import React from 'react';

// Needs hook into game name, time of day
export function GameUIHeader(): JSX.Element {
    const isDay = true;
    return (
    <Heading fontSize='xl' as='h1' color={isDay ? 'black' : 'white'}>Game Name: Day N Discussion</Heading>
    );
}

// Needs hook into time remaining for each voting period
export function GameUITimer(): JSX.Element {
    return (
        <Container 
                width='100px'
                height='62px'
                align='center'
                className='ui-container'>
                <Heading fontSize='xl' as='h1'>1:30</Heading>
                </Container>
    );
}

// needs hook into player role
export function GameUIRoleDescription(): JSX.Element {
    return (
        <Container
                width="200px"
                height="296px"
                className='ui-container'
            >
                <Heading fontSize='xl' as='h1'>My Role:<br/>Sample role</Heading>
                <Text fontSize='md'><br/>Abilities: <br/>- can do this<br/>- can also do this</Text>
            </Container>
    );
}

// may not need hook for this
export function GameUIRoleList(): JSX.Element {
    return (
        <Container
                width="200px"
                height="296px"
                className='ui-container'
            >
                <Heading fontSize='xl' as='h4'>All Roles</Heading>
                <ul>
                    <li><Text color='#00a108'>Investigator</Text></li>
                    <li><Text color='#00a108'>Doctor</Text></li>
                    <li><Text color='#00a108'>General Town</Text></li>
                    <li><Text color='#940000'>Mafia</Text></li>
                    <li><Text color='#940000'>Godfather</Text></li>
                </ul>
            </Container>
    );
}

// needs hook into list of alive players
export function GameUIAlivePlayerList(): JSX.Element {
    return (
        <Container 
            width="200px"
            height="296px"
            className='ui-container'
                >
                    <Heading fontSize='xl' as='h1'>Players</Heading>
                    <Text fontSize='xs'>- Player 1<br/>- Player 2<br/>- Player 3<br/>- Player 4</Text>
                </Container>
    );
}
 
// needs hook into list of dead players
export function GameUIDeadPlayerList(): JSX.Element {
    return (
        <Container
            width="200px"
            height="296px"
            className='ui-container'
                >
                    <Heading fontSize='xl' as='h1'>Graveyard</Heading>
                    <Text fontSize='xs'>- Player 5<br/>- Player 6<br/>- Player 7<br/>- Player 8</Text>
                </Container>
    );
}

// needs integration with Twilio API
// does not need background color, since entire screen will be video
export function GameUIVideoOverlay(): JSX.Element {
    return (
        <Container
                borderWidth='3px'
                maxW="full"
                height="600px"
                borderRadius='0px'
                borderColor='black'
                backgroundColor='#fafafa'
            >
                <Heading fontSize='xl' as='h1'>VIDEO CALL</Heading>
            </Container>
    );
}

export function GameUILobbyHeader(): JSX.Element {
    return (
        <Container
            width='300px'
            height='550px'>
            <Heading>Roles:</Heading>
            <Text>- General Town<br/>- Doctor<br/>- Investigator<br/>- Mafia Member<br/>- Godfather</Text>
        </Container>
    );
}

export function GameUILobbyRules(): JSX.Element {
    return (
        <Container 
            width="200px"
            height="296px"
            className='ui-container'
                >
                    <Heading fontSize='xl' as='h1'>Players</Heading>
                    <Text fontSize='xs'>- Player 1<br/>- Player 2<br/>- Player 3<br/>- Player 4</Text>
                </Container>
    );
}

export function GameUILobbyPlayersList(): JSX.Element {
    return (
        <Container 
            width="200px"
            height="296px"
            className='ui-container'
                >
                    <Heading fontSize='xl' as='h1'>Players</Heading>
                    <Text fontSize='xs'>- Player 1<br/>- Player 2<br/>- Player 3<br/>- Player 4</Text>
                </Container>
    );
}
