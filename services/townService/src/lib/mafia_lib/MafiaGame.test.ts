import { nanoid } from 'nanoid';
import Player from '../../types/Player';
import { Role, Team } from './GamePlayer';
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
  it('Eliminates most voted player at end of day/night cycle', () => {
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

    // Tie condition (Team here doesn't matter, just want to make sure tie condition = no one eliminated)
    mafiaGame2.updatePhase();
    mafiaGame2.votePlayer(recPlayer1.id, recPlayer3.id);
    mafiaGame2.votePlayer(recPlayer3.id, recPlayer4.id);
    mafiaGame2.votePlayer(recPlayer4.id, recPlayer1.id);

    mafiaGame2.endNight();
    expect(mafiaGame2.deadPlayers.length).toBe(1);



    
  });
  it('Performs target abilities correctly - Doctor', () => {
    const mafiaGame2 = new MafiaGame(recPlayer1);
    mafiaGame2.addPlayer(recPlayer2);
    mafiaGame2.addPlayer(recPlayer3);
    mafiaGame2.addPlayer(recPlayer4);

    mafiaGame2.gameStart();
    expect(mafiaGame2.phase).toBe(Phase[Phase.day_discussion]);
    mafiaGame2.updatePhase();
    expect(mafiaGame2.phase).toBe(Phase[Phase.day_voting]);
    mafiaGame2.updatePhase();
    expect(mafiaGame2.phase).toBe(Phase[Phase.night]);

    const doctor = mafiaGame2.gamePlayers.find((p) => p.role === Role.Doctor);
    const godfather = mafiaGame2.gamePlayers.find((p) => p.role === Role.Godfather);
    const detective = mafiaGame2.gamePlayers.find((p) => p.role === Role.Detective);
    const hypnotist = mafiaGame2.gamePlayers.find((p) => p.role === Role.Hypnotist);

    expect(doctor).toBeDefined();
    expect(godfather).toBeDefined();
    expect(detective).toBeDefined();
    expect(hypnotist).toBeDefined();

    if (doctor && godfather && detective && hypnotist) {
      mafiaGame2.setTarget(doctor.id, detective.id);
      mafiaGame2.setTarget(godfather.id, detective.id);

      mafiaGame2.endNight();
      expect(mafiaGame2.deadPlayers.length).toBe(0);
      mafiaGame2.gamePlayers.forEach((p) => 
        expect(p.result).toBe(`${detective?.userName} was TARGETED by the mafia, but was saved! `),
      );

      mafiaGame2.setTarget(hypnotist.id, godfather.id);
      mafiaGame2.setTarget(godfather.id, detective.id);

    }
    
  });
  it('Performs target abilities correctly - Hypnotist', () => {
    const mafiaGame2 = new MafiaGame(recPlayer1);
    mafiaGame2.addPlayer(recPlayer2);
    mafiaGame2.addPlayer(recPlayer3);
    mafiaGame2.addPlayer(recPlayer4);

    mafiaGame2.gameStart();
    expect(mafiaGame2.phase).toBe(Phase[Phase.day_discussion]);
    mafiaGame2.updatePhase();
    expect(mafiaGame2.phase).toBe(Phase[Phase.day_voting]);
    mafiaGame2.updatePhase();
    expect(mafiaGame2.phase).toBe(Phase[Phase.night]);

    const doctor = mafiaGame2.gamePlayers.find((p) => p.role === Role.Doctor);
    const godfather = mafiaGame2.gamePlayers.find((p) => p.role === Role.Godfather);
    const detective = mafiaGame2.gamePlayers.find((p) => p.role === Role.Detective);
    const hypnotist = mafiaGame2.gamePlayers.find((p) => p.role === Role.Hypnotist);

    expect(doctor).toBeDefined();
    expect(godfather).toBeDefined();
    expect(detective).toBeDefined();
    expect(hypnotist).toBeDefined();

    if (doctor && godfather && detective && hypnotist) {
      mafiaGame2.setTarget(hypnotist.id, godfather.id);
      mafiaGame2.setTarget(godfather.id, detective.id);

      mafiaGame2.endNight();
      expect(mafiaGame2.deadPlayers.length).toBe(0);

      mafiaGame2.gamePlayers.forEach((p) => {
        if (p.role === Role.Hypnotist) {
          expect(p.result).toBe(`${godfather.userName} was hypnotised. No one was targeted overnight. `);
        }
        if (p.role === Role.Godfather) {
          expect(p.result).toBe('YOU were ROLEBLOCKED by a hypnotist. No one was targeted overnight. ');
        }
      });

      

    }
    
  });
  it('Performs target abilities correctly - Detective / Godfather', () => {
    const mafiaGame2 = new MafiaGame(recPlayer1);
    mafiaGame2.addPlayer(recPlayer2);
    mafiaGame2.addPlayer(recPlayer3);
    mafiaGame2.addPlayer(recPlayer4);

    mafiaGame2.gameStart();
    expect(mafiaGame2.phase).toBe(Phase[Phase.day_discussion]);
    mafiaGame2.updatePhase();
    expect(mafiaGame2.phase).toBe(Phase[Phase.day_voting]);
    mafiaGame2.updatePhase();
    expect(mafiaGame2.phase).toBe(Phase[Phase.night]);

    const doctor = mafiaGame2.gamePlayers.find((p) => p.role === Role.Doctor);
    const godfather = mafiaGame2.gamePlayers.find((p) => p.role === Role.Godfather);
    const detective = mafiaGame2.gamePlayers.find((p) => p.role === Role.Detective);
    const hypnotist = mafiaGame2.gamePlayers.find((p) => p.role === Role.Hypnotist);

    expect(doctor).toBeDefined();
    expect(godfather).toBeDefined();
    expect(detective).toBeDefined();
    expect(hypnotist).toBeDefined();

    if (doctor && godfather && detective && hypnotist) {
      mafiaGame2.setTarget(detective.id, hypnotist.id);
      mafiaGame2.setTarget(godfather.id, detective.id);

      mafiaGame2.endNight();
      expect(mafiaGame2.deadPlayers.length).toBe(1);

      mafiaGame2.gamePlayers.forEach((p) => {
        if (p.role === Role.Detective) {
          expect(p.result).toBe(`${hypnotist.userName} is a 
          ${Role[Role.Hypnotist]} on team ${Team[Team.Town]}. YOU were KILLED by the mafia! You can no longer vote or use your ability. `);
        } else {
          expect(p.result).toBe(`${detective.userName} was KILLED by the mafia! `);
        }
      });

      

    }
    
  });
});
