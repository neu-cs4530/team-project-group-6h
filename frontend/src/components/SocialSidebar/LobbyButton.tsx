import { Heading } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import MafiaGame from '../../classes/MafiaGame'
import RecreationArea from '../../classes/RecreationArea'
import CreateGameButton from './CreateGameButton'
import JoinGameButton from './JoinGameButton'
import StartGameButton from './StartGameButton'

type LobbyButtonProps = {
    area: RecreationArea, 
    mafiaGame: MafiaGame | undefined,
    playerID: string,
}

const LobbyButton = ({ area, mafiaGame, playerID }: LobbyButtonProps): JSX.Element => { 
   
    
    

    useEffect(() => {
        console.log(`Mafia game updated in LobbyButton, num occupants = ${mafiaGame?.players.length}`)
    }, [mafiaGame]); 

  return (
    <>
        <Heading as='h2' fontSize='l'>Mafia Game Lobby</Heading>
        {mafiaGame && !mafiaGame.canStart() ? 
            <JoinGameButton 
            hostID={mafiaGame._host.id} 
            myPlayerID={playerID} 
            area={area}/>
        :
            <CreateGameButton 
            area={area} 
            myPlayerID={playerID}/>}

        {mafiaGame && mafiaGame.canStart() ?
            // TODO: Update startGame parameter once I figure out how backend is sending playerRoles
            <StartGameButton 
            area={area}
            myPlayerID={playerID}/>
            : <> </>}
    </>
  )
}

export default LobbyButton