import RecreationArea from "./RecreationArea";
import MafiaGame from "./MafiaGame";
import RecreationPlayer from "./RecreationPlayer";

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
export default class GamePlayer extends RecreationPlayer { 
  _isAlive: boolean = true; // Is the player currently alive within the game?
 // Is the player currently alive within the game?
  _hasVoted: boolean = false; // Has the player voted yet during the voting cycle?
 // Has the player voted yet during the voting cycle?
  _team: team = team.Mafia; // The team that the GamePlayer is on
 // The team that the GamePlayer is on
  _roleInfo: string = ''; // Information about the player's given role

  constructor(recPlayer: RecreationPlayer) {
    super(recPlayer);
  }

}