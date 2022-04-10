import { ServerConversationArea } from '../../client/TownsServiceClient';
import MafiaGame from './MafiaGame';
import RecreationPlayer from './RecreationPlayer';

/**
 * Represents type of ServerRecreationArea that can be created. Extends the ServerConversationArea properties and methods while also containing the property of a mafia game.
 */
export type ServerRecreationArea = {
  _mafiaGame: MafiaGame | undefined; // undefined if not yet started

  //_players: RecreationPlayer[]; // undefined if there are no players in the recArea
} & ServerConversationArea;
