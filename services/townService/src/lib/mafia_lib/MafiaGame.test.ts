import { nanoid } from 'nanoid';
import MafiaGame, { Phase } from './MafiaGame';
import Player from '../../types/Player';


describe('MafiaGame', () => {
  const recPlayer1 = new Player(nanoid());
  const recPlayer2 = new Player(nanoid());
  const recPlayer3 = new Player(nanoid());
  const recPlayer4 = new Player(nanoid());
  const newMafiaGame = new MafiaGame(recPlayer1); 
  newMafiaGame.addPlayer(recPlayer2);
  newMafiaGame.addPlayer(recPlayer3);
  newMafiaGame.addPlayer(recPlayer4);

  // TODO: We might want to mock this instead.
  /** console.log(`RecPlayer1 username: ${recPlayer1.userName}`);
  console.log(`RecPlayer1 ID: ${recPlayer1.id}`);
  console.log(`RecPlayer2 username: ${recPlayer2.userName}`);
  console.log(`RecPlayer2 ID: ${recPlayer2.id}`);
  console.log(`RecPlayer3 username: ${recPlayer3.userName}`);
  console.log(`RecPlayer3 ID: ${recPlayer3.id}`);
  console.log(`RecPlayer3 username: ${recPlayer3.userName}`);
  console.log(`RecPlayer3 ID: ${recPlayer3.id}`); */
  
  it('Partitions player list and randomly assigns roles correctly', () => {
    newMafiaGame.gameStart();

    
    expect(newMafiaGame.minPlayers).toBe(4);
    expect(newMafiaGame.townPlayers.length).toBe(3);
    expect(newMafiaGame.mafiaPlayers.length).toBe(1);

  });
  it('Adds players that have been voted out from the game to the deadPlayers list', () => {
    newMafiaGame.eliminatePlayer(recPlayer2.id);
    // console.log(`townplayers: ${JSON.stringify(newMafiaGame.townPlayers)}`);
    // console.log(`mafiaPlayers: ${JSON.stringify(newMafiaGame.mafiaPlayers)}`);

    expect(newMafiaGame.townPlayers.length).toBe(3);
    expect(newMafiaGame.mafiaPlayers.length).toBe(1);
    expect(newMafiaGame.deadPlayers.length).toBe(1);
    expect(newMafiaGame.deadPlayers[0]).toBeDefined(); 
    expect(newMafiaGame.deadPlayers[0].playerUserName).toBe(recPlayer2.userName); 
    expect(newMafiaGame.deadPlayers[0].playerID).toBe(recPlayer2.id);
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

  it('Cycles through the phases after the game has started', () => {
    expect(newMafiaGame.phase).toBe(Phase[Phase.day_discussion]);
    newMafiaGame.updatePhase();
    expect(newMafiaGame.phase).toBe(Phase[Phase.day_voting]);
    newMafiaGame.updatePhase();
    expect(newMafiaGame.phase).toBe(Phase[Phase.night]);
    newMafiaGame.updatePhase();
    expect(newMafiaGame.phase).toBe(Phase[Phase.day_discussion]);
  });
  it('Throws error if game phase is updated before or after the game', () => {
    
    newMafiaGame.changePhase = Phase.win;
    expect(() => newMafiaGame.updatePhase()).toThrow(`Game is currently in phase: ${Phase[Phase.win]}`);
    newMafiaGame.changePhase = Phase.lobby;
    expect(() => newMafiaGame.updatePhase()).toThrow(`Game is currently in phase: ${Phase[Phase.lobby]}`);
    
  });
});