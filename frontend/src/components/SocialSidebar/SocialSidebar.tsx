import { Heading, StackDivider, VStack } from '@chakra-ui/react';
import React from 'react';
import useConversationAreas from '../../hooks/useConversationAreas';
import ConversationAreasList from './ConversationAreasList';
import PlayersList from './PlayersList';
import StartGameButton from './StartGame';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import RecreationArea from '../../classes/RecreationArea';
import ConversationArea from '../../classes/ConversationArea';
import useRecreationAreas from '../../hooks/useRecreationAreas';

export default function SocialSidebar(): JSX.Element {
  // get all the conversation areas of this town
  const convoAreas = useConversationAreas();
  // get all the recreation areas of this town
  const recAreas = useRecreationAreas() as RecreationArea[];
  const coveyApp = useCoveyAppState();
  // get my player's id
  const { myPlayerID }= coveyApp;
  // find the recreation area my player is located in
  const myPlayerRecArea = (recAreas.find((area) => area.occupants.includes(myPlayerID)));

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

        {/* start button to show for player if they are in a recreation area */}
        {myPlayerRecArea !== undefined ? 
        <StartGameButton area={myPlayerRecArea} hostID={myPlayerID}/> 
        : <p>Your player is not in a recreation area!</p>}
        
      </VStack>
    );
  }
