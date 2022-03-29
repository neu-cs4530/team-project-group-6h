import GamePlayer from "./GamePlayer";
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
  _players: RecreationPlayer[] | undefined; // players in the game

  _phase = Phase.lobby;

  _isGameOver = false;

  constructor(players: RecreationPlayer[]) {
    this._players = players;

  }

  gameStart(): void {
    this._phase = Phase.day;

    // Make all the Players in the rec room Game Players
    this._players?.map((player) => new GamePlayer(player));
  }

}