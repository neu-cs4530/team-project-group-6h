import { ServerConversationArea } from '../../client/TownsServiceClient';
import MafiaGame from './MafiaGame';
import RecreationPlayer from './RecreationPlayer';

/**
 * Represents type of RecreationArea that can be created. Extends the ServerConversationArea properties and methods while also containing the property of a mafia game.
 */
export type RecreationArea = {
  mafiaGame: MafiaGame | undefined; // undefined if not yet started

  players: RecreationPlayer[]; // undefined if there are no players in the recArea
} & ServerConversationArea;
