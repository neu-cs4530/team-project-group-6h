import { Box, Heading, ListItem, UnorderedList } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import MafiaGame from '../../classes/MafiaGame';
import Player from '../../classes/Player';
import RecreationArea, { RecreationAreaListener } from '../../classes/RecreationArea';
import CreateGameButton from './CreateGameButton';
import LobbyButton from './LobbyButton';
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
    const [gamePlayers, setGamePlayers] = useState<Player[]>(mafiaGame?._players || []);

    // checks if my player is in a game
    const isPlayerInGame = (): boolean => {
      const foundPlayer = gamePlayers.find(p => p.id === playerID);
      return foundPlayer !== undefined; 
    }

    // keeps track of my player's game state
    const [playerInGame, setPlayerInGame] = useState(isPlayerInGame());

    const isPlayerInArea = (_occupants: string[] | undefined): boolean => {
      if (_occupants === undefined) {
        return false;
      }
      const found = _occupants.includes(playerID);
      return found;
    };
    
    // const [playerInArea, setPlayerInArea] = useState((isPlayerInArea(area?.occupants)));

    useEffect(() => {
        const updateListener: RecreationAreaListener = {
            onMafiaGameUpdated: (game: MafiaGame) => {
                console.log('In onMafiaGameUpdated (GameLobby)');
                // console.log(`Occupants before: ${}`)
                setMafiaGame(game);
                setGamePlayers(game._players);
                setPlayerInGame(isPlayerInGame());
            },
            onMafiaGameCreated: (game: MafiaGame) => {
              setMafiaGame(game);
              setGamePlayers(game._players);
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
       {area && isPlayerInArea(occupants) && !playerInGame &&
       <LobbyButton 
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