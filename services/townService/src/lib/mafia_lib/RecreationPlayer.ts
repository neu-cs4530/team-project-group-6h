import Player from '../../types/Player';

/**
 * Extends the server player type that also keeps track of this player's current active recreation area, the current mafia they are in, and whether they are the host.
 */
export default class RecreationPlayer extends Player { 
  public isHost: boolean; // whether they are the host of the mafia game

  public isSpectator: boolean; // whether the player is a spectator

  constructor(userName: string, isHost: boolean, isSpectator: boolean) {
    super(userName);
    this.isHost = isHost;
    this.isSpectator = isSpectator;
  }
}
