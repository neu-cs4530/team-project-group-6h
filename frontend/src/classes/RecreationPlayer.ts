import RecreationArea from "./RecreationArea";
import Player from "../../types/Player";

/**
 * Extends the server player type by creating a new type that also keeps track of this player's current active recreation area, the current mafia they are in, and whether they are the host.
 */
export default class RecreationPlayer extends Player { 
  _activeRecreationArea: RecreationArea | undefined; // which rec area they are in 
  // _activeMafiaGame: MafiaGame; // which mafia game they are in, undefined if not playing 
  // Changing to Observer pattern, commented out definition is cyclic 
  
  _isHost = false; // whether they are the host of the mafia game
  
  constructor(player: Player) {
    super(player.userName);
    
  }
} 
  