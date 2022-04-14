import { Box, ListItem, UnorderedList } from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react'
import MafiaGame from '../../classes/MafiaGame';
import Player from '../../classes/Player';
import RecreationArea, { RecreationAreaListener } from '../../classes/RecreationArea';
import LobbyButton from './LobbyButton';
import PlayerName from './PlayerName';


type GameLobbyProps = {
    area: RecreationArea,
    playerID: string,
};

function GameLobby({area, playerID}: GameLobbyProps): JSX.Element {

    // Should update when:
    // 1. Players enter the recreationArea
    // 2. Players leave the recreationArea
    const [occupants, setOccupants] = useState(area.occupants);
    // check if the current player is in the Recreation Area.
    // False if the current player is not in the recreation area

    const isPlayerInArea = useCallback((): boolean => {
      const found = occupants.includes(playerID);
      return found;
    }, [occupants, playerID]);

    // Should update when the current player:
    // 1. Enters the recreation area: true
    // 2. Leaves the recreation area: false
    const [playerInArea, setPlayerInArea] = useState((isPlayerInArea()));

    // the mafia game in the recreation area
    // Undefined if it hasn't been created yet
    // Should update when:
    // 1. Mafia Game has been created
    // 2. Host leaves mafia game (by exiting the recreation area)
    const [mafiaGame, setMafiaGame] = useState<MafiaGame | undefined>(area.mafiaGame);
    
    // The players that have JOINED a mafia Game that has been created in a recreation area. 
    // Empty if the game has not yet been created.
    // Should update when:
    // 1. A new player has joined the mafiaGame
    // 2. The host leaves the MafiaGame (should be set back to empty)
    const [gamePlayers, setGamePlayers] = useState<Player[]>(mafiaGame?.players || []);
    
    // Checking if the current player is in the mafiaGame. 
    // False if current player is not in the MafiaGame. 
    // List of players in the game should not render on the current player's screen if they are not in the game. 
    const isPlayerInGame = useCallback((): boolean => {
      const foundPlayer = gamePlayers.find(p => p.id === playerID);
      return foundPlayer !== undefined; 
    }, [gamePlayers, playerID]);

    // Should update when the current player:
    // 1. Joins a Mafia Game in the recreation area: true
    // 2. Leaves the recreation area: false
    const [playerInGame, setPlayerInGame] = useState(isPlayerInGame());
    

    useEffect(() => {
        const updateListener: RecreationAreaListener = {
            onMafiaGameUpdated: (game: MafiaGame) => {
                console.log('In onMafiaGameUpdated (GameLobby)');
                setMafiaGame(game);
                setPlayerInGame(isPlayerInGame());
                setGamePlayers(game.players);
            },
            onMafiaGameCreated: (game: MafiaGame) => {
              setMafiaGame(game);
              setGamePlayers(game.players);
              setPlayerInGame(isPlayerInGame());
            },
            onOccupantsChange(newOccupants: string[]) {
              setPlayerInArea(isPlayerInArea());

              if (isPlayerInArea()) {
                setOccupants(newOccupants);
              }
            }
        };
        area.addRecListener(updateListener);
        return () => {
            area.removeRecListener(updateListener);
        }; 
    }, [mafiaGame, area, gamePlayers, isPlayerInArea, isPlayerInGame]); 

    /*
    return (
        <>
        {playerInGame ? <></> : <LobbyButton area={area} mafiaGame={mafiaGame} playerID={playerID}/>}
        {mafiaGame && mafiaGame._players ? 
        <>
        {playerID === mafiaGame?._host.id ? <p>Host Start Button Goes Here</p>:<p>Waiting for game to start...</p>}
        <h2>Players in Game:</h2>
        <UnorderedList>
          {gamePlayers.map(player => <ListItem key={player.id}><PlayerName player={player}/></ListItem>)}
        </UnorderedList> 
        </>
        : <></>
        }
      </>
    )
    */
   return (
     <Box>
       {playerInArea && !playerInGame ? <LobbyButton area={area} mafiaGame={mafiaGame} playerID={playerID}/>: <></>}
       {playerInArea && playerInGame ? <p>Waiting message/start button here</p>: <></>}
       {playerInArea ? 
        <>
          <h2>Players in Game:</h2>
          <UnorderedList>
            {gamePlayers.map(player => <ListItem key={player.id}><PlayerName player={player}/></ListItem>)}
          </UnorderedList>
        </>: <></>}
     </Box>
   )
}

export default GameLobby