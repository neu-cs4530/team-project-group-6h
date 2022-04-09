import React from 'react';
import { Button, position, Tooltip } from '@chakra-ui/react';
import Player from '../../classes/Player';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import PlayerName from './PlayerName';


/**
 * Lists the current players in the town, along with the current town's name and ID
 * 
 * Town name is shown in an H2 heading with a ToolTip that shows the label `Town ID: ${theCurrentTownID}`
 * 
 * Players are listed in an OrderedList below that heading, sorted alphabetically by userName (using a numeric sort with base precision)
 * 
 * Each player is rendered in a list item, rendered as a <PlayerName> component
 * 
 * See `usePlayersInTown` and `useCoveyAppState` hooks to find the relevant state.
 * 
 */
export default function PlayersInTownList(): JSX.Element {

  const comparator = (a: Player, b: Player) => a.userName.localeCompare(b.userName, 'en', { numeric: true })
  const coveyAppState = useCoveyAppState();
  const players = Array.from(usePlayersInTown());
  players.sort(comparator);

  return (
    <div>
      <Tooltip label={`Town ID: ${coveyAppState.currentTownID}`}>
        <h2>
          Current town: {coveyAppState.currentTownFriendlyName}
        </h2>
      </Tooltip>
      <ol>
        {players.map((p: Player) => (
          <li key={p.id}>
            <PlayerName player={p}/>
          </li>))}
        </ol>
      </div>
    );
}