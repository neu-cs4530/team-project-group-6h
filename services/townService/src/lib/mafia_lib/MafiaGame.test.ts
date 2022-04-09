import MafiaGame, { Phase } from './MafiaGame'
import RecreationPlayer from './RecreationPlayer';
import { nanoid } from 'nanoid';

describe('MafiaGame', () => {
  const recPlayer1 = new RecreationPlayer(nanoid());
  const recPlayer2 = new RecreationPlayer(nanoid());
  const recPlayer3 = new RecreationPlayer(nanoid());
  const recPlayer4 = new RecreationPlayer(nanoid());
  const recArray = [recPlayer1, recPlayer2, recPlayer3, recPlayer4];

  

  it('Partitions player list and assigns roles correctly', () => {
    
  });
  it('Adds players that have been voted out from the game to the DeadPlayers list', () => {
    
  });

  it('Cycles through the phases after the game has started', () => {
    const newMafiaGame = new MafiaGame(recArray);

    newMafiaGame.gameStart();

    expect(newMafiaGame.phase).toBe(Phase[Phase.day_discussion]);
    newMafiaGame.updatePhase();
    expect(newMafiaGame.phase).toBe(Phase[Phase.day_voting]);
    newMafiaGame.updatePhase();
    expect(newMafiaGame.phase).toBe(Phase[Phase.night]);
    newMafiaGame.updatePhase();
    expect(newMafiaGame.phase).toBe(Phase[Phase.day_discussion]);
  });
  it('Throws error if game phase is updated before or after the game', () => {
    
    const newMafiaGame = new MafiaGame(recArray);
    newMafiaGame._phase = Phase.win;
    expect(() => newMafiaGame.updatePhase()).toThrow(`Game is currently in phase: ${Phase[Phase.win]}`);
    newMafiaGame._phase = Phase.lobby;
    expect(() => newMafiaGame.updatePhase()).toThrow(`Game is currently in phase: ${Phase[Phase.lobby]}`);
    
  });
});