import { ServerGamePlayer } from '../../../services/townService/src/lib/mafia_lib/GamePlayer';
import GamePlayer, { Role, Team } from './GamePlayer';
import Player from './Player';

/**
 * Represents all the possible phases of a Mafia game.
 */
export enum Phase {
  'lobby',
  'day_discussion',
  'day_voting',
  'night',
  'win',
}

/**
 * Represents type of MafiaGame that can be instantiated by players in a Recreation Room.
 */
export default class MafiaGame {
  private readonly _id: string; // unique identifier

  private _players: Player[]; // players in the game lobby

  private _gamePlayers: GamePlayer[]; // all players in the mafia game

  private _winner = Team.Unassigned; // Team that won the game

  _phase = Phase.lobby; // current phase of the game

  _host: Player; 

  _deadPlayers: GamePlayer[];

  _alivePlayers: GamePlayer[];

  // Equal to the number of roles we currently have.
  // Currently, should be 4 (minus the Unassigned Role)
  private MIN_PLAYERS: number = Object.keys(Role).length / 2 - 1;

  constructor(mafiaGameID: string, host: Player) {
    this._id = mafiaGameID;
    this._host = host;
    this._players = [host];
    this._gamePlayers = [];
    this._deadPlayers = [];
    this._alivePlayers = [];
  }

  set changePhase(phase: Phase) {
    this._phase = phase;
  }

  get phase(): string {
    return Phase[this._phase];
  }

  get winner(): Team {
    return this._winner;
  }

  get minPlayers() {
    return this.MIN_PLAYERS;
  }

  get id() {
    return this._id;
  }

  get host() {
    return this._host;
  }

  get gamePlayers() {
    return this._gamePlayers;
  }

  set gamePlayers(players: GamePlayer[]) {
    this._gamePlayers = players;
  }

  /**
   * Return the number of players currently in the game (for lobby logic).
   */
  private numPlayers(): number {
    return this._players.length;
  }

  /**
   * Return the players in the lobby.
   */
  get players(): Player[] {
    return this._players;
  }

  /**
   * Determines if there is a sufficient number of players to start the game.
   * @returns True if game can start, false if otherwise.
   */
  public canStart(): boolean {
    return this._phase === Phase.lobby && this.MIN_PLAYERS <= this._players.length;
  }

  /**
   * Returns the role of a given player.
   * @param playerID The ID of the player.
   * @returns The player's role, or undefined if the p
   */
  public playerRole(playerID: string): Role | undefined {
    const role = this.gamePlayers.find(gp => gp.id === playerID)?.role;
    return role;
  }

  get alivePlayers(): GamePlayer[] {
    const aliveTown = this.townPlayers.filter(player => !this._deadPlayers.includes(player));
    const aliveMafia = this.mafiaPlayers.filter(player => !this._deadPlayers.includes(player));
    return aliveTown.concat(aliveMafia);
  }

  get deadPlayers(): GamePlayer[] {
    return this._deadPlayers;
  }

  get mafiaPlayers(): GamePlayer[] {
    return [...this._gamePlayers].filter(player => player.team === Team.Mafia);
  }

  get townPlayers(): GamePlayer[] {
    return [...this._gamePlayers].filter(player => player.team === Team.Town);
  }

  /**
   * Adds a player to the game lobby.
   * @param player The playyer to add to the game lobby.
   * @returns Whether or not the player was added
   */
  public addPlayer(player: Player): boolean {
    if (this._phase === Phase.lobby) {
      this._players.push(player);
      return true;
    }
    return false;
  }

  /**
   * Determines who is elimiated at the end of a day voting phase.
   */
  public endDay(): void {
    if (this._phase === Phase.day_voting) {
      // find the player with the most votes, and eliminate them
      const votedPlayer = this._gamePlayers.reduce((prevPlayer, currentPlayer) =>
        prevPlayer.voteTally > currentPlayer.voteTally ? prevPlayer : currentPlayer,
      );

      this.eliminatePlayer(votedPlayer.id);
    } else {
      throw new Error(`Not in day phase. Currently in phase ${Phase[this._phase]}.`);
    }
  }

