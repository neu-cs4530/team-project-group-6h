import { Container, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { StringMappingType } from 'typescript';
import { Role } from '../../../../services/townService/src/lib/mafia_lib/GamePlayer';

type GameUIHeaderProps = {
    gameName: string
    gamePhase: string
}

// Needs hook into game name, time of day
export function GameUIHeader({gameName, gamePhase}: GameUIHeaderProps): JSX.Element {
    const isDay = true;
    return (
    <Heading fontSize='xl' as='h1' color={isDay ? 'black' : 'white'}>{gameName}: {gamePhase}</Heading>
    );
}

type GameUITimerProps = {
    gameTimeLeft: number
}

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

type GameUIRoleDescriptionProps = {
    playerRole: Role | undefined,
}

export function GameUIRoleDescription({playerRole}: GameUIRoleDescriptionProps): JSX.Element {
    return (
        <Container
                width="200px"
                height="296px"
                className='ui-container'>
                <Heading fontSize='xl' as='h1'>My Role:<br/>{playerRole ? playerRole.toString() : 'undefined'}</Heading>
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

type GameUIPlayerListProps = {
    players: (string | undefined)[]
}
// needs an array map from players to strings
export function GameUIAlivePlayerList({players}: GameUIPlayerListProps): JSX.Element {
    return (
        <Container 
            width="200px"
            height="296px"
            className='ui-container'
                >
                    <Heading fontSize='xl' as='h1'>Players</Heading>
                    <ul>
                    {players.map((player) => (player ? <li key={player}>{player}</li> : (<li />)))}
                    </ul>
                </Container>
    );
}
 
export function GameUIDeadPlayerList({players}: GameUIPlayerListProps): JSX.Element {
    return (
        <Container
            width="200px"
            height="296px"
            className='ui-container'
                >
                    <Heading fontSize='xl' as='h1'>Graveyard</Heading>
                    <Text fontSize='xs'>{players[0]}</Text>
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

type GameUILobbyHeaderProps = {
    gameName: string,
}

export function GameUILobbyHeader({gameName}: GameUILobbyHeaderProps): JSX.Element {
    return (
    <Heading fontSize='xl' as='h1'>Welcome to {gameName}</Heading>
    );
}

export function GameUILobbyRoles(): JSX.Element {
    return (
        <Container
            width='350px'
            height='550px'>
            <Heading>Roles</Heading>
            <ul>
                <li>General Town: able to vote on a member of the town to lynch</li>
                <li>Doctor: can block the mafia from killing a town member for one night</li>
                <li>Investigator: can discover the role of another town member each night</li>
                <li>General Mafia: can plot to kill members of the town at night</li>
                <li>Godfather: can choose who to kill on behalf of the mafia</li>
            </ul>
        </Container>
    );
}

export function GameUILobbyRules(): JSX.Element {
    return (
        <Container 
            width="500px"
            height="550px">
            <Heading>Rules</Heading>
            <Text>The town is split into town members (General Town, Doctor, Investigator) and mafia members (General Mafia, Godfather). <br/><br/>
                Every night, the mafia can choose one town member to kill. Using the information from special roles and who was killed, 
                everyone must discuss who, if anyone, to lynch during the day. <br/><br/>The town wins if all mafia members are killed, and the 
                mafia win if all the town are killed.
            </Text>
        </Container>
    );
}

export function GameUILobbyPlayersList({players}: GameUIPlayerListProps): JSX.Element {
    return (
        <Container 
            width="350px"
            height="550px">
            <Heading>Players</Heading>
            <ul>
            {players.map((p: string | undefined) => (p ? <li key={p}>{p}</li> : <li />))}
            </ul>
        </Container>
    );
}
