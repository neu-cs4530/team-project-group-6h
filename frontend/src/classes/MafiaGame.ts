import { nanoid } from 'nanoid';
import GamePlayer, { Role, Team } from './GamePlayer';
import Player from './Player';

/**
 * Represents all the possible phases of a Mafia game.
 */
export enum Phase {
  'lobby',
  'day_discussion',
  'day_voting',
  'night',
  'win',
}

/**
 * Represents type of MafiaGame that can be instantiated by players in a Recreation Room.
 */
export default class MafiaGame {
  private readonly _id: string; // unique identifier

  private _players: Player[]; // players in the game lobby

  private _gamePlayers: GamePlayer[]; // all players in the mafia game

  private _winner = Team.Unassigned;

  _phase = Phase.lobby;

  _host: Player; // the id of the host

  _deadPlayers: GamePlayer[];

  _alivePlayers: GamePlayer[];

  _townPlayers: GamePlayer[];

  _mafiaPlayers: GamePlayer[];

  // Equal to the number of roles we currently have.
  // Currently, should be 4 (minus the Unassigned Role)
  private MIN_PLAYERS: number = Object.keys(Role).length / 2 - 1;

  constructor(mafiaGameID: string, host: Player) {
    this._id = mafiaGameID; 
    this._host = host;
    this._players = [host];
    this._gamePlayers = [];
    this._deadPlayers = [];
    this._alivePlayers = [];
    this._townPlayers = [];
    this._mafiaPlayers = [];
  }

  set changePhase(phase: Phase) {
    this._phase = phase;
  }

  get phase(): string {
    return Phase[this._phase];
  }

  get winner(): Team {
    return this._winner;
  }

  get minPlayers() {
    return this.MIN_PLAYERS;
  }
  
  get id() {
    return this._id; 
  }

  get host() {
    return this._host;
  }

  get gamePlayers() {
    return this._gamePlayers;
  }

  set gamePlayers(gamePlayers: GamePlayer[]) {
    this.gamePlayers = gamePlayers;
  }

  /**
   * Return the number of players currently in the game (for lobby logic).
   */
  private numPlayers(): number {
    return this._players.length;
  }
  
  /**
   * Return the players in the lobby. 
   */
  get players(): Player[] {
    return this._players;
  }

  /**
   * Determines if there is a sufficient number of players to start the game.
   * @returns True if game can start, false if otherwise.
   */
  public canStart(): boolean {
    return this._phase === Phase.lobby &&
    this.MIN_PLAYERS === this._players.length;
  }

  public playerRole(playerID: string): Role | undefined {

    const getPlayer = (p : GamePlayer) => (p.id === playerID);
    const townPlayerIDs = this._townPlayers.map(gPlayer => gPlayer.id);
    const mafiaPlayerIDs = this._mafiaPlayers.map(gPlayer => gPlayer.id);

    if (townPlayerIDs.includes(playerID)) {
      return this._townPlayers.find(getPlayer)?.role;
    }
    if (mafiaPlayerIDs.includes(playerID)) {
      return this._mafiaPlayers.find(getPlayer)?.role;
    }
    return undefined;
  }

  get alivePlayers(): GamePlayer[] {
    const aliveTown = this._townPlayers.filter((player) => (!this._deadPlayers.includes(player)));
    const aliveMafia = this._mafiaPlayers.filter((player) => (!this._deadPlayers.includes(player)));
    return aliveTown.concat(aliveMafia);
  }

  get deadPlayers(): GamePlayer[] {
    return this._deadPlayers;
  }

  get mafiaPlayers(): GamePlayer[] {
    return [...this._gamePlayers].filter((player) => player.team === Team.Mafia);
  }

  get townPlayers(): GamePlayer[] {
    return [...this._gamePlayers].filter((player) => player.team === Team.Town);
  }

  /**
   * Adds a player to the game lobby.
   * @param player The playyer to add to the game lobby.
   * @returns Whether or not the player was added
   */
  public addPlayer(player: Player): boolean {
    if (this._phase === Phase.lobby) {
      this._players.push(player);
      return true;
    }
    return false; 
  }

