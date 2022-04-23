import { Box, Heading, ListItem, UnorderedList } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import MafiaGame from '../../classes/MafiaGame';
import Player from '../../classes/Player';
import RecreationArea, { RecreationAreaListener } from '../../classes/RecreationArea';
import LobbyButtons from './LobbyButton';
import PlayerName from './PlayerName';

type GameLobbyProps = {
  area: RecreationArea;
  playerID: string;
};

function GameLobby({ area, playerID }: GameLobbyProps): JSX.Element {
  // tracks mafia game
  const [mafiaGame, setMafiaGame] = useState<MafiaGame | undefined>(() => area.mafiaGame);

  // tracks list of game players
  const [gamePlayers, setGamePlayers] = useState<Player[]>(() => area.mafiaGame?.players || []);

  useEffect(() => {
    const updateListener: RecreationAreaListener = {
      onMafiaGameUpdated: (game: MafiaGame) => {
        setMafiaGame(() => game);
        setGamePlayers([...game.players]);
      },
      onMafiaGameCreated: (game: MafiaGame) => {
        setMafiaGame(() => game);
        setGamePlayers([...game.players]);
      },
      onMafiaGameDestroyed: () => {
        setMafiaGame(undefined);
        setGamePlayers(() => []);
      },
    };
    area.addRecListener(updateListener);
    return () => {
      area.removeRecListener(updateListener);
    };
  }, [setMafiaGame, area, setGamePlayers]);

  return (
    <Box>
      {gamePlayers.map(p => p.id).includes(playerID) ? (
        <></>
      ) : (
        <LobbyButtons area={area} mafiaGame={mafiaGame} playerID={playerID} />
      )}

      {/* {occupants?.includes(playerID) && playerInGame ? <p>Waiting message/start button here</p>: <></>} */}

      <div>
        <Heading as='h2' fontSize='l'>
          Players in Game:
        </Heading>
        <UnorderedList>
          {gamePlayers.map((player: Player) => (
            <ListItem key={player.id}>
              <PlayerName player={player} />
            </ListItem>
          ))}
        </UnorderedList>
      </div>
    </Box>
  );
}

export default GameLobby;
