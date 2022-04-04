import { Container, Heading, StackDivider, VStack, HStack } from '@chakra-ui/react';
import React from 'react';
// import ConversationAreasList from './ConversationAreasList';
// import PlayersList from './PlayersList';

export default function TestOverlay(): JSX.Element {
    return (
<Container
    align="left"
    spacing={2}
    border='2px'
    padding={2}
    marginLeft={2}
    borderColor='gray.500'
    width="1000px"
    height='100%'
    borderRadius='4px'
    backgroundColor='#ededed'>
    <VStack>
        <HStack>
            <div>Game Name: Day N Discussion</div>
            <div>Time left: 1:30</div>
        </HStack>
        <HStack>
            <VStack align='left'>
            <Container className="Info-day"
                width="100px"
                height="200px"
            >
                My Role
            </Container>
            <Container className="Info-day"
                width="100px"
                height="200px"
            >
                Remaining Roles
            </Container>
            </VStack>
            <Container className="Info-day"
                width="400px"
                height="408px"
            >
                VIDEO CALL
            </Container>
            <VStack align='left'>
                <Container className="Info-day"
                    width="200px"
                    height="200px"
                >
                    Players
                </Container>
                <Container className="Info-day"
                    width="200px"
                    height="200px"
                >
                    Graveyard
                </Container>
            </VStack>
        </HStack>
    </VStack>
</Container>
    );
  }