import Player from "../../../services/townService/src/types/Player";

/**
 * Extends the server player type by creating a new type that also keeps track of this player's current active recreation area, the current mafia they are in, and whether they are the host.
 */
export default class RecreationPlayer extends Player { 
  
  _isHost = false; // whether they are the host of the mafia game

  _isSpectator = false; // Whether they are currently a spectator
  

  /**
   * Toggles spectator.
   */
  updateSpectator(isSpectator = true) {
    this._isSpectator = isSpectator;
  }

  /**
   * Toggles the Host property.
   */
  updateHost(isHost = true) {
    this._isHost = isHost;
  }
} 
