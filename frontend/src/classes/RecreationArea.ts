import ConversationArea from "";
import MafiaGame from "./MafiaGame";
import RecreationPlayer from "./RecreationPlayer";
import BoundingBox from '../../client/TownsServiceClient';


/**
 * Represents type of RecreationArea that can be created. Extends the ServerConversationArea properties and methods while also containing the property of a mafia game.
 */
export default class RecreationArea extends ConversationArea {
  _mafiaGame: MafiaGame | undefined; // undefined if not yet started

  _players: RecreationPlayer[] | undefined;

  constructor(players: RecreationPlayer[], label: string, boundingBox: BoundingBox, topic?: string) {
    super(label, boundingBox, topic);
    this._mafiaGame = undefined;
    this._players = players;
  }
 
} 
