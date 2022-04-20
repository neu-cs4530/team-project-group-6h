import { Container, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { Role } from '../../classes/GamePlayer';

type GameUIRoleDescriptionProps = {
  playerRole: Role | undefined;
  playerRoleInfo: string;
};

function GameUIRoleDescription({
  playerRole,
  playerRoleInfo,
}: GameUIRoleDescriptionProps): JSX.Element {
  return (
    <Container width='200px' height='296px' className='ui-container'>
      <Heading fontSize='xl' as='h1'>
        My Role:
        <br />
        {playerRole ? Role[playerRole] : 'undefined'}
      </Heading>
      <Text fontSize='md'>
        <br />
        Abilities: <br /> {playerRoleInfo}
      </Text>
    </Container>
  );
}

export default GameUIRoleDescription;
