import ConversationArea from "../ConversationArea";
import MafiaGame from "./MafiaGame";
import RecreationPlayer from "./RecreationPlayer";
import BoundingBox from '../../../../services/townService/src/client/TownsServiceClient';


/**
 * Represents type of RecreationArea that can be created. Extends the ServerConversationArea properties and methods while also containing the property of a mafia game.
 */
export default class RecreationArea extends ConversationArea {
  mafiaGame: MafiaGame | undefined; // undefined if not yet started
  _players: RecreationPlayer[] | undefined;

  constructor(label: string, boundingBox: BoundingBox, topic?: string) {
    super(label, boundingBox, topic);
  }
 
} 
