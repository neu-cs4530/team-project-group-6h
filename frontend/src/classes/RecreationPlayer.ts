import Player, { UserLocation } from './Player'

export default class RecreationPlayer extends Player {
    _isHost = false;

    _isSpectator = false;

    constructor(id: string, userName: string, location: UserLocation, isHost: boolean, isSpectator: boolean) {
        super(id, userName, location);
        this._isHost = isHost;
        this._isSpectator = isSpectator;
    }

}