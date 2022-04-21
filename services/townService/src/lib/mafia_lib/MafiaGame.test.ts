import { nanoid } from 'nanoid';
import Player from '../../types/Player';
import MafiaGame, { Phase } from './MafiaGame';

describe('MafiaGame', () => {
  const recPlayer1 = new Player(nanoid());
  const recPlayer2 = new Player(nanoid());
  const recPlayer3 = new Player(nanoid());
  const recPlayer4 = new Player(nanoid());
  const newMafiaGame = new MafiaGame(recPlayer1);
  newMafiaGame.addPlayer(recPlayer2);
  newMafiaGame.addPlayer(recPlayer3);
  newMafiaGame.addPlayer(recPlayer4);

  it('Partitions player list and randomly assigns roles correctly', () => {
    newMafiaGame.gameStart();

    expect(newMafiaGame.minPlayers).toBe(4);
    expect(newMafiaGame.townPlayers.length).toBe(3);
    expect(newMafiaGame.mafiaPlayers.length).toBe(1);
  });
  it('Cycles through the phases after the game has started', () => {
    expect(newMafiaGame.phase).toBe(Phase[Phase.day_discussion]);
    newMafiaGame.updatePhase();
    expect(newMafiaGame.phase).toBe(Phase[Phase.day_voting]);
    newMafiaGame.updatePhase();
    expect(newMafiaGame.phase).toBe(Phase[Phase.night]);
    newMafiaGame.updatePhase();
    expect(newMafiaGame.phase).toBe(Phase[Phase.day_discussion]);
  });
  it('Adds players that have been voted out from the game to the deadPlayers list', () => {
    newMafiaGame.eliminatePlayer(recPlayer2.id);

    expect(newMafiaGame.townPlayers.length).toBe(3);
    expect(newMafiaGame.mafiaPlayers.length).toBe(1);
    expect(newMafiaGame.deadPlayers.length).toBe(1);
    expect(newMafiaGame.deadPlayers[0]).toBeDefined();
    expect(newMafiaGame.deadPlayers[0].userName).toBe(recPlayer2.userName);
    expect(newMafiaGame.deadPlayers[0].id).toBe(recPlayer2.id);
    expect(newMafiaGame.deadPlayers[0].isAlive).toBe(false);

    // no duplicate eliminations
    newMafiaGame.eliminatePlayer(recPlayer2.id);
    expect(newMafiaGame.townPlayers.length).toBe(3);
    expect(newMafiaGame.mafiaPlayers.length).toBe(1);
    expect(newMafiaGame.mafiaPlayers.length).toBe(1);

    newMafiaGame.eliminatePlayer(recPlayer1.id);

    expect(newMafiaGame.townPlayers.length).toBe(3);
    expect(newMafiaGame.mafiaPlayers.length).toBe(1);
    expect(newMafiaGame.deadPlayers.length).toBe(2);
    expect(newMafiaGame.deadPlayers[1]).toBeDefined();
  });
  
  it('Throws error if game phase is updated before or after the game', () => {
    const newMafiaGame1 = new MafiaGame(recPlayer1);
    newMafiaGame1.changePhase = Phase.win;
    expect(() => newMafiaGame1.updatePhase()).toThrow(
      `Game is currently in phase: ${Phase[Phase.win]}`,
    );
    newMafiaGame1.changePhase = Phase.lobby;
    expect(() => newMafiaGame1.updatePhase()).toThrow(
      `Game is currently in phase: ${Phase[Phase.lobby]}`,
    );
  });
  it('Eliminates most voted player at end of day cycle and updates phase', () => {
    const mafiaGame2 = new MafiaGame(recPlayer1);
    mafiaGame2.addPlayer(recPlayer2);
    mafiaGame2.addPlayer(recPlayer3);
    mafiaGame2.addPlayer(recPlayer4);

    mafiaGame2.gameStart();
    expect(mafiaGame2.phase).toBe(Phase[Phase.day_discussion]);
    mafiaGame2.updatePhase();
    expect(mafiaGame2.phase).toBe(Phase[Phase.day_voting]);
    mafiaGame2.votePlayer(recPlayer1.id, recPlayer2.id);
    mafiaGame2.votePlayer(recPlayer3.id, recPlayer2.id);
    mafiaGame2.votePlayer(recPlayer4.id, recPlayer2.id);
    mafiaGame2.endDay();

    expect(mafiaGame2.deadPlayers.length).toBe(1);
    expect(mafiaGame2.alivePlayers.length).toBe(3);
    expect(mafiaGame2.deadPlayers[0]).toBeDefined();
    expect(mafiaGame2.deadPlayers[0].id).toBe(recPlayer2.id);
    expect(mafiaGame2.deadPlayers[0].isAlive).toBe(false);

    // no duplicate eliminations
    mafiaGame2.eliminatePlayer(recPlayer2.id);
    expect(mafiaGame2.townPlayers.length).toBe(3);
    expect(mafiaGame2.mafiaPlayers.length).toBe(1);
    expect(mafiaGame2.mafiaPlayers.length).toBe(1);

    
  });
});
