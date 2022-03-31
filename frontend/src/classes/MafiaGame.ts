import GamePlayer, {Team, Role} from "./GamePlayer";
import RecreationPlayer from "./RecreationPlayer";

/**
  * Represents all the possible phases of a Mafia game.
  */
 export enum Phase {
    'lobby',
    'discussion',
    'voting',
    'day',
    'night',
  };

/**
 * Represents type of MafiaGame that can be instantiated by players in a Recreation Room.
 */
export default class MafiaGame {
  _players: RecreationPlayer[]; // players in the game

  _phase = Phase.lobby;

  _isGameOver = false;

  constructor(players: RecreationPlayer[]) {
    this._players = players;

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
        this._players[randomIndex], this._players[currentIndex]];
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


  gameStart(): void {
    this._phase = Phase.day;

    // Make all the Players in the rec room Game Players
    if (this._players) {
      this._players.map((player) => new GamePlayer(player));

      // random assignment of the roles
      this.assignRoles();
    }
    
  }

}