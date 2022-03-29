import RecreationPlayer from "./RecreationPlayer";

/**
  * Represents two possible teams that a GamePlayer can be a part of within the Mafia Game. 
  */
 export enum Team {
  'Mafia',
  'Town',
  'Unassigned'
};

/**
 * Extends the RecreationPlayer type, adding general functionality that a player within the Mafia Game will need. 
 */
export default class GamePlayer extends RecreationPlayer { 
  _isAlive: boolean; // Is the player currently alive within the game?
 
  _hasVoted: boolean; // Has the player voted yet during the voting cycle?
  
  _team = Team.Unassigned; // The team that the GamePlayer is on
  
 _roleInfo: string; // Information about the player's given role

 _target: string;

  constructor(recPlayer: RecreationPlayer) {
    super(recPlayer);
    this._isAlive = true;
    this._hasVoted = false;
    this._roleInfo = '';
    this._target = '';
  }

  set team(team: Team) {
    this._team = team;
  }

  set target(target: string) {
    this._target = target;
  }

}