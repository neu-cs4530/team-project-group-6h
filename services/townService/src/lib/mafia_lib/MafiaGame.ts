import RecreationPlayer from './RecreationPlayer';
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
  _players: RecreationPlayer[]; // players in the game

  _mafiaPlayers: GamePlayer[]; // array of mafia members in the game

  _townPlayers: GamePlayer[]; // array of town members in the game

  _deadPlayers: GamePlayer[]; // array of eliminated players in the game

  _phase = Phase.lobby;

  _winner = Team.Unassigned;

  // Equal to the number of roles we currently have.
  // Currently, should be 4 (minus the Unassigned Role)
  MIN_PLAYERS = Object(Role).keys.length - 1;

  constructor(players: RecreationPlayer[]) {
    this._players = players;
    this._mafiaPlayers = [];
    this._townPlayers = [];
    this._deadPlayers = [];
  }

  get phase(): Phase {
    return this._phase;
  }

  get winner(): Team {
    return this._winner;
  }

  /**
   * Return the number of players currently in the game (for lobby logic).
   */
  get numPlayers(): number {
    return this._players.length;
  }

  get deadPlayers(): GamePlayer[] {
    return this._deadPlayers;
  }

  get mafiaPlayers(): GamePlayer[] {
    return this._mafiaPlayers;
  }

  get townPlayers(): GamePlayer[] {
    return this._townPlayers;
  }

  /**
   * Cycles through the phases of the game after the game has started.
   * @throws Error if the game is either in the 'lobby' or 'win' state.
   */
  updatePhase(): void {
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
        throw `Game is currently in phase: ${this._phase}`;
    }

  }

  /**
   * Determines if the game is over if there are no players remaining in either the Mafia or the town team.
   *
   * @returns False if the game is not over, true if it is over
   */
  private isGameOver(): boolean {
    if (this._mafiaPlayers && this._townPlayers) {
      if (
        this._mafiaPlayers.every(player => !player.isAlive) &&
        !this._townPlayers.every(player => !player.isAlive)
      ) {
        this._winner = Team.Town;
        this._phase = Phase.win;
        return true;
      }
      if (
        !this._mafiaPlayers.every(player => !player.isAlive) &&
        this._townPlayers.every(player => !player.isAlive)
      ) {
        this._winner = Team.Mafia;
        this._phase = Phase.win;
        return true;
      }
    }

    return false;
  }

  updateDeadPlayers(player: GamePlayer): void {
    this._deadPlayers.push(player);
  }

  /**
   * Randomly shuffles the list of players for fair role assignment. Modified answer from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
   */
  private shuffle(): void {
    let currentIndex = this._players.length;
    let randomIndex = this._players.length;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      [this._players[currentIndex], this._players[randomIndex]] = [
        this._players[randomIndex],
        this._players[currentIndex],
      ];
    }
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

    for (let i = this.MIN_PLAYERS; i > 0; i--) {
      result.push(playerList.splice(0, Math.ceil(playerList.length / i)));
    }

    return result;

  }

  /**
   * Randomly assigns the Teams and Roles to the players within the array and adds the players to the mafiaPlayers/townPlayers fields.
   */
  private assignRoles(): void {
    this.shuffle();

    const gamePlayers = this._players.map((player) => new GamePlayer(player));

    /** CURRENT LOGIC: 
     * 0. Shuffle array (to prevent first-come = mafia)
     * 1. Partition player array into MIN_PLAYERS number of roughly equal parts
     * 2. Assign first array to Mafia, the rest to town.
     * 3. Assign one first person in Mafia array to [GODFATHER]
     * 4. Add players of first array to mafiaPlayers.
     * 5. Assign one first person in each of the following arrays to DOCTOR, HYPNOTIST, DETECTIVE
     * 6. Add players of the remaining arrays to townPlayers.
     * MIN CASE: No players w/ unassigned roles (Every role is filled). 
     * Any number > min case will have unassigned, "vanilla" Mafia/Town players.
     */ 
    let [godfatherList, doctorList, hypnotistList, detectiveList]: GamePlayer[][] = this.partition(gamePlayers);

    // expression is not callable?: Solved by removing the "set" in front of role setter in GamePlayer.ts, I'm assuming setting two fields using a set is illegal?
    godfatherList[0].role(Role.Godfather);
    this._mafiaPlayers = godfatherList;

    doctorList[0].role(Role.Doctor);
    hypnotistList[0].role(Role.Hypnotist);
    detectiveList[0].role(Role.Detective);

    this._townPlayers = [...doctorList, ...hypnotistList, ...detectiveList];

  }

  /**
   * Starts the game by setting the phase to discussion during the day time.
   */
  gameStart(): void {
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
    if (this._players.length >= this.MIN_PLAYERS) {
      this.assignRoles();
    } 
  }

  /**
   * Updates the list of players in the mafia game when a player leaves. Will end the game if the leaver is the host and the phase is lobby, or if the number of players remaining in the game is less than or equal to two.
   * @param leaver The player who left the mafia game.
   */
  removePlayer(leaver: RecreationPlayer): void {
    this._players = this._players.filter(p => leaver.id !== p.id);

    // if player who left was the host and the phase is currently lobby, end game
    // if game is in progress and there are less than or equal to two players remaining, end the game
    if (
      (leaver._isHost && this.phase === Phase.lobby) ||
      (this._players.length <= 2 && this.phase !== Phase.lobby)
    ) {
      // end the game
      this.isGameOver();
      // empty the player list of this mafia game
      this._players = [];
    }
  }
}
