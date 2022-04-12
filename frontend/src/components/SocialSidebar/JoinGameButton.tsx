import { Button, useToast } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import RecreationArea from '../../classes/RecreationArea'
import useCoveyAppState from '../../hooks/useCoveyAppState'


type JoinGameProps = {
  hostID: string,  
  myPlayerID: string,
  area: RecreationArea,
}


export default function JoinGameButton({ hostID, myPlayerID, area }: JoinGameProps): JSX.Element {
  const { apiClient, sessionToken, currentTownID } = useCoveyAppState();

  const toast = useToast();

  const joinGameLobby = useCallback(async () => {
    try {
      await apiClient.joinGameLobby({
        coveyTownID: currentTownID,
        sessionToken,
        recreationAreaLabel: area.label,
        playerID: myPlayerID,
      });
      toast({
        title: 'Mafia Game Lobby Joined!',
        status: 'success',
      });
    } catch (err) {
      toast({
        title: 'Unable to join Mafia Game Lobby',
        description: err.toString(),
        status: 'error',
      })
    }
  }, [apiClient, currentTownID, sessionToken, area.label, myPlayerID, toast]); 

  return (
    <div>{hostID === myPlayerID ? 'Start game button should go here' : <Button onClick={joinGameLobby}>Join Game</Button>} </div>
  )
}