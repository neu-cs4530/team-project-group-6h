import { nanoid } from 'nanoid';
import Player from '../../types/Player';
import GamePlayer, { Role, Team } from './GamePlayer';

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

  private _host: Player; // the id of the host

  private _gamePlayers: GamePlayer[]; // all players in the mafia game

  private _phase = Phase.lobby;

  private _winner = Team.Unassigned;

  // Equal to the number of roles we currently have.
  // Currently, should be 4 (minus the Unassigned Role)
  private MIN_PLAYERS: number = Object.keys(Role).length / 2 - 1;

  constructor(host: Player) {
    this._id = nanoid();
    this._host = host;
    this._players = [host];
    this._gamePlayers = [];
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

  get minPlayers(): number {
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

  /**
   * Gets the role of the given player.
   * @param playerID The player that we want to find the role of
   * @returns The role of the given player, or undefined if this player does not exist
   */
  public playerRole(playerID: string): Role | undefined {
    const gamePlayer = this._gamePlayers.find(player => player.playerID === playerID);

    if (gamePlayer) {
      return gamePlayer.role;
    }

    return undefined;
  }

  /**
   * Return the number of players currently in the game (for lobby logic).
   */
  private numPlayers(): number {
    return this._players.length;
  }

  /**
   * Returns all of the eliminated players to render in the UI.
   */
  get deadPlayers(): GamePlayer[] {
    // console.log(`${[...mafiaNames, ...townNames]}`);
    return [...this._gamePlayers].filter(player => player.isAlive === false);
  }

  /**
   * Returns all players still alive within the game.
   */
  get alivePlayers(): GamePlayer[] {
    return [...this._gamePlayers].filter(player => player.isAlive === false);
  }

  get mafiaPlayers(): GamePlayer[] {
    return [...this._gamePlayers].filter(player => player.team === Team.Mafia);
  }

  get townPlayers(): GamePlayer[] {
    return [...this._gamePlayers].filter(player => player.team === Team.Town);
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
   * Randomly shuffles the list of players for fair role assignment. Modified answer from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
   * @returns shuffled version of player array
   */
  private shuffle(): Player[] {
    let currentIndex = this.numPlayers();
    let randomIndex = this.numPlayers();

    const playerArray = [...this._players];

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      [playerArray[currentIndex], playerArray[randomIndex]] = [
        playerArray[randomIndex],
        playerArray[currentIndex],
      ];
    }

    return playerArray;
  }

  /**
   * Partitions the player array into MIN_PLAYERS number of roughly equal arrays
   * @param playerList The list of players to partition
   * @returns An array of GamePlayer arrays (from partitioned players list)
   * Modified form of https://stackoverflow.com/questions/8188548/splitting-a-js-array-into-n-arrays
   */
  private partition(playerList: GamePlayer[]): GamePlayer[][] {
    const result: GamePlayer[][] = [];

    // Get 1/MIN_PLAYERS of the list, then 1/(MIN_PLAYERS - 1) of the list...
    // o | o | o | o

    for (let i = this.MIN_PLAYERS; i > 0; i -= 1) {
      result.push(playerList.splice(0, Math.ceil(playerList.length / i)));
    }

    return result;
  }

  /**
   * TODO: Test 'Adds players that have been voted out from the game to the deadPlayers list' is failing, it isn't finding the playerName in the mafia OR town array for some reason.
   * Eliminates the given player in the game.
   * @param playerName The id of the player to eliminate
   * @throws Exception if the playerName does not exist or player is not on given team.
   */
  public eliminatePlayer(playerID: string): void {
    // find the player in either the mafia or town arrays (hopefully no same name situations)
    // const mafiaAndTown: GamePlayer[] = [...this._mafiaPlayers, ...this._townPlayers];

    const playerIndex = this._gamePlayers.findIndex(
      player =>
        // console.log(`Player ID = ${playerID}`);
        // console.log(`Current ID = ${player.playerID}`);
        // console.log(`${playerID === player.playerID}`);
        playerID === player.playerID,
    );

    // console.log(`Index: ${playerIndex}`);

    if (playerIndex >= 0) {
      const gamePlayer = this._gamePlayers[playerIndex];
      if (gamePlayer.isAlive) {
        this._gamePlayers[playerIndex].eliminate();
      }
    } else {
      throw 'This player does not exist';
    }
  }

  /**
   * Randomly assigns the Teams and Roles to the players within the array and adds the players to the mafiaPlayers/townPlayers fields.
   */
  private assignRoles(): void {
    const shuffledPlayers = this.shuffle();

    const gamePlayers = shuffledPlayers.map(player => new GamePlayer(player));

    /** CURRENT LOGIC:
     * 0. Shuffle array (to prevent first-come = mafia)
     * 1. Partition player array into MIN_PLAYERS number of roughly equal parts
     * 2. Assign first array to Mafia, the rest to town.
     * 3. Assign one first person in Mafia array to [GODFATHER]
     * 4. Assign one first person in each of the following arrays to DOCTOR, HYPNOTIST, DETECTIVE
     * 5. Add players of the arrays to gamePlayers.
     * MIN CASE: No players w/ unassigned roles (Every role is filled).
     * Any number > min case will have unassigned, "vanilla" Mafia/Town players.
     */
    const [
      godfatherList,
      doctorList,
      hypnotistList,
      detectiveList,
    ]: GamePlayer[][] = this.partition(gamePlayers);

    godfatherList.forEach(mafia => {
      mafia.team = Team.Mafia;
      mafia.role = Role.Unassigned;
    });
    godfatherList[0].role = Role.Godfather;

    doctorList.forEach(town => {
      town.team = Team.Town;
      town.role = Role.Unassigned;
    });
    doctorList[0].role = Role.Doctor;

    hypnotistList.forEach(town => {
      town.team = Team.Town;
      town.role = Role.Unassigned;
    });
    hypnotistList[0].role = Role.Hypnotist;

    detectiveList.forEach(town => {
      town.team = Team.Town;
      town.role = Role.Unassigned;
    });
    detectiveList[0].role = Role.Detective;

    this._gamePlayers = [...godfatherList, ...doctorList, ...hypnotistList, ...detectiveList];
  }

  /**
   * Sets the target of the player to vote out of the game.
   * @param voterID The ID of the player that is voting
   * @param targetID The ID of the player that this player is voting for
   */
  public votePlayer(voterID: string, targetID: string): void {
    const playerIndex = this._gamePlayers.findIndex(player => player.playerID === voterID);

    // give the ID of the person that this player has voted for
    this._gamePlayers[playerIndex].votedPlayer = targetID;
  }

  /**
   * Sets the target of role player to perform role actions.
   * @param roleID The ID of the player performing the role action
   * @param targetID The ID of the player that this player is performing the action on.
   */
  public setTarget(roleID: string, targetID: string): void {
    const playerIndex = this._gamePlayers.findIndex(player => player.playerID === roleID);

    // give the ID of the person that this player has voted for
    this._gamePlayers[playerIndex].targetPlayer = targetID;
  }

  /**
   * Starts the game by setting the phase to discussion during the day time.
   */
  public gameStart(): void {
    this._phase = Phase.day_discussion;

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
    if (this.numPlayers() >= this.MIN_PLAYERS) {
      this.assignRoles();
    }
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
