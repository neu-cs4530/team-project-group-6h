import Player from "../../../services/townService/src/types/Player";

/**
 * Extends the server player type by creating a new type that also keeps track of this player's current active recreation area, the current mafia they are in, and whether they are the host.
 */
export default class RecreationPlayer extends Player { 
  // _activeMafiaGame: MafiaGame; // which mafia game they are in, undefined if not playing 
  // Changing to Observer pattern, commented out definition is cyclic 
  
  _isHost = false; // whether they are the host of the mafia game

  _isSpectator = false; // Whether they are currently a spectator
  
  constructor(player: Player) {
    super(player.userName);
    
  }

  /**
   * Toggles spectator.
   */
  updateSpectator() {
    this._isSpectator = true;
  }
} 
  