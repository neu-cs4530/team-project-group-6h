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

    // const [gamePlayers, setGamePlayers] = useState<Player[]>(mafiaGame?._players || []);

    useEffect(() => {
        const updateListener: RecreationAreaListener = {
            onMafiaGameUpdated: (game: MafiaGame) => {
                setMafiaGame(game);
            }
        };
        area.addRecListener(updateListener);
        return () => {
            area.removeListener(updateListener);
        }; 
    }, [mafiaGame, setMafiaGame, area]); 


  return (
      <>
      <LobbyButton area={area} mafiaGame={mafiaGame} playerID={playerID}/>
      {mafiaGame && mafiaGame._players ? 
      <UnorderedList>
        {mafiaGame._players.map(player => <ListItem key={player.id}><PlayerName player={player}/></ListItem>)}
      </UnorderedList> : <></>
      }
    </>
  )
}

export default GameLobby