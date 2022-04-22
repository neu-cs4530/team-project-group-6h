import { Container, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { Role, Team } from '../../classes/GamePlayer';

type GameUIRoleDescriptionProps = {
  playerRole: Role | undefined;
  playerRoleInfo: string;
  playerTeam: Team | undefined;
};

function GameUIRoleDescription({
  playerRole,
  playerRoleInfo,
  playerTeam,
}: GameUIRoleDescriptionProps): JSX.Element {
  return (
    <Container width='200px' height='296px' className='ui-container'>
      <Heading fontSize='xl' as='h1'>
        My Role:
        <br />
        {playerRole ? Role[playerRole] : `General ${Team[playerTeam || Team.Unassigned]}`}
      </Heading>
      <Text fontSize='md'>
        <br />
        Abilities: <br /> {playerRoleInfo}
      </Text>
    </Container>
  );
}

export default GameUIRoleDescription;
