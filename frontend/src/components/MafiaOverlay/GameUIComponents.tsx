import { Container, Heading, Text, Button } from '@chakra-ui/react';
import React from 'react';
import GamePlayer, { Role, Team } from '../../classes/GamePlayer';
import MafiaGame, { Phase } from '../../classes/MafiaGame';
import Player from '../../classes/Player';
import ParticipantList from '../VideoCall/VideoFrontend/components/ParticipantList/ParticipantList';
import VideoOverlay from '../VideoCall/VideoOverlay/VideoOverlay';
import GameUIVideo from './GameUIVideo';

type GameUIHeaderProps = {
  gameName: string;
  gamePhase: string;
};

// Needs hook into game name, time of day
export function GameUIHeader({ gameName, gamePhase }: GameUIHeaderProps): JSX.Element {
  const isDay = true;
  return (
    <Heading fontSize='xl' as='h1' color={isDay ? 'black' : 'white'}>
      {gameName}: {gamePhase}
    </Heading>
  );
}

export function GameUITimer(): JSX.Element {
  return (
    <Container width='100px' height='62px' align='center' className='ui-container'>
      <Heading fontSize='xl' as='h1'>
        1:30
      </Heading>
    </Container>
  );
}
/*
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
*/

// may not need hook for this
export function GameUIRoleList(): JSX.Element {
  return (
    <Container width='200px' height='296px' className='ui-container'>
      <Heading fontSize='xl' as='h4'>
        All Roles
      </Heading>
      <ul>
        <li>
          <Text color='#00a108'>Investigator</Text>
        </li>
        <li>
          <Text color='#00a108'>Doctor</Text>
        </li>
        <li>
          <Text color='#00a108'>General Town</Text>
        </li>
        <li>
          <Text color='#940000'>Mafia</Text>
        </li>
        <li>
          <Text color='#940000'>Godfather</Text>
        </li>
      </ul>
    </Container>
  );
}

type GameUIAlivePlayerListProps = {
    players: GamePlayer[];
    phase: string | undefined;
    playerRole: Role | undefined;
    playerTeam: Team | undefined;
};

type GameUIPlayerListProps = {
    players: GamePlayer[];
};

// needs an array map from players to strings
export function GameUIAlivePlayerList({ players, phase, playerRole, playerTeam }: GameUIAlivePlayerListProps): JSX.Element {
    // dummy values for buttons, replace with Chris' versions later

    if (phase === Phase[Phase.day_voting] 
        || (phase === Phase[Phase.night] && !playerRole && playerTeam === Team.Mafia)) {
        return (
            <Container width='200px' height='296px' className='ui-container'>
              <Heading fontSize='xl' as='h1'>
                Players
              </Heading>
              <ul>
                {players.map((gp: GamePlayer) => (
                    <li key={gp.id}>
                    <Button> Vote {gp.userName} </Button>
                    </li>) )} 
              </ul>
            </Container> 
        );
    }
    if (phase === Phase[Phase.night] 
        && (playerRole === Role.Godfather || playerRole === Role.Detective
            || playerRole === Role.Hypnotist || playerRole === Role.Doctor)) {
        if (!playerRole && playerTeam === Team.Mafia) {
            return (
                <Container width='200px' height='296px' className='ui-container'>
                  <Heading fontSize='xl' as='h1'>
                    Players
                  </Heading>
                  <ul>
                    {players.map((gp: GamePlayer) => (
                        <li key={gp.id}>
                        <Button> Target {gp.userName} </Button>
                        </li>) )} 
                  </ul>
                </Container> 
            );
        }    
    }
    
  return (
    <Container width='200px' height='296px' className='ui-container'>
      <Heading fontSize='xl' as='h1'>
        Players
      </Heading>
      <ul>
        {players.map(player => (player ? <li key={player.id}>{player.userName}</li> : <li />))}
      </ul>
    </Container>
  );
}

export function GameUIDeadPlayerList({ players }: GameUIPlayerListProps): JSX.Element {
  return (
    <Container width='200px' height='296px' className='ui-container'>
      <Heading fontSize='xl' as='h1'>
        Graveyard
      </Heading>
      <ul>
        {players.map(player => (player ? <li key={player.id}>{player.userName}</li> : <li />))}
      </ul>
    </Container>
  );
}

type GameVideoProps = {
  game: MafiaGame;
  gamePhase: string | undefined;
}

// needs integration with Twilio API
// does not need background color, since entire screen will be video
export function GameUIVideoOverlay( {game, gamePhase} : GameVideoProps): JSX.Element {
  return (
    <Container
      borderWidth='3px'
      maxW='full'
      height='600px'
      borderRadius='0px'
      borderColor='black'
      backgroundColor='#fafafa'>
      <Heading fontSize='xl' as='h1'>
        <GameUIVideo game={game} gamePhase={gamePhase} />
      </Heading>
    </Container>
  );
}

type GameUILobbyHeaderProps = {
  gameName: string;
};

export function GameUILobbyHeader({ gameName }: GameUILobbyHeaderProps): JSX.Element {
  return (
    <Heading fontSize='xl' as='h1'>
      Welcome to {gameName}
    </Heading>
  );
}

export function GameUILobbyRoles(): JSX.Element {
  return (
    <Container width='350px' height='550px'>
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
    <Container width='500px' height='550px'>
      <Heading>Rules</Heading>
      <Text>
        The town is split into town members (General Town, Doctor, Investigator) and mafia members
        (General Mafia, Godfather). <br />
        <br />
        Every night, the mafia can choose one town member to kill. Using the information from
        special roles and who was killed, everyone must discuss who, if anyone, to lynch during the
        day. <br />
        <br />
        The town wins if all mafia members are killed, and the mafia win if all the town are killed.
      </Text>
    </Container>
  );
}

type GameUILobbyPlayersListProps = {
  players: Player[];
};

export function GameUILobbyPlayersList({ players }: GameUILobbyPlayersListProps): JSX.Element {
    
  return (
    <Container width='350px' height='550px'>
      <Heading>Players</Heading>
      <ul>
        {players.map((p: Player) => (
          <li key={p.id}>{p.userName}</li>
        ))}
      </ul>
    </Container>
  );
}
