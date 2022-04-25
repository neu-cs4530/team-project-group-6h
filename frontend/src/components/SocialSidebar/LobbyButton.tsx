import { Heading, Tooltip } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import MafiaGame from '../../classes/MafiaGame'
import RecreationArea from '../../classes/RecreationArea'
import CreateGameButton from './CreateGameButton'
import JoinGameButton from './JoinGameButton'

type LobbyButtonProps = {
    area: RecreationArea, 
    mafiaGame: MafiaGame | undefined,
    playerID: string,
}

const LobbyButtons = ({ area, mafiaGame, playerID }: LobbyButtonProps): JSX.Element => { 

    const a = 1;

  return (
    <>
        <Heading as='h2' fontSize='l'>Mafia Game Menu</Heading>
        {mafiaGame ? 
        <Tooltip label="Click this button to join a game of Mafia!">
          <JoinGameButton
            hostID={mafiaGame._host.id}
            myPlayerID={playerID}
            area={area} />
        </Tooltip>
            
        :
        <Tooltip label="Click this button to start a game of Mafia!">
          <CreateGameButton
            area={area}
            myPlayerID={playerID} />
        </Tooltip>
        }
            
        
    </>
  );
}

export default LobbyButtons