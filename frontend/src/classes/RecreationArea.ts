import MafiaGame from '../../../services/townService/src/lib/mafia_lib/MafiaGame';
import BoundingBox from './BoundingBox';
import ConversationArea, {ServerConversationArea, ConversationAreaListener} from './ConversationArea';
/**
 * Represents type of ServerRecreationArea that can be created. Extends the ServerConversationArea properties and methods while also containing the property of a mafia game.
 */
 export type ServerRecreationArea = {
    mafiaGame: MafiaGame | undefined; // undefined if not yet started
    // undefined if there are no players in the recArea
  } & ServerConversationArea;

export type RecreationAreaListener = {
    onMafiaGameCreated? : (game: MafiaGame) => void;
    onMafiaGameStarted? : (game: MafiaGame) => void;
    onMafiaGameFinished? : (game: MafiaGame, winner: string) => void;
} & ConversationAreaListener;

export default class RecreationArea extends ConversationArea {
    private _mafiaGame: MafiaGame | undefined; 

    public isRecreationArea = true; 

    constructor(label: string, boundingBox: BoundingBox, mafiaGame?: MafiaGame, topic?: string) {
        super(label, boundingBox, topic); 
        this._mafiaGame = mafiaGame; 
    }

    set mafiaGame(game: MafiaGame) {
        this._mafiaGame = game; 
    }

    toServerRecreationArea(): ServerRecreationArea {
        const serverArea = super.toServerConversationArea() as ServerRecreationArea;
        serverArea.mafiaGame = this._mafiaGame;
        return serverArea; 
    }

    addListener(listener: RecreationAreaListener) {
        this._listeners.push(listener);
    }

    static fromServerRecreationArea(serverArea: ServerRecreationArea): RecreationArea {
        const ret = new RecreationArea(serverArea.label, serverArea.boundingBox, serverArea.mafiaGame, serverArea.topic);
        ret.occupants = serverArea.occupantsByID;
        return ret;  
    }

    static isRecreationArea(): boolean {
        return true; 
    }

}
