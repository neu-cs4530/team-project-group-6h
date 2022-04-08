import { Button, Heading, StackDivider, VStack } from '@chakra-ui/react';
import React from 'react';
import Player from '../../classes/Player';

import useConversationAreas from '../../hooks/useConversationAreas';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import ConversationAreasList from './ConversationAreasList';
import PlayersList from './PlayersList';


type PlayerProp = {
  myPlayer: Player;
};

export default function SocialSidebar({ myPlayer } : PlayerProp): JSX.Element {
  const convoAreas = useConversationAreas();
  const playerArea = convoAreas.filter((area) => area.occupants.includes(myPlayer.id))[0];

    return (
      <VStack align="left"
        spacing={2}
        border='2px'
        padding={2}
        marginLeft={2}
        borderColor='gray.500'
        height='100%'
        divider={<StackDivider borderColor='gray.200' />}
        borderRadius='4px'>
          <Heading fontSize='xl' as='h1'>Players In This Town</Heading>
        <PlayersList /> 
        <ConversationAreasList />
        {/* start button to show for player */}
        <StartGame area={playerArea}/>
      </VStack>
    );
  }
