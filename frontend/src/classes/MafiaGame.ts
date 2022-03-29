import RecreationPlayer from "./RecreationPlayer";

/**
  * Represents all the possible phases of a Mafia game.
  */
 export enum phase {
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
  _phase: phase = phase.night;
  _isGameOver: boolean = false;

  constructor(players: RecreationPlayer[]) {
    this._players = players;

  }

}