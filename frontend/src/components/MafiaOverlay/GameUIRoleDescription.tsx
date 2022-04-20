import { Container, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { Role } from '../../classes/GamePlayer';

type GameUIRoleDescriptionProps = {
  playerRole: Role | undefined;
};

function GameUIRoleDescription({ playerRole }: GameUIRoleDescriptionProps): JSX.Element {
  return (
    <Container width='200px' height='296px' className='ui-container'>
      <Heading fontSize='xl' as='h1'>
        My Role:
        <br />
        {playerRole ? playerRole.toString() : 'undefined'}
      </Heading>
      <Text fontSize='md'>
        <br />
        Abilities: <br />- can do this
        <br />- can also do this
      </Text>
    </Container>
  );
}

export default GameUIRoleDescription;
