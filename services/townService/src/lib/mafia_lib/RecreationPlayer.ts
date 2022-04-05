import Player from '../../types/Player';

/**
 * Extends the server player type that also keeps track of this player's current active recreation area, the current mafia game they are in, and whether they are the host.
 */
export default class RecreationPlayer extends Player {
  _isHost = false; // whether they are the host of the mafia game
  
  _isSpectator = false; // Whether they are currently a spectator

  /**
   * Toggles spectator.
   */
  updateSpectator(): void {
    this._isSpectator = true;
  }

  /**
   * Toggles the Host property.
   */
  updateHost(): void {
    this._isHost = true;
  }
}
