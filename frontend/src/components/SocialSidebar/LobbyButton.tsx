import { Heading } from '@chakra-ui/react'
import React from 'react'
import MafiaGame from '../../classes/MafiaGame'
import RecreationArea from '../../classes/RecreationArea'
import CreateGameButton from './CreateGameButton'
import JoinGameButton from './JoinGameButton'

type LobbyButtonProps = {
    area: RecreationArea, 
    mafiaGame: MafiaGame | undefined,
    playerID: string,
}

const LobbyButtons = ({ area, mafiaGame, playerID }: LobbyButtonProps): JSX.Element => (
    <>
        <Heading as='h2' fontSize='l'>Mafia Game Menu</Heading>
        {mafiaGame ? 
          <JoinGameButton
            hostID={mafiaGame._host.id}
            myPlayerID={playerID}
            area={area} />
            
        :
          <CreateGameButton
            area={area}
            myPlayerID={playerID} />
        
        }
            
        
    </>
  )

export default LobbyButtons