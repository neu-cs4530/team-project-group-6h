import ConversationArea from "./ConversationArea";
import MafiaGame from "./MafiaGame";
import RecreationPlayer from "./RecreationPlayer";
import BoundingBox from './BoundingBox';


/**
 * Represents type of RecreationArea that can be created. Extends the ServerConversationArea properties and methods while also containing the property of a mafia game.
 */
export default class RecreationArea extends ConversationArea {
  _currentMafiaGame: MafiaGame | undefined; // undefined if not yet started

  _players: RecreationPlayer[] | undefined; // undefined if there are no players in the recArea

  constructor(label: string, boundingBox: BoundingBox, topic?: string) {
    super(label, boundingBox, topic);
    this._currentMafiaGame = undefined;
    // create recreation players using names of players already in the recArea
    this._players = this.occupants.map((playerName) => new RecreationPlayer(playerName));
  }

  createGame(): void {
    if (this._players) {
      this._currentMafiaGame = new MafiaGame(this._players);

      // set the first player as the host of the game
      this._players[0].updateHost();

      // TODO: Probably need a UI identifier on the frontend to show the players who the host is
    }
  }
 
} 
