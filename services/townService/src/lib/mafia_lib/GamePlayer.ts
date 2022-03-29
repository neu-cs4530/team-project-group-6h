import { RecreationArea } from "./RecreationArea";
import { MafiaGame } from "./MafiaGame";
import { RecreationPlayer } from "./RecreationPlayer";

/**
  * Represents two possible teams that a GamePlayer can be a part of within the Mafia Game. 
  */
 export enum team {
  'Mafia',
  'Town',
};

/**
 * Extends the RecreationPlayer type, adding general functionality that a player within the Mafia Game will need. 
 */
export type GamePlayer = { 
  _isAlive: boolean // Is the player currently alive within the game?
  _hasVoted: boolean // Has the player voted yet during the voting cycle?
  _team: team // The team that the GamePlayer is on
  _roleInfo: string // Information about the player's given role

} & RecreationPlayer