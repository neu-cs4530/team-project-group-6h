import GamePlayer, { Team } from "./GamePlayer";

/**
 * Extends the GamePlayer type, adding general role functionality common to all Mafia roles, such as:
 * TODO: ADD
 */
export default class MafiaMember extends GamePlayer { 

  _roleInfo = 'Mafia: Can eliminate one Town member during the night.';

   constructor(gamePlayer: GamePlayer) {
    super(gamePlayer);
    this.team = Team.Mafia;
  }
  
}