  /**
   * Resets all the gamePlayer fields.
   * Should be called after rendering result information from the players after endDay() or endNight()
   */
  public resetFields(): void {
    this._gamePlayers.forEach(player => {
      if (player.isAlive) {
        player.votedPlayer = undefined; // _currentVote
        player.targetPlayer = undefined; // _target
        player.result = undefined; // _result
        player.resetTally(); // _voteTally
      }
    });
  }

  /**
   * Determines who is eliminated at the end of a night phase.
   * @throws Error if not in the night phase.
   */
   public endNight(): void {
    if (this._phase === Phase.night) {
      let targetPlayer: GamePlayer | undefined = this._gamePlayers.reduce((prevPlayer, currentPlayer) =>
        prevPlayer.voteTally > currentPlayer.voteTally ? prevPlayer : currentPlayer,
      );

      const godfather = this._gamePlayers.find(player => player.role === Role.Godfather);

      // Godfather override of mafia vote
      let overrideTarget: GamePlayer | undefined = targetPlayer;
      if (godfather?.target && godfather.target !== targetPlayer?.id) {
        overrideTarget = this._gamePlayers.find(player => player.id === godfather?.target);
        targetPlayer = overrideTarget;
      }

      // Doctor heal
      let healTarget: GamePlayer | undefined;
      const doctor = this._gamePlayers.find(player => player.role === Role.Doctor);
      if (doctor?.target === targetPlayer?.id) {
        healTarget = this._gamePlayers.find(player => player === overrideTarget);
        if (healTarget) {
          targetPlayer = healTarget;
        }
      }

      // Detective Investigate
      const detectiveIndex = this._gamePlayers.findIndex(player => player.role === Role.Detective);
      if (detectiveIndex > 0) {
        const targetID = this._gamePlayers[detectiveIndex].target;
        const target = this._gamePlayers.find(player => player.id === targetID);

        if (target) {
          this._gamePlayers[detectiveIndex].result = `${target.userName} is a ${Role[target.role]}.`;
        }
      }

      // Hypnotist
      const hypnotistIndex = this._gamePlayers.findIndex(player => player.role === Role.Hypnotist);
      if (detectiveIndex > 0) {
        const targetID = this._gamePlayers[hypnotistIndex].target;
        const target = this._gamePlayers.find(player => player.id === targetID);

        if (target) {
          switch (target.role) {
            case Role.Detective:
              this._gamePlayers[detectiveIndex].result = undefined;
              break;
            case Role.Doctor:
              targetPlayer = overrideTarget;
              break;
            case Role.Godfather:
              targetPlayer = undefined;
              break;
            default:
              if (target.team === Team.Mafia) {
                targetPlayer = undefined;
              }
            // Town members don't get to do anything at night, so nothing should happen.
          }

          this._gamePlayers[hypnotistIndex].result = `${target.userName} was hypnotised. `;
        }
      }
      if (targetPlayer) {
        this.eliminatePlayer(targetPlayer.id);
      } else {
        this._gamePlayers.forEach(player => {
          if (!player.result) {
            player.result = 'No one was eliminated.';
          } else {
            player.result += 'No one was eliminated.';
          }
        });
      }
    } else {
      throw new Error(`Not in night phase. Currently in phase ${Phase[this._phase]}.`);
    }
  }


  /**
   * Cycles through the phases of the game after the game has started. Enters win state if game is over.
   * @throws Error if the game is either in the 'lobby' state or game is in 'win' state when the game is not over. 
   */
  public updatePhase(): void {
    if (!this.isGameOver()) {
      switch (this._phase) {
        case Phase.day_discussion:
          this.resetFields();
          this._phase = Phase.day_voting;
          break;
        case Phase.day_voting:
          this._phase = Phase.night;
          break;
        case Phase.night:
          this._phase = Phase.day_discussion;
          break;
        default:
          throw Error(`Game is currently in phase: ${Phase[this._phase]}`);
      }
    } else {
      this._phase = Phase.win;
    }
  }

