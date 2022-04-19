import { Heading } from '@chakra-ui/react'
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
    /*
    useEffect(() => {
        // console.log(`Mafia game updated in LobbyButton, num occupants = ${mafiaGame?.players.length}`)
    }, [mafiaGame]);
    */

  return (
    <>
        <Heading as='h2' fontSize='l'>Mafia Game Lobby</Heading>
        {mafiaGame ? 
            <JoinGameButton 
            hostID={mafiaGame._host.id} 
            myPlayerID={playerID} 
            area={area}/>
        :
            <CreateGameButton 
            area={area} 
            myPlayerID={playerID}/>}
        
    </>
  );
}

export default LobbyButtons