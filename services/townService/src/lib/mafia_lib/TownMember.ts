import GamePlayer, { Team } from './GamePlayer';

/**
 * Extends the GamePlayer type to add role information for all Town players.
 */
export default class TownMember extends GamePlayer { 
  /**
   * TODO: Constructors for role assignment
   */
  _roleInfo = 'Town Member: Can vote to eliminate one (1) player during the day.';
  
  constructor(gamePlayer: GamePlayer) {
    super(gamePlayer);
    this.team = Team.Town;
  }

} 

  