  /**
   * Determines if the game is over if there are no players remaining in either the Mafia or the town team. If game is over, it sets the winner and returns true.
   * @returns False if the game is not over, true if it is over
   */
  private isGameOver(): boolean {
    if (this.mafiaPlayers && this.townPlayers) {
      if (
        this.mafiaPlayers.every(player => !player.isAlive) &&
        !this.townPlayers.every(player => !player.isAlive)
      ) {
        this._winner = Team.Town;
        return true;
      }
      if (
        !this.mafiaPlayers.every(player => !player.isAlive) &&
        this.townPlayers.every(player => !player.isAlive)
      ) {
        this._winner = Team.Mafia;
        return true;
      }
    }

    return false;
  }

  /**
   * Eliminates the given player in the game.
   * @param playerName The id of the player to eliminate
   */
  public eliminatePlayer(playerID: string): void {
    // find the player in either the mafia or town arrays (hopefully no same name situations)
    // const mafiaAndTown: GamePlayer[] = [...this._mafiaPlayers, ...this._townPlayers];

    const playerIndex = this._gamePlayers.findIndex(player => playerID === player.id);
    if (playerIndex >= 0) {
      const gamePlayer = this._gamePlayers[playerIndex];
      if (gamePlayer.isAlive) {
        this._gamePlayers[playerIndex].eliminate();
        this._gamePlayers.forEach(player => {
          if (!player.result) {
            player.result = `${gamePlayer.userName} has been eliminated!`;
          }
        });
        if (this._host.id === gamePlayer.id) {
          const newHost: GamePlayer = this.alivePlayers[0];
          const hostPlayer = this.players.find(player => player.id === newHost.id);
          if (hostPlayer) {
            this._host = hostPlayer;
          }
        }
        this._gamePlayers[playerIndex].result = 'You have been eliminated!';
        this._deadPlayers.push(gamePlayer);
      }
    }
  }

  /**
   * Sets the target of the player to vote out of the game.
   * @param voterID The ID of the player that is voting
   * @param targetID The ID of the player that this player is voting for
   */
   public votePlayer(voterID: string, targetID: string): void {
    const playerIndex = this._gamePlayers.findIndex(player => player.id === voterID);

    // give the ID of the person that this player has voted for
    this._gamePlayers[playerIndex].votedPlayer = targetID;

    // increment that player's vote tally
    const targetIndex = this._gamePlayers.findIndex(player => player.id === targetID);
    this._gamePlayers[targetIndex].vote();
  }

  /**
   * Sets the target of role player to perform role actions.
   * @param roleID The ID of the player performing the role action
   * @param targetID The ID of the player that this player is performing the action on.
   */
  public setTarget(roleID: string, targetID: string): void {
    const playerIndex = this._gamePlayers.findIndex(player => player.id === roleID);

    // give the ID of the person that this player has voted for
    this._gamePlayers[playerIndex].targetPlayer = targetID;
  }

  /**
   * Adds a new GamePlayer to this MafiaGame
   * @param serverGamePlayer: The game player
   * @returns Whether or not the player was successfully added
   */
  private addGamePlayer(serverGamePlayer: ServerGamePlayer): boolean {
    // Check if this player is in the game
    const recPlayer = this.players.find(p => p.id === serverGamePlayer.player);
    if (recPlayer) {
      this.gamePlayers.push(GamePlayer.fromServerGamePlayer(recPlayer, serverGamePlayer));
      return true;
    }
    return false;
  }

  /**
   * Starts the game by setting the phase to discussion during the day time.
   */
  public gameStart(playerRoles: ServerGamePlayer[]): void {
    this._phase = Phase.day_discussion;
    playerRoles.forEach(p => {
      this.addGamePlayer(p);
    });
  }

  /**
   * Updates the list of players in the mafia game when a player leaves. Will end the game if the leaver is the host and the phase is lobby, or if the number of players remaining in the game is less than or equal to two.
   * @param leaver The player who left the mafia game.
   */
  removePlayer(leaver: Player): void {
    this._players = this._players.filter(p => leaver.id !== p.id);

    // if player who left was the host and the phase is currently lobby, end game
    // if game is in progress and there are less than or equal to two players remaining, end the game
    if (
      (leaver === this._host && this._phase === Phase.lobby) ||
      (this._players.length <= 2 && this._phase !== Phase.lobby)
    ) {
      // end the game
      this._phase = Phase.win;
      // empty the player list of this mafia game
      this._players = [];
    }
  }
}
