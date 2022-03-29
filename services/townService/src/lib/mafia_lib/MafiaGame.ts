import { RecreationPlayer } from "./RecreationPlayer";

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
 export type MafiaGame = {
    players: RecreationPlayer[], // players in the game
    phase: phase, 
    isGameOver: boolean,


}