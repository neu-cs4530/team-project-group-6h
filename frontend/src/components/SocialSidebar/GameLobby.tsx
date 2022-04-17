import { Box, Heading, ListItem, UnorderedList } from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react'
import MafiaGame from '../../classes/MafiaGame';
import Player from '../../classes/Player';
import RecreationArea, { RecreationAreaListener } from '../../classes/RecreationArea';
import LobbyButtons from './LobbyButton';
import PlayerName from './PlayerName';


type GameLobbyProps = {
    area: RecreationArea | undefined,
    playerID: string,
};

function GameLobby( { area, playerID }: GameLobbyProps): JSX.Element {

    // for those with an undefined area state, this will be undefined
    const [occupants, setOccupants] = useState(area?.occupants);

    // tracks mafia game
    const [mafiaGame, setMafiaGame] = useState<MafiaGame | undefined>(area?.mafiaGame);

    // tracks list of game players
    const [gamePlayers, setGamePlayers] = useState<Player[]>(mafiaGame?.players || []);

    // checks if my player is in a game
    const isPlayerInGame = useCallback((): boolean => {
      const foundPlayer = gamePlayers.find(p => p.id === playerID);
      return foundPlayer !== undefined; 
    }, [gamePlayers, playerID]);

    // keeps track of my player's game state
    const [playerInGame, setPlayerInGame] = useState(isPlayerInGame());

    const isPlayerInArea = (_occupants: string[] | undefined): boolean => {
      if (_occupants === undefined) {
        return false;
      }
      const found = _occupants.includes(playerID);
      return found;
    };
    

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
            setOccupants(newOccupants);
          }
          
        };
        area?.addRecListener(updateListener);
        return () => {
            area?.removeRecListener(updateListener);
        }; 
    }, [mafiaGame, setMafiaGame, area, gamePlayers, setGamePlayers, isPlayerInGame]); 

   return (
     <Box>
       {area && isPlayerInArea(occupants) && !playerInGame &&
       <LobbyButtons
       area={area} 
       mafiaGame={mafiaGame} 
       playerID={playerID}/>}

       {/* {occupants?.includes(playerID) && playerInGame ? <p>Waiting message/start button here</p>: <></>} */}
       
       {isPlayerInArea(occupants) && 
        <div>
            <Heading as='h2' fontSize='l'>Players in Game:</Heading>
            <UnorderedList>
              {gamePlayers.map(player => 
              <ListItem key={player.id}><PlayerName player={player} /></ListItem>)}
            </UnorderedList>
        </div>}

        
     </Box>
   )
}

export default GameLobby