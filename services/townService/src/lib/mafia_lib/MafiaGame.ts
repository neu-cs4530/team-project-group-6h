import RecreationPlayer from './RecreationPlayer';

/**
* Represents all the possible phases of a Mafia game.
*/
export enum Phases {
  'lobby',
  'day_discussion',
  'day_voting',
  'night',
}

/**
 * Represents type of MafiaGame that can be instantiated by players in a Recreation Room.
 */
export default class MafiaGame {

  players: RecreationPlayer[]; // players in the game

  phase: Phases;

  isGameOver: boolean;

  // custom parameters constructor
  constructor(players: RecreationPlayer[], givenPhase: Phases, isGameOver: boolean) {
    this.players = players;
    this.phase = givenPhase;
    this.isGameOver = isGameOver;
  }

  /**
   * Updates the list of players in the mafia game when a player leaves. Will end the game if the leaver is the host and the phase is lobby, or if the number of players remaining in the game is less than or equal to two.
   * @param leaver The player who left the mafia game.
   */
  removePlayer(leaver: RecreationPlayer): void {
    this.players = this.players.filter((p) => leaver.id !== p.id);

    // if player who left was the host and the phase is currently lobby, end game
    // if game is in progress and there are less than or equal to two players remaining, end the game
    if (leaver.isHost && this.phase === Phases.lobby || this.players.length <= 2 && this.phase !== Phases.lobby) {
      // end the game
      this.isGameOver = true;
      // empty the player list of this mafia game
      this.players = [];
    }
  }

}