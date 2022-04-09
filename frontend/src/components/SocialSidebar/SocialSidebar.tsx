import { Button, Heading, StackDivider, VStack } from '@chakra-ui/react';
import React from 'react';
import useConversationAreas from '../../hooks/useConversationAreas';
import ConversationAreasList from './ConversationAreasList';
import PlayersList from './PlayersList';
import StartGame from './StartGame';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import RecreationArea from '../../classes/RecreationArea';

export default function SocialSidebar(): JSX.Element {
  // get all the conversation areas of this town
  const convoAreas = useConversationAreas();

  // get all the recreation areas of this town
  const recAreas = convoAreas.filter((area) => area.isRecreationArea);
  recAreas.map((area) => area as RecreationArea);
  
  const coveyApp = useCoveyAppState();
  // get my player's id
  const { myPlayerID }= coveyApp;
  // find the recreation area my player is located in
  const myPlayerRecArea = (recAreas.filter((area) => area.occupants.includes(myPlayerID))[0]);

    return (
      <VStack align="left"
        spacing={2}
        border='2px'
        padding={2}
        marginLeft={2}
        borderColor='gray.500'
        height='100%'
        divider={<StackDivider borderColor='gray.200' />}
        borderRadius='4px'
        >
        <Heading fontSize='xl' as='h1'>Players In This Town</Heading>
        <PlayersList /> 
        <ConversationAreasList />

        {/* start button to show for player */}
        {myPlayerRecArea !== undefined ? <StartGame area={myPlayerRecArea} /> : <p>Player is not in a recreation area!</p>}
      </VStack>
    );
  }