  /**
   * Cycles through the phases of the game after the game has started.
   * @throws Error if the game is either in the 'lobby' or 'win' state.
   */
  public updatePhase(): void {
    switch (this._phase) {
      case Phase.day_discussion:
        this._phase = Phase.day_voting;
        break;
      case Phase.day_voting:
        this._phase = Phase.night;
        break;
      case Phase.night:
        this._phase = Phase.day_discussion;
        break;
      default:
        throw Error(`Game is currently in phase: ${Phase[this._phase]}`);
    }
  }

  /**
   * Determines if the game is over if there are no players remaining in either the Mafia or the town team.
   *
   * @returns False if the game is not over, true if it is over
   */
  private isGameOver(): boolean {
    if (this.mafiaPlayers && this.townPlayers) {
      if (
        this.mafiaPlayers.every(player => !player.isAlive) &&
        !this.townPlayers.every(player => !player.isAlive)
      ) {
        this._winner = Team.Town;
        this._phase = Phase.win;
        return true;
      }
      if (
        !this.mafiaPlayers.every(player => !player.isAlive) &&
        this.townPlayers.every(player => !player.isAlive)
      ) {
        this._winner = Team.Mafia;
        this._phase = Phase.win;
        return true;
      }
    }

    return false;
  }

  /**
   * Eliminates the given player in the game.
   * @param playerName The id of the player to eliminate
   */
  public eliminatePlayer(playerID: string): void {

    // find the player in either the mafia or town arrays (hopefully no same name situations)
    // const mafiaAndTown: GamePlayer[] = [...this._mafiaPlayers, ...this._townPlayers];

    const playerIndex = this._gamePlayers.findIndex(player => playerID === player.playerID);
  
    // console.log(`Index: ${playerIndex}`);

    if (playerIndex >= 0) {
      const gamePlayer = this._gamePlayers[playerIndex];
      if (gamePlayer.isAlive) {
        this._gamePlayers[playerIndex].eliminate();
        this._deadPlayers.push(gamePlayer);

      }

    }

    
  }


  /**
   * Sets the target of the player to vote out of the game.
   * @param voterID The ID of the player that is voting
   * @param targetID The ID of the player that this player is voting for
   */
  public votePlayer(voterID: string, targetID: string): void {
    const playerIndex = this._gamePlayers.findIndex((player) => player.playerID === voterID);

    // give the ID of the person that this player has voted for
    this._gamePlayers[playerIndex].votedPlayer = targetID;
  }

  /**
   * Sets the target of role player to perform role actions.
   * @param roleID The ID of the player performing the role action
   * @param targetID The ID of the player that this player is performing the action on.
   */
  public setTarget(roleID: string, targetID: string): void {
    const playerIndex = this._gamePlayers.findIndex((player) => player.playerID === roleID);

    // give the ID of the person that this player has voted for
    this._gamePlayers[playerIndex].targetPlayer = targetID;
  }

  /**
   * Starts the game by setting the phase to discussion during the day time.
   */
  public gameStart(playerRoles: GamePlayer[]): void {
    this._phase = Phase.day_discussion;

    this._mafiaPlayers = playerRoles.filter(player => 
      player.team === Team.Mafia );

    this._townPlayers = playerRoles.filter(player => 
      player.team === Team.Town
    );
    

    /*
    export enum Role {
      'Unassigned',
      'Detective',
      'Doctor',
      'Hypnotist',
      'Godfather',
    }
    */

    // Current Assumption: Min # of Players = Num of Players that can fill all the following roles at least once:
    /** MAFIA SIDE:
     * Godfather
     * 
     * TOWN SIDE:
     * Detective
     * Doctor
     * Hypnotist
     * MIN_PLAYERS = 4
    */
   /*
    if (this._players.length >= this.MIN_PLAYERS) {
      this.assignRoles();
    } 
    */

  }

  /**
   * Updates the list of players in the mafia game when a player leaves. Will end the game if the leaver is the host and the phase is lobby, or if the number of players remaining in the game is less than or equal to two.
   * @param leaver The player who left the mafia game.
   */
  removePlayer(leaver: Player): void {
    this._players = this._players.filter(p => leaver.id !== p.id);

    // if player who left was the host and the phase is currently lobby, end game
    // if game is in progress and there are less than or equal to two players remaining, end the game
    if (
      (leaver === this._host && this._phase === Phase.lobby) ||
      (this._players.length <= 2 && this._phase !== Phase.lobby)
    ) {
      // end the game
      this.isGameOver();
      // empty the player list of this mafia game
      this._players = [];
    }
  }
}
