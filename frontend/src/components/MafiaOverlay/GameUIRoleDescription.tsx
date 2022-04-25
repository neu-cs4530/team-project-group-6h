import { Container, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import GamePlayer, { Role, Team } from '../../classes/GamePlayer';

type GameUIRoleDescriptionProps = {
  playerRole: Role | undefined;
  playerRoleInfo: string;
  playerTeam: Team | undefined;
  gamePlayers: GamePlayer[];
};

function GameUIRoleDescription({
  playerRole,
  playerRoleInfo,
  playerTeam,
  gamePlayers,
}: GameUIRoleDescriptionProps): JSX.Element {
  return (
    <Container width='200px' height='296px' className='ui-container'>
      <Heading fontSize='xl' as='h1'>
        My Role:
        <br />
        {playerRole ? Role[playerRole] : `General ${Team[playerTeam || Team.Mafia]}`}
      </Heading>
      <Text fontSize='md'>
        Abilities: <br /> <Text fontSize='sm'>{playerRoleInfo}</Text>
      </Text>
      {playerTeam === Team.Mafia ? (
        <div>
          <Heading fontSize='sm' as='h1'>
            Mafia Members:
          </Heading>
          <ul>
            {gamePlayers.map(p =>
              p.team === Team.Mafia ? (
                <li key={p.id}>
                  <Text fontSize='sm'>
                    {p.userName}: {Role[p.role]}
                  </Text>
                </li>
              ) : (
                <></>
              ),
            )}
          </ul>
        </div>
      ) : (
        <></>
      )}
    </Container>
  );
}

export default GameUIRoleDescription;
