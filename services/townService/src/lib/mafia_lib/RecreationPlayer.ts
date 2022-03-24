import { RecreationArea } from "./RecreationArea";
import { MafiaGame } from "./MafiaGame";
import Player from "../../types/Player";

/**
 * Extends the server player type by creating a new type that also keeps track of this player's current active recreation area, the current mafia they are in, and whether they are the host.
 */
 export type RecreationPlayer = { 
    activeRecreationArea: RecreationArea, // which rec area they are in 
    activeMafiaGame: MafiaGame | undefined, // which mafia game they are in, undefined if not playing
    isHost: boolean, // whether they are the host of the mafia game
  } & Player;
  