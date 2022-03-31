import RecreationPlayer from "./RecreationPlayer";

/**
  * Represents two possible teams that a GamePlayer can be a part of within the Mafia Game. 
  */
 export enum Team {
  'Mafia',
  'Town',
  'Unassigned'
};

export enum Role {
  'Unassigned',
  'Detective',
  'Doctor',
  'Hypnotist',
  'Godfather'
};

/**
 * Extends the RecreationPlayer type, adding general functionality that a player within the Mafia Game will need. 
 */
export default class GamePlayer extends RecreationPlayer { 
  _isAlive: boolean; // Is the player currently alive within the game?
 
  _hasVoted: boolean; // Has the player voted yet during the voting cycle?
  
  _team = Team.Unassigned; // The team that the GamePlayer is on

  _role = Role.Unassigned; // The currently assigned role that the player has
  
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

  /**
   * Sets both the role of a GamePlayer and the role information of the GamePlayer. 
   */
  set role(role: Role) {
    this._role = role;

    switch (role) {
      case Role.Detective:
        this._roleInfo = 'Detective: Able to investigate the role of one (1) player during the night.';
        break;
      case Role.Doctor:
        this._roleInfo = 'Doctor: Can resurrect one (1) player during the night.';
        break;
      case Role.Hypnotist:
        this._roleInfo = 'Hypnotist: Able to prevent one (1) player from using their ability during the night.';
        break;
      case Role.Godfather:
        this._roleInfo = 'Godfather: Can override the a mafia decision to eliminate a town mber in favor of their own.';
        break;
      default:
        if (this._team === Team.Mafia) {
          this._roleInfo = 'Able to vote to eliminate (1) player during the night.';
        }
        this._roleInfo = 'Able to vote to eliminate (1) player during the day.';     
    }
  }

  set target(target: string) {
    this._target = target;
  }

}