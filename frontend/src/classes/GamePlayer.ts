import Player, { UserLocation } from "./Player";


/**
 * Represents two possible teams that a GamePlayer can be a part of within the Mafia Game.
 */
 export enum Team {
  'Mafia',
  'Town',
  'Unassigned',
}

export enum Role {
  'Unassigned',
  'Detective',
  'Doctor',
  'Hypnotist',
  'Godfather',
}

/**
 * Contains general functionality necessary for a player in a mafiaGame. 
 */
export default class GamePlayer {
  private _player: Player; // the associated player

  private _isAlive: boolean; // Is the player currently alive within the game?

  private _currentVote: string | undefined; // ID of the player voted for during this cycle

  private _team = Team.Unassigned; // The team that the GamePlayer is on

  private _role = Role.Unassigned; // The currently assigned role that the player has

  private _roleInfo: string; // Information about the player's given role

  private _target: string | undefined; // the target player to perform role actions on

  private _voteTally = 0;

  /**
   * Default constructor; input isAlive = false to create as spectator
   */
  constructor(recPlayer: Player) {
    this._player = recPlayer;
    this._isAlive = true;
    this._currentVote = undefined;
    this._roleInfo = '';
    this._target = undefined;
  }

  get playerID(): string {
    return this._player.id;
  }

  get playerUserName(): string {
    return this._player.userName;
  }

  get playerLocation(): UserLocation | undefined {
    return this._player.location;
  }

  set team(team: Team) {
    this._team = team;
  }

  get team(): Team {
    return this._team;
  }

  set votedPlayer(currentVote: string) {
    this._currentVote = currentVote;
  }

  get currentVote(): string | undefined {
    return this._currentVote;
  }



  set targetPlayer(target: string) {
    this._target = target;
  }

  get target(): string | undefined {
    return this._target;
  }

  get isAlive(): boolean {
    return this._isAlive;
  }

  get roleInfo(): string {
    return this._roleInfo;
  }

  get voteTally(): number {
    return this._voteTally;
  }

  public eliminate(): void {
    this._isAlive = false;
  }

  /**
   * Sets both the role of a GamePlayer and the role information of the GamePlayer.
   */
  set role(role: Role) {
    this._role = role;
    
    switch (role) {
      case Role.Detective:
        this._roleInfo =
          'Detective: Able to investigate the role of one (1) player during the night.';
        break;
      case Role.Doctor:
        this._roleInfo = 'Doctor: Can resurrect one (1) player during the night.';
        break;
      case Role.Hypnotist:
        this._roleInfo =
          'Hypnotist: Able to prevent one (1) player from using their ability during the night.';
        break;
      case Role.Godfather:
        this._roleInfo =
          'Godfather: Can override the a mafia decision to eliminate a town member in favor of their own.';
        break;
      default:
        if (this._team === Team.Mafia) {
          this._roleInfo = 'Able to vote to eliminate (1) player during the night.';
        }
        this._roleInfo = 'Able to vote to eliminate (1) player during the day.';
    }
  }

  get role(): Role {
    return this._role;
  }

  vote(): void {
    this._voteTally += 1;
  }
}
