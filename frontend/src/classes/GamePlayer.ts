import Player, { UserLocation } from './Player';

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
 * Contains information about Game Player to be sent from server
 */
export type ServerGamePlayer = {
  player: string;
  isAlive: boolean;
  currentVote: string | undefined;
  team: Team;
  role: Role;
  roleInfo: string;
  target: string | undefined;
  result: string | undefined;
  voteTally: number;
};

/**
 * Contains general functionality necessary for a player in a mafiaGame.
 */
export default class GamePlayer {
  private _player: Player; // the associated player

  private _isAlive: boolean; // Is the player currently alive within the game?

  private _currentVote: string | undefined; // ID of the player voted for during this cycle

  private _team: Team; // The team that the GamePlayer is on

  private _role: Role; // The currently assigned role that the player has

  private _roleInfo: string; // Information about the player's given role

  private _target: string | undefined; // the ID of the target player to perform role actions on

  private _result: string | undefined; // The result of what happened to thos player at the end of a phase.

  private _voteTally = 0;

  /**
   * Default constructor; input isAlive = false to create as spectator
   */
  constructor(recPlayer: Player, gamePlayer: ServerGamePlayer) {
    this._player = recPlayer;
    this._isAlive = true;
    this._currentVote = undefined;
    this._team = gamePlayer.team;
    this._role = gamePlayer.role;
    this._roleInfo = gamePlayer.roleInfo;
    this._target = undefined;
    this._result = undefined;
  }

  get player(): Player {
    return this._player;
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

  set votedPlayer(player: string | undefined) {
    this._currentVote = player;
  }

  get currentVote(): string | undefined {
    return this._currentVote;
  }

  set result(result: string | undefined) {
    this._result = result;
  }

  get result(): string | undefined {
    return this._result;
  }

  get userName() {
    return this._player.userName;
  }

  get id() {
    return this._player.id;
  }

  set targetPlayer(target: string | undefined) {
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

  public resetTally(): void {
    this._voteTally = 0;
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

  static fromServerGamePlayer(recPlayer: Player, serverGamePlayer: ServerGamePlayer): GamePlayer {
    const ret = new GamePlayer(recPlayer, serverGamePlayer);
    return ret;
  }
}
