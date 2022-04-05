import MafiaGame from '../../../services/townService/src/lib/mafia_lib/MafiaGame';
import BoundingBox from './BoundingBox';
import ConversationArea, {ServerConversationArea, ConversationAreaListener} from './ConversationArea';
import RecreationPlayer from './RecreationPlayer'
/**
 * Represents type of ServerRecreationArea that can be created. Extends the ServerConversationArea properties and methods while also containing the property of a mafia game.
 */
 export type ServerRecreationArea = {
    mafiaGame: MafiaGame | undefined; // undefined if not yet started
  
    players: RecreationPlayer[]; // undefined if there are no players in the recArea
  } & ServerConversationArea;

export type RecreationAreaListener = {
    onMafiaGameCreated? : (game: MafiaGame) => void;
    onMafiaGameStarted? : (game: MafiaGame) => void;
    onMafiaGameFinished? : (game: MafiaGame, winner: string) => void;
} & ConversationAreaListener

export default class RecreationArea extends ConversationArea {
    private _mafiaGame: MafiaGame | undefined; 

    private _players: RecreationPlayer[]; 

    constructor(label: string, boundingBox: BoundingBox,  players: RecreationPlayer[], mafiaGame?: MafiaGame, topic?: string) {
        super(label, boundingBox, topic); 
        this._players = players;
        this._mafiaGame = mafiaGame; 
    }

    set mafiaGame(game: MafiaGame) {
        this._mafiaGame = game; 
    }

    set players(players: RecreationPlayer[]) {
        this._players = players;
    }

    toServerRecreationArea(): ServerRecreationArea {
        const serverArea = super.toServerConversationArea() as ServerRecreationArea;
        serverArea.mafiaGame = this._mafiaGame;
        serverArea.players = this._players;
        return serverArea; 
    }

    addListener(listener: RecreationAreaListener) {
        this._listeners.push(listener);
    }

    static fromServerRecreationArea(serverArea: ServerRecreationArea): RecreationArea {
        const ret = new RecreationArea(serverArea.label, serverArea.boundingBox, serverArea.players, serverArea.mafiaGame, serverArea.topic);
        ret.occupants = serverArea.occupantsByID;
        return ret;  
    }

}
