import { nanoid } from 'nanoid';
import Player from '../../types/Player';
import GamePlayer, { Role, Team } from './GamePlayer';

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

  private _host: Player; // the id of the host

  private _gamePlayers: GamePlayer[]; // all players in the mafia game

  private _phase = Phase.lobby;

  private _winner = Team.Unassigned;

  // Equal to the number of roles we currently have.
  // Currently, should be 4 (minus the Unassigned Role)
  private MIN_PLAYERS: number = Object.keys(Role).length / 2 - 1;

  constructor(host: Player) {
    this._id = nanoid();
    this._host = host;
    this._players = [host];
    this._gamePlayers = [];
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

  get minPlayers(): number {
    return this.MIN_PLAYERS;
  }

  get id(): string {
    return this._id;
  }

  get host(): Player {
    return this._host;
  }

  get gamePlayers(): GamePlayer[] {
    return this._gamePlayers;
  }

  /**
   * Gets the role of the given player.
   * @param playerID The player that we want to find the role of
   * @returns The role of the given player, or undefined if this player does not exist
   */
  public playerRole(playerID: string): Role | undefined {
    const gamePlayer = this._gamePlayers.find(player => player.id === playerID);

    if (gamePlayer) {
      return gamePlayer.role;
    }

    return undefined;
  }

  /**
   * Return the number of players currently in the game (for lobby logic).
   */
  private numPlayers(): number {
    return this._players.length;
  }

  /**
   * Returns all of the eliminated players to render in the UI.
   */
  get deadPlayers(): GamePlayer[] {
    return [...this._gamePlayers].filter(player => player.isAlive === false);
  }

  /**
   * Returns all players still alive within the game.
   */
  get alivePlayers(): GamePlayer[] {
    return [...this._gamePlayers].filter(player => player.isAlive === true);
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

  private getPlayerWithMostVotes(): GamePlayer | undefined {
    let mostVoted;
    let mostVotes = 0;
    this._gamePlayers.forEach(p => {
      if (p.voteTally > mostVotes) {
        mostVoted = p;
        mostVotes = p.voteTally;
      } else if (p.voteTally === mostVotes) {
        mostVoted = undefined;
      }
    });
    return mostVoted;
  }

  /**
   * Determines who is elimiated at the end of a day voting phase.
   */
  public endDay(): void {
    if (this._phase === Phase.day_voting) {
      // find the player with the most votes, and eliminate them
      const votedPlayer = this.getPlayerWithMostVotes();

      if (votedPlayer) {
        this.eliminatePlayer(votedPlayer.id);
        this._gamePlayers.forEach(player => {
          if (player === votedPlayer) {
            if (!player.result) {
              player.result = 'YOU were voted off! You can no longer vote or use your ability. ';
            } else {
              player.result += 'YOU were voted off! You can no longer vote or use your ability. ';
            }
          } else if (!player.result) {
            player.result = `${votedPlayer.userName} was VOTED OFF, with ${votedPlayer.voteTally} votes! `;
          } else {
            player.result += `${votedPlayer.userName} was VOTED OFF, with ${votedPlayer.voteTally} votes! `;
          }
        });
      } else {
        this._gamePlayers.forEach(player => {
          if (!player.result) {
            player.result = 'Nobody was voted off. ';
          } else {
            player.result += 'Nobody was voted off. ';
          }
        });
      }
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
      player.votedPlayer = undefined; // _currentVote
      player.targetPlayer = undefined; // _target
      player.result = undefined; // _result
      player.resetTally(); // _voteTally
    });
  }

  /**
   * Determines who is eliminated at the end of a night phase.
   * @throws Error if not in the night phase.
   */
  public endNight(): void {
    if (this._phase === Phase.night) {
      // these should all be > 0
      const godfatherIdx = this._gamePlayers.findIndex(p => p.role === Role.Godfather);
      const doctorIdx = this._gamePlayers.findIndex(p => p.role === Role.Doctor);
      const detectiveIdx = this._gamePlayers.findIndex(p => p.role === Role.Detective);
      const hypnotistIdx = this._gamePlayers.findIndex(p => p.role === Role.Hypnotist);
      let healTarget;

      // Doctor heal
      if (doctorIdx >= 0 && this._gamePlayers[doctorIdx].target) {
        healTarget = this._gamePlayers.find(
          player => player.id === this._gamePlayers[doctorIdx].target,
        );
      }

      // Detective Investigate
      if (detectiveIdx >= 0 && this._gamePlayers[detectiveIdx].target) {
        const target = this._gamePlayers.find(
          player => player.id === this._gamePlayers[detectiveIdx].target,
        );
        if (target) {
          this._gamePlayers[detectiveIdx].result = `${target.userName} is a 
          ${Role[target.role]} on team ${Team[target.team]}. `;
        }
      }

      // Hypnotist Role-block
      if (hypnotistIdx >= 0 && this._gamePlayers[hypnotistIdx].target) {
        const roleblocked = 'YOU were ROLEBLOCKED by a hypnotist. ';
        const target = this._gamePlayers.find(
          player => player.id === this._gamePlayers[hypnotistIdx].target,
        );
        if (target) {
          switch (target.role) {
            case Role.Detective:
              this._gamePlayers[detectiveIdx].result = roleblocked;
              break;
            case Role.Doctor:
              healTarget = undefined;
              target.result = roleblocked;
              break;
            case Role.Godfather:
              target.targetPlayer = undefined;
              target.result = roleblocked;
              break;
            default:
              break;
            // Town members don't get to do anything at night, so nothing should happen.
          }

          this._gamePlayers[hypnotistIdx].result = `${target.userName} was hypnotised. `;
        }
      }

      let targetPlayer = this.getPlayerWithMostVotes();
      // Godfather override of mafia vote
      if (godfatherIdx >= 0 && this._gamePlayers[godfatherIdx].target) {
        targetPlayer = this._gamePlayers.find(
          player => player.id === this._gamePlayers[godfatherIdx].target,
        );
      }

      if (targetPlayer) {
        if (healTarget !== targetPlayer) {
          this.eliminatePlayer(targetPlayer.id);
          this._gamePlayers.forEach(player => {
            if (player === targetPlayer) {
              if (!player.result) {
                player.result =
                  'YOU were KILLED by the mafia! You can no longer vote or use your ability. ';
              } else {
                player.result +=
                  'YOU were KILLED by the mafia! You can no longer vote or use your ability. ';
              }
            } else if (!player.result) {
              player.result = `${targetPlayer?.userName} was KILLED by the mafia! `;
            } else {
              player.result += `${targetPlayer?.userName} was KILLED by the mafia! `;
            }
          });
        } else {
          this._gamePlayers.forEach(player => {
            if (!player.result) {
              player.result = `${targetPlayer?.userName} was TARGETTED by the mafia, but was saved! `;
            } else {
              player.result += `${targetPlayer?.userName} was TARGETTED by the mafia, but was saved! `;
            }
          });
        }
      } else {
        this._gamePlayers.forEach(player => {
          if (!player.result) {
            player.result = 'No one was targetted overnight. ';
          } else {
            player.result += 'No one was targetted overnight. ';
          }
        });
      }
    } else {
      throw new Error(`Not in the night phase. Currently in phase ${Phase[this._phase]}.`);
    }
  }

  /**
   * Cycles through the phases of the game after the game has started.
   * @throws Error if the game is either in the 'lobby' or 'win' state.
   */
  public updatePhase(): void {
    if (!this.isGameOver()) {
      switch (this._phase) {
        case Phase.day_discussion:
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
      if (this._winner === Team.Town) {
        this._gamePlayers.forEach(player => {
          if (player.team === Team.Town) {
            player.result = 'You win! All the mafia were eliminated. ';
          } else if (player.team === Team.Mafia) {
            player.result = 'You lose! All the mafia were eliminated. ';
          }
        });
      } else if (this._winner === Team.Mafia) {
        this._gamePlayers.forEach(player => {
          if (player.team === Team.Town) {
            player.result = 'You lose! All the town were eliminated. ';
          } else if (player.team === Team.Mafia) {
            player.result = 'You win! All the town were eliminated. ';
          }
        });
      }
    }
  }

  /**
   * Determines if the game is over if there are no players remaining in either the Mafia or the town team.
   *
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
   * Randomly shuffles the list of players for fair role assignment. Modified answer from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
   * @returns shuffled version of player array
   */
  private shuffle(): Player[] {
    let currentIndex = this.numPlayers();
    let randomIndex = this.numPlayers();

    const playerArray = [...this._players];

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      [playerArray[currentIndex], playerArray[randomIndex]] = [
        playerArray[randomIndex],
        playerArray[currentIndex],
      ];
    }

    return playerArray;
  }

  /**
   * Partitions the player array into MIN_PLAYERS number of roughly equal arrays
   * @param playerList The list of players to partition
   * @returns An array of GamePlayer arrays (from partitioned players list)
   * Modified form of https://stackoverflow.com/questions/8188548/splitting-a-js-array-into-n-arrays
   */
  private partition(playerList: GamePlayer[]): GamePlayer[][] {
    const result: GamePlayer[][] = [];

    // Get 1/MIN_PLAYERS of the list, then 1/(MIN_PLAYERS - 1) of the list...
    // o | o | o | o

    for (let i = this.MIN_PLAYERS; i > 0; i -= 1) {
      result.push(playerList.splice(0, Math.ceil(playerList.length / i)));
    }

    return result;
  }

  /**
   * Eliminates the given player in the game.
   * @param playerName The id of the player to eliminate
   * @throws Error if the playerID does not exist.
   */
  public eliminatePlayer(playerID: string): void {
    const playerIndex = this._gamePlayers.findIndex(player => playerID === player.id);

    if (playerIndex >= 0) {
      const gamePlayer = this._gamePlayers[playerIndex];
      if (gamePlayer.isAlive) {
        this._gamePlayers[playerIndex].eliminate();
      }
    } else {
      throw new Error('This player does not exist');
    }
  }

  /**
   * Randomly assigns the Teams and Roles to the players within the array and adds the players to the mafiaPlayers/townPlayers fields.
   */
  private assignRoles(): void {
    const shuffledPlayers = this.shuffle();

    const gamePlayers = shuffledPlayers.map(player => new GamePlayer(player));

    /** CURRENT LOGIC:
     * 0. Shuffle array (to prevent first-come = mafia)
     * 1. Partition player array into MIN_PLAYERS number of roughly equal parts
     * 2. Assign first array to Mafia, the rest to town.
     * 3. Assign one first person in Mafia array to [GODFATHER]
     * 4. Assign one first person in each of the following arrays to DOCTOR, HYPNOTIST, DETECTIVE
     * 5. Add players of the arrays to gamePlayers.
     * MIN CASE: No players w/ unassigned roles (Every role is filled).
     * Any number > min case will have unassigned, "vanilla" Mafia/Town players.
     */
    const [godfatherList, doctorList, hypnotistList, detectiveList]: GamePlayer[][] =
      this.partition(gamePlayers);

    godfatherList.forEach(mafia => {
      mafia.team = Team.Mafia;
      mafia.role = Role.Unassigned;
    });
    godfatherList[0].role = Role.Godfather;

    doctorList.forEach(town => {
      town.team = Team.Town;
      town.role = Role.Unassigned;
    });
    doctorList[0].role = Role.Doctor;

    hypnotistList.forEach(town => {
      town.team = Team.Town;
      town.role = Role.Unassigned;
    });
    hypnotistList[0].role = Role.Hypnotist;

    detectiveList.forEach(town => {
      town.team = Team.Town;
      town.role = Role.Unassigned;
    });
    detectiveList[0].role = Role.Detective;

    this._gamePlayers = [...godfatherList, ...doctorList, ...hypnotistList, ...detectiveList];
  }

  /**
   * Sets the target of the player to vote out of the game.
   * @param voterID The ID of the player that is voting
   * @param targetID The ID of the player that this player is voting for
   * @throws Error if either voterID or targetID can't be found.
   */
  public votePlayer(voterID: string, targetID: string): void {
    const playerIndex = this._gamePlayers.findIndex(player => player.id === voterID);

    if (playerIndex === -1) {
      throw new Error('Vote failed: Cannot find voter.');
    }

    // give the ID of the person that this player has voted for
    this._gamePlayers[playerIndex].votedPlayer = targetID;

    // increment that player's vote tally
    const targetIndex = this._gamePlayers.findIndex(player => player.id === targetID);
    this._gamePlayers[targetIndex].vote();

    if (targetIndex === -1) {
      throw new Error('Vote failed: Cannot find target.');
    }
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
   * Starts the game by setting the phase to discussion during the day time.
   */
  public gameStart(): void {
    this._phase = Phase.day_discussion;

    // Current Assumption: Min # of Players = Num of Players that can fill all the following roles at least once:
    /** MAFIA SIDE:
     * Godfather
     *
     * TOWN SIDE:
     * Detective
     * Doctor
     * Hypnotist
     * MIN_PLAYERS = 4
     */
    if (this.numPlayers() >= this.MIN_PLAYERS) {
      this.assignRoles();
    }
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
