import { Heading, StackDivider, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useConversationAreas from '../../hooks/useConversationAreas';
import ConversationAreasList from './ConversationAreasList';
import PlayersList from './PlayersList';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import RecreationArea, { RecreationAreaListener } from '../../classes/RecreationArea';
import ConversationArea from '../../classes/ConversationArea';
import useRecreationAreas from '../../hooks/useRecreationAreas';
import GameLobby from './GameLobby';
import usePlayersInTown from '../../hooks/usePlayersInTown';

export default function SocialSidebar(): JSX.Element {
  // get all the conversation areas of this town
  const convoAreas = useConversationAreas();
  // get all the recreation areas of this town
  const recAreas = useRecreationAreas();
  const coveyApp = useCoveyAppState();
  // get my player's id
  const { myPlayerID } = coveyApp;
   
  // const [myPlayerRecArea, setMyPlayerRecArea] = useState(recAreas.find(rec => 
  //   rec.containsPlayerID(myPlayerID)));
  
  // useEffect(() => {
  //   setMyPlayerRecArea(recAreas.find(rec => rec.label === myPlayer?.location?.conversationLabel));
  // })
  // }, [recAreas])

  // find the recreation area my player is located in
 
  /*
  const getMyPlayerRecArea = function(): RecreationArea | undefined {
    return recAreas.find((area => area.occupants.includes(myPlayerID))); 
  }
  const [myPlayerRecArea, setMyPlayerRecArea] = useState(getMyPlayerRecArea()); 

  useEffect(() => {
    console.log('SOCIAL SIDEBAR USE EFFECT');
    setMyPlayerRecArea(getMyPlayerRecArea());
  }, [recAreas, myPlayer?.location]); 
  */

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
      
        {recAreas.map((area) => 
          <GameLobby
            key={area.label}
            area={area}
            playerID={myPlayerID} /> 
        )}
        
      </VStack>
    );
  }