import { ListItem, UnorderedList } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import MafiaGame from '../../classes/MafiaGame';
import Player from '../../classes/Player';
import RecreationArea, { RecreationAreaListener } from '../../classes/RecreationArea';
import LobbyButton from './LobbyButton';
import PlayerName from './PlayerName';


type GameLobbyProps = {
    area: RecreationArea,
    playerID: string,
};

const GameLobby = ({area, playerID}: GameLobbyProps): JSX.Element => {
    


    const [mafiaGame, setMafiaGame] = useState<MafiaGame | undefined>(area.mafiaGame);
    const [gamePlayers, setGamePlayers] = useState<Player[]>(mafiaGame?._players || []);

    const isPlayerInGame = (): boolean => {
      const foundPlayer = gamePlayers.find(p => p.id === playerID);
      return foundPlayer !== undefined; 
    }
    const [playerInGame, setPlayerInGame] = useState(isPlayerInGame());

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
            }
        };
        area.addRecListener(updateListener);
        return () => {
            area.removeRecListener(updateListener);
        }; 
    }, [mafiaGame, setMafiaGame, area, gamePlayers, setGamePlayers, playerInGame, setPlayerInGame]); 


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
}

export default GameLobby