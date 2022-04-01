import RecreationPlayer from './RecreationPlayer';
import GamePlayer, { Team } from './GamePlayer';

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
   * Randomly assigns the Teams and Roles to the players within the array.
   */
  private assignRoles(): void {
    // const {length} = this._players;
    this.shuffle();

    // TODO: Implement role assignment logic.
  }

  /**
   * The main function of the game.
   */
  public play(): void {
    // LOBBY LOGIC

    while (!this.isGameOver()) {
      // DO STUFF
    }
  }

  /**
   * Starts the game by setting the phase to discussion during the day time.
   */
  gameStart(): void {
    this._phase = Phase.day_discussion;

    // assigns roles for all the players in the game
    this.assignRoles();
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
