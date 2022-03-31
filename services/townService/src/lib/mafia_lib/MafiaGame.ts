import { ServerConversationArea } from '../../client/TownsServiceClient';
import Player from '../../types/Player';

/**
  * Represents all the possible phases of a Mafia game.
  */
export enum Phase {
  'lobby',
  'discussion',
  'voting',
  'day',
  'night',
}

/**
 * Represents type of MafiaGame that can be instantiated by players in a Recreation Room.
 */
export type MafiaGame = {
  players: RecreationPlayer[], // players in the game
  phase: Phase, 
  isGameOver: boolean,
};

/**
 * Represents type of RecreationArea that can be created. Extends the ServerConversationArea properties and methods while also containing the property of a mafia game.
 */
export type RecreationArea = {
  mafiaGame: MafiaGame | undefined, // undefined if not yet started
  players: RecreationPlayer[],
} & ServerConversationArea;

/**
 * Extends the server player type by creating a new type that also keeps track of this player's current active recreation area, the current mafia they are in, and whether they are the host.
 */
export type RecreationPlayer = { 
  activeRecreationArea: RecreationArea, // which rec area they are in 
  activeMafiaGame: MafiaGame | undefined, // which mafia game they are in, undefined if not playing
  isHost: boolean, // whether they are the host of the mafia game
} & Player;