import {
  Button,
  Container,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useToast,
} from '@chakra-ui/react';
import assert from 'assert';
import React, { useCallback, useEffect } from 'react';
import GamePlayer, { Role, Team } from '../../classes/GamePlayer';
import MafiaGame from '../../classes/MafiaGame';
import Player from '../../classes/Player';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import useCurrentRecreationArea from '../../hooks/useCurrentRecreationArea';
import useIsDead from '../../hooks/useIsDead';
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

type GameUITimerProps = {
  gameInstanceID: string;
  isPlayerHost: boolean;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
};

export function GameUITimer({
  gameInstanceID,
  isPlayerHost,
  timeLeft,
  setTimeLeft,
}: GameUITimerProps): JSX.Element {
  const { apiClient, sessionToken, currentTownID } = useCoveyAppState();
  const toast = useToast();

  const updatePhase = async () => {
    try {
      await apiClient.nextPhase({
        coveyTownID: currentTownID,
        sessionToken,
        mafiaGameID: gameInstanceID,
      });
      toast({
        title: 'Mafia Game Phase Updated!',
        status: 'success',
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          title: 'Unable to advance Mafia Game to next phase',
          description: err.toString(),
          status: 'error',
        });
      }
    }
  };

  const phaseDuration = 90;

  useEffect(() => {
    // subtracts one from timer every time a second passes during this phase
    const timer = setTimeout(async () => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else if (isPlayerHost && timeLeft === 0) {
        await updatePhase();
        setTimeLeft(phaseDuration);
      }
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <Container width='100px' height='62px' className='ui-container'>
      <Heading fontSize='xl' as='h1'>
        {`${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}`}
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

type GameUIRoleListProps = {
  gamePlayers: GamePlayer[];
};

export function GameUIRoleList({ gamePlayers }: GameUIRoleListProps): JSX.Element {
  return (
    <Container width='200px' height='296px' className='ui-container'>
      <Heading fontSize='xl' as='h4'>
        All Roles
      </Heading>
      <ul style={{ listStyleType: 'none' }}>
        {gamePlayers.map(p => (
          <li key={p.id}>
            {' '}
            <Popover trigger='hover'>
              <PopoverTrigger>
                <Text color={p.team === 0 ? '#940000' : '#00a108'}>
                  {Role[p.role]}: ({Team[p.team]})
                </Text>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>
                  {Role[p.role]}: ({Team[p.team]})
                </PopoverHeader>
                <PopoverBody>{p.roleInfo}</PopoverBody>
              </PopoverContent>
            </Popover>
          </li>
        ))}
      </ul>
    </Container>
  );
}

type GameUIPlayerListElementProps = {
  voteFunc: () => void;
  player: GamePlayer;
};

function GameUIVotePlayerListElement({
  player,
  voteFunc,
}: GameUIPlayerListElementProps): JSX.Element {
  const { apiClient, sessionToken, currentTownID, myPlayerID } = useCoveyAppState();
  const currentRecArea = useCurrentRecreationArea();
  const toast = useToast();

  const sendVote = useCallback(async () => {
    try {
      assert(currentRecArea?.mafiaGame, 'Recreation area and mafia game must be defined.');
      await apiClient.sendVote({
        coveyTownID: currentTownID,
        sessionToken,
        mafiaGameID: currentRecArea.mafiaGame.id,
        voterID: myPlayerID,
        votedID: player.id,
      });
      voteFunc();
      toast({
        title: `Vote against ${player.userName} submitted`,
        status: 'success',
      });
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: `Unable to vote for ${player.userName}`,
          description: err.toString(),
          status: 'error',
        });
      }
    }
  }, [
    currentRecArea?.mafiaGame,
    apiClient,
    currentTownID,
    sessionToken,
    myPlayerID,
    player.id,
    player.userName,
    voteFunc,
    toast,
  ]);
  return (
    <li key={player.id}>
      <Button colorScheme='red' padding='2px' height='20px' onClick={sendVote}>
        Vote {player.userName}
      </Button>
    </li>
  );
}

function GameUITargetPlayerListElement({
  player,
  voteFunc,
}: GameUIPlayerListElementProps): JSX.Element {
  const { apiClient, sessionToken, currentTownID, myPlayerID } = useCoveyAppState();
  const currentRecArea = useCurrentRecreationArea();
  const toast = useToast();

  const target = useCallback(async () => {
    try {
      assert(currentRecArea?.mafiaGame, 'Recreation area and mafia game must be defined.');
      await apiClient.setNightTarget({
        coveyTownID: currentTownID,
        sessionToken,
        mafiaGameID: currentRecArea.mafiaGame.id,
        playerID: myPlayerID,
        targetID: player.id,
      });
      voteFunc();
      toast({
        title: `Targeted ${player.userName}`,
        status: 'success',
      });
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: `Unable to target ${player.userName}`,
          description: err.toString(),
          status: 'error',
        });
      }
    }
  }, [
    currentRecArea?.mafiaGame,
    apiClient,
    currentTownID,
    sessionToken,
    myPlayerID,
    player.id,
    player.userName,
    voteFunc,
    toast,
  ]);
  return (
    <li key={player.id}>
      <Button colorScheme='blue' padding='2px' height='20px' onClick={target}>
        Target {player.userName}
      </Button>
    </li>
  );
}


type GameUIAlivePlayerListProps = {
  myPlayerID: string;
  players: GamePlayer[];
  hasVoted: boolean;
  voteFunc: () => void;
  gamePhase: string | undefined;
  playerRole: Role | undefined;
  playerTeam: Team | undefined;
};

export function GameUIAlivePlayerList({
  myPlayerID,
  players,
  hasVoted,
  voteFunc,
  gamePhase,
  playerRole,
  playerTeam,
}: GameUIAlivePlayerListProps): JSX.Element {
  const isDead = useIsDead();

  /**
   * If (town || mafia) && day - playerList - voting buttons
   * If mafia (unassigned) && night - playerList - voting buttons
   * If mafia (Godfather) && night - playerList - target buttons
   * If town (Unassigned) && night - playerList - no buttons
   * If town (hypnotist | Detective | Doctor) && night - playerList - Target Buttons
   */
  return (
    <Container width='200px' height='296px' className='ui-container'>
      <Heading fontSize='xl' as='h1'>
        Players
      </Heading>
      <ul>
        {(gamePhase === 'day_voting' || gamePhase === 'night') && !hasVoted && !isDead
          ? players.map(p => {
              if (gamePhase === 'night') {
                // Render Mafia vote buttons for general mafia
                if (playerRole === Role.Unassigned && playerTeam === Team.Mafia) {
                  if (p.team !== Team.Mafia) {
                    return (
                      <div key={p.id} className='vote-player'>
                        <GameUIVotePlayerListElement player={p} voteFunc={voteFunc} />
                        {
                          // `: ${voteTallies?.find(t => t.playerID === p.id)?.voteTally}`}
                        }
                      </div>
                    );
                  }
                  return <li key={p.id}>{p.userName}</li>;
                }
                // For players in town with special role, render target buttons
                if (playerRole !== Role.Unassigned) {
                  if (
                    (p.id === myPlayerID &&
                      (playerRole === Role.Detective || playerRole === Role.Hypnotist)) ||
                    (playerRole === Role.Godfather && p.team === Team.Mafia)
                  ) {
                    return <li key={p.id}>{p.userName}</li>;
                  }
                  return (
                    <GameUITargetPlayerListElement key={p.id} player={p} voteFunc={voteFunc} />
                  );
                }
                // For general town, render player user name
                return <li key={p.id}>{p.userName}</li>;
              }
              // Render votes against the player during day voting cycle, no button to vote
              // against self
              if (p.id === myPlayerID) {
                return <li key={p.id}>{`${p.userName} ${hasVoted ? p.voteTally : ''}`} </li>;
              }
              // Render vote buttons during day voting cycle
              return (
                <div key={p.id} className='vote-player'>
                  <GameUIVotePlayerListElement player={p} voteFunc={voteFunc} />
                  {
                    // `: ${voteTallies?.find(t => t.playerID === p.id)?.voteTally}`
                  }
                </div>
              );
            })
          : players.map(p => {
              // Need cases for when player is dead, has already voted, or when phase is day_discussion
              if (
                gamePhase === 'day_discussion' ||
                (playerTeam === Team.Town && gamePhase === 'night')
              ) {
                return <li key={p.id}>{p.userName}</li>;
              }
              if (hasVoted || (isDead && gamePhase === 'day_voting')) {
                return <li key={p.id}>{`${p.userName}: ${p.voteTally}`} </li>;
              }
              return <></>;
            })}
      </ul>
    </Container>
  );
}

type GameUIDeadPlayerListProps = {
  players: GamePlayer[];
};
export function GameUIDeadPlayerList({ players }: GameUIDeadPlayerListProps): JSX.Element {
  return (
    <Container width='200px' height='296px' className='ui-container'>
      <Heading fontSize='xl' as='h1'>
        Graveyard
      </Heading>
      <ul>
        {players.map(player =>
          player ? (
            <li key={player.id}>
              {player.userName}: {Role[player.role]}
            </li>
          ) : (
            <li />
          ),
        )}
      </ul>
    </Container>
  );
}

type GameVideoProps = {
  game: MafiaGame;
  gamePhase: string | undefined;
};

// needs integration with Twilio API
// does not need background color, since entire screen will be video
export function GameUIVideoOverlay({ game, gamePhase }: GameVideoProps): JSX.Element {
  return (
    <Container
      borderWidth='3px'
      maxW='full'
      height='600px'
      borderRadius='0px'
      borderColor='black'
      backgroundColor='#ababab'>
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
      <ul style={{ listStyleType: 'none' }}>
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
      <ul style={{ listStyleType: 'none' }}>
        {players.map((p: Player) => (
          <li key={p.id}>{p.userName}</li>
        ))}
      </ul>
    </Container>
  );
}
