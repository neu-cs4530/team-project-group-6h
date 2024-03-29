import { customAlphabet, nanoid } from 'nanoid';
import {
  BoundingBox,
  ServerArea,
  ServerConversationArea,
  ServerRecreationArea,
} from '../client/TownsServiceClient';
import { ChatMessage, UserLocation } from '../CoveyTypes';
import CoveyTownListener from '../types/CoveyTownListener';
import Player from '../types/Player';
import PlayerSession from '../types/PlayerSession';
import IVideoClient from './IVideoClient';
import { ServerGamePlayer } from './mafia_lib/GamePlayer';
import MafiaGame, { Phase } from './mafia_lib/MafiaGame';
import TwilioVideo from './TwilioVideo';

const friendlyNanoID = customAlphabet('1234567890ABCDEF', 8);

/**
 * The CoveyTownController implements the logic for each town: managing the various events that
 * can occur (e.g. joining a town, moving, leaving a town)
 */
export default class CoveyTownController {
  get capacity(): number {
    return this._capacity;
  }

  set isPubliclyListed(value: boolean) {
    this._isPubliclyListed = value;
  }

  get isPubliclyListed(): boolean {
    return this._isPubliclyListed;
  }

  get townUpdatePassword(): string {
    return this._townUpdatePassword;
  }

  get players(): Player[] {
    return this._players;
  }

  get occupancy(): number {
    return this._listeners.length;
  }

  get friendlyName(): string {
    return this._friendlyName;
  }

  set friendlyName(value: string) {
    this._friendlyName = value;
  }

  get coveyTownID(): string {
    return this._coveyTownID;
  }

  get conversationAreas(): ServerArea[] {
    return this._conversationAreas;
  }

  get recreationAreas(): ServerRecreationArea[] {
    return this._recreationAreas;
  }

  get mafiaGames(): MafiaGame[] {
    return this._mafiaGames;
  }

  /** The list of players currently in the town * */
  private _players: Player[] = [];

  /** The list of valid sessions for this town * */
  private _sessions: PlayerSession[] = [];

  /** The videoClient that this CoveyTown will use to provision video resources * */
  private _videoClient: IVideoClient = TwilioVideo.getInstance();

  /** The list of CoveyTownListeners that are subscribed to events in this town * */
  private _listeners: CoveyTownListener[] = [];

  /** The list of currently active ConversationAreas in this town */
  private _conversationAreas: ServerArea[] = [];

  /** The list of currently active ServerRecreationAreas in this 
   town */
  private _recreationAreas: ServerRecreationArea[] = [];

  /** The list of active mafia games in the town
   */
  private _mafiaGames: MafiaGame[] = [];

  private readonly _coveyTownID: string;

  private _friendlyName: string;

  private readonly _townUpdatePassword: string;

  private _isPubliclyListed: boolean;

  private _capacity: number;

  constructor(friendlyName: string, isPubliclyListed: boolean) {
    this._coveyTownID = process.env.DEMO_TOWN_ID === friendlyName ? friendlyName : friendlyNanoID();
    this._capacity = 50;
    this._townUpdatePassword = nanoid(24);
    this._isPubliclyListed = isPubliclyListed;
    this._friendlyName = friendlyName;
  }

  /**
   * Adds a player to this Covey Town, provisioning the necessary credentials for the
   * player, and returning them
   *
   * @param newPlayer The new player to add to the town
   */
  async addPlayer(newPlayer: Player): Promise<PlayerSession> {
    const theSession = new PlayerSession(newPlayer);

    this._sessions.push(theSession);
    this._players.push(newPlayer);

    // Create a video token for this user to join this town
    theSession.videoToken = await this._videoClient.getTokenForTown(
      this._coveyTownID,
      newPlayer.id,
    );

    // Notify other players that this player has joined
    this._listeners.forEach(listener => listener.onPlayerJoined(newPlayer));

    return theSession;
  }

  /**
   * Destroys all data related to a player in this town.
   *
   * @param session PlayerSession to destroy
   */
  destroySession(session: PlayerSession): void {
    this._players = this._players.filter(p => p.id !== session.player.id);
    this._sessions = this._sessions.filter(s => s.sessionToken !== session.sessionToken);
    this._listeners.forEach(listener => listener.onPlayerDisconnected(session.player));
    const conversation = session.player.activeConversationArea;
    if (conversation) {
      this.removePlayerFromConversationArea(session.player, conversation);
    }
  }

  /**
   * Updates the location of a player within the town
   *
   * If the player has changed conversation areas, this method also updates the
   * corresponding ConversationArea objects tracked by the town controller, and dispatches
   * any onConversationUpdated events as appropriate
   *
   * @param player Player to update location for
   * @param location New location for this player
   */
  updatePlayerLocation(player: Player, location: UserLocation): void {
    const conversation = this.conversationAreas.find(
      conv => conv.label === location.conversationLabel,
    );
    const prevConversation = player.activeConversationArea;

    player.location = location;
    player.activeConversationArea = conversation;

    if (conversation !== prevConversation) {
      if (prevConversation) {
        this.removePlayerFromConversationArea(player, prevConversation);
      }
      if (conversation) {
        conversation.occupantsByID.push(player.id);
        const recreation = this.recreationAreas.find(
          rec => rec.label === location.conversationLabel,
        );
        if (recreation) {
          this._listeners.forEach(listener => listener.onRecreationAreaUpdated(recreation));
        } else {
          this._listeners.forEach(listener => listener.onConversationAreaUpdated(conversation));
        }
      }
    }

    this._listeners.forEach(listener => listener.onPlayerMoved(player));
  }

  /**
   * Removes a player from a conversation area, updating the conversation area's occupants list,
   * and emitting the appropriate message (area updated or area destroyed)
   *
   * Does not update the player's activeConversationArea property.
   *
   * @param player Player to remove from conversation area
   * @param conversation Conversation area to remove player from
   */
  removePlayerFromConversationArea(player: Player, conversation: ServerArea): void {
    const recArea = this._recreationAreas.find(rec => rec.label === conversation.label);
    conversation.occupantsByID.splice(
      conversation.occupantsByID.findIndex(p => p === player.id),
      1,
    );
    if (conversation.occupantsByID.length === 0) {
      this._conversationAreas.splice(
        this._conversationAreas.findIndex(conv => conv === conversation),
        1,
      );
      if (recArea) {
        this._recreationAreas.splice(
          this._recreationAreas.findIndex(rec => rec === conversation),
          1,
        );
        this._listeners.forEach(listener => listener.onRecreationAreaDestroyed(recArea));
        this._mafiaGames.splice(this.mafiaGames.findIndex(p => p.id === recArea._mafiaGameID));
      } else {
        this._listeners.forEach(listener => listener.onConversationAreaDestroyed(conversation));
      }
    } else if (recArea) {
      if (recArea._mafiaGameID) this.mafiaGamePlayerDisconnect(player, recArea._mafiaGameID);
      this._listeners.forEach(listener => listener.onRecreationAreaUpdated(recArea));
    } else {
      this._listeners.forEach(listener => listener.onConversationAreaUpdated(conversation));
    }
  }

  /**
   * Determines if the given conversation area is valid for this town
   *  - Must be no existing areas with same label
   *  - Topic must be defined
   *  - Must not overlap with existing conversation areas
   * @param _conversationArea
   * @returns
   */
  private isValidArea(_conversationArea: ServerConversationArea): boolean {
    if (
      this._conversationAreas.find(
        eachExistingConversation => eachExistingConversation.label === _conversationArea.label,
      )
    )
      return false;
    if (_conversationArea.topic === '') {
      return false;
    }
    if (
      this._conversationAreas.find(eachExistingConversation =>
        CoveyTownController.boxesOverlap(
          eachExistingConversation.boundingBox,
          _conversationArea.boundingBox,
        ),
      ) !== undefined
    ) {
      return false;
    }

    return true;
  }

  /**
   * Creates a new conversation area in this town if there is not currently an active
   * conversation with the same label.
   *
   * Adds any players who are in the region defined by the conversation area to it.
   *
   * Notifies any CoveyTownListeners that the conversation has been updated
   *
   * @param _conversationArea Information describing the conversation area to create. Ignores any
   *  occupantsById that are set on the conversation area that is passed to this method.
   *
   * @returns true if the conversation is successfully created, or false if not
   */
  addConversationArea(_conversationArea: ServerConversationArea): boolean {
    // Ensure the conversation area is valid
    if (!this.isValidArea(_conversationArea)) {
      return false;
    }

    const newArea: ServerConversationArea = Object.assign(_conversationArea);

    this._conversationAreas.push(newArea);
    const playersInThisConversation = this.players.filter(player => player.isWithin(newArea));
    playersInThisConversation.forEach(player => {
      player.activeConversationArea = newArea;
    });
    newArea.occupantsByID = playersInThisConversation.map(player => player.id);
    this._listeners.forEach(listener => listener.onConversationAreaUpdated(newArea));
    return true;
  }

  /**
   * Creates a new recreation area in this town if there is not currently an active
   * conversation with the same label.
   *
   * Adds any players who are in the region defined by the recreation area to it.
   *
   * Notifies any CoveyTownListeners that the recreation has been updated
   *
   * @param _recreationArea Information describing the recreation area to create. Ignores any
   *  occupantsById that are set on the recreation area that is passed to this method.
   *
   * @returns true if the recreation is successfully created, or false if not
   */
  addRecreationArea(_recreationArea: ServerConversationArea): boolean {
    // Ensure the conversation area is valid
    if (!this.isValidArea(_recreationArea)) {
      return false;
    }

    const newArea: ServerRecreationArea = Object.assign(_recreationArea);

    this._conversationAreas.push(newArea);
    this._recreationAreas.push(newArea);
    const playersInThisConversation = this.players.filter(player => player.isWithin(newArea));
    playersInThisConversation.forEach(player => {
      player.activeConversationArea = newArea;
    });
    newArea.occupantsByID = playersInThisConversation.map(player => player.id);
    this._listeners.forEach(listener => listener.onRecreationAreaUpdated(newArea));
    return true;
  }

  /**
   * Creates a new instance of a mafia game with the given host in the specified rec area
   * @param recAreaLabel Rec area in which the game occurs
   * @param hostID The host of the game
   * @returns Whether or not the game was created
   */
  createMafiaGameLobby(recAreaLabel: string, hostID: string): boolean {
    // Ensure the specified area exists and doesn't have a game
    const areaToAddGame = this.recreationAreas.find(area => area.label === recAreaLabel);
    if (areaToAddGame) {
      if (areaToAddGame._mafiaGameID) {
        return false;
      }
    } else {
      return false;
    }

    // Ensure host is in the area
    const host = areaToAddGame.occupantsByID.find(id => id === hostID);
    const hostPlayer = this._players.find(player => player.id === hostID);
    if (!host || !hostPlayer) {
      return false;
    }

    // Create game
    const newGame = new MafiaGame(hostPlayer);
    areaToAddGame._mafiaGameID = newGame.id;
    this._mafiaGames.push(newGame);

    // Notify listeners
    this._listeners.forEach(listener => listener.onLobbyCreated(areaToAddGame, hostID, newGame.id));
    return true;
  }

  /**
   * Adds the player to the rec area's mafia game instance
   * @param recAreaLabel The recreation area with the mafia game
   * @param playerID The player to be added to the game
   * @returns Whether or not the player was added to the game
   */
  joinMafiaGameLobby(recAreaLabel: string, playerID: string): boolean {
    // Ensure the recreation area exists and has a mafia game in lobby phase
    const recArea = this._recreationAreas.find(rec => rec.label === recAreaLabel);
    if (!recArea) {
      return false;
    }

    const mafiaGame = this._mafiaGames.find(g => g.id === recArea._mafiaGameID);
    if (!mafiaGame || !(mafiaGame?.phase === 'lobby' || mafiaGame?.phase === 'win')) {
      return false;
    }

    // Ensure the player is valid and in the recreation area and not in any games
    const player = this._players.find(p => p.id === playerID);
    if (!player) {
      return false;
    }
    if (!recArea.occupantsByID.includes(playerID)) {
      return false;
    }

    // Add the player to the game
    if (mafiaGame.addPlayer(player)) {
      // Notify listeners that player was added to game
      this._listeners.forEach(listener => listener.onPlayerJoinedGame(recAreaLabel, playerID));
      return true;
    }
    return false;
  }

  /**
   * Removes the player from the rec area's mafia game instance
   * @param recAreaLabel The recreation area with the mafia game
   * @param playerID The player to be removed to the game
   * @returns Whether or not the player was removed to the game
   */
  leaveMafiaGameLobby(recAreaLabel: string, playerID: string): boolean {
    // Assert rec area has a game in lobby or win phase
    const recArea = this._recreationAreas.find(rec => rec.label === recAreaLabel);
    if (!recArea) {
      return false;
    }

    const mafiaGame = this._mafiaGames.find(g => g.id === recArea._mafiaGameID);
    if (!mafiaGame || !(mafiaGame?.phase === 'lobby' || mafiaGame?.phase === 'win')) {
      return false;
    }

    // Ensure the player is valid and in the recreation area and not in any games?
    const player = this._players.find(p => p.id === playerID);
    if (!player) {
      return false;
    }
    if (!recArea.occupantsByID.includes(playerID)) {
      return false;
    }

    // Remove player from game
    mafiaGame.removePlayer(player);
    this._listeners.forEach(listener => listener.onPlayerLeftGame(recAreaLabel, playerID));

    return true;
  }

  destroyMafiaGameLobby(recAreaLabel: string): boolean {
    // Ensure the recreation area exists and has a mafia game in lobby phase
    const recArea = this._recreationAreas.find(rec => rec.label === recAreaLabel);
    if (recArea) {
      const mafiaGame = this._mafiaGames.find(g => g.id === recArea._mafiaGameID);
      if (mafiaGame) {
        recArea._mafiaGameID = undefined;
        this._listeners.forEach(listener => listener.onLobbyDestroyed(recAreaLabel));
        return true;
      }
    }
    return false;
  }

  /**
   * Starts the mafia game in the given recreation area
   * @param recAreaLabel Recreation area containing the game to start
   * @param playerStartID The player requesting to start the game
   * @returns Whether or not the game was started
   */
  startMafiaGame(recAreaLabel: string, playerStartID: string): boolean {
    // Ensure recArea has a game in lobby phase
    const recArea = this._recreationAreas.find(rec => rec.label === recAreaLabel);
    const gameID = recArea?._mafiaGameID;
    const mafiaGame = this._mafiaGames.find(game => game.id === gameID);
    if (!mafiaGame || !mafiaGame.canStart()) {
      return false;
    }
    /*
    if (!gameID || !mafiaGame || !(mafiaGame.phase === 'lobby' || mafiaGame.phase === 'win')) {
      return false;
    }
    */

    // Ensure the given player is the host of the game lobby
    const player = this.players.find(p => p.id === playerStartID);
    if (
      !player ||
      !player.activeConversationArea ||
      player.activeConversationArea.label !== recAreaLabel ||
      player !== mafiaGame.host
    ) {
      return false;
    }

    // Start game
    mafiaGame.gameStart();

    const serverGamePlayers: ServerGamePlayer[] = [];
    mafiaGame.gamePlayers.forEach(gp => {
      serverGamePlayers.push(gp.toServerGamePlayer());
    });
    this._listeners.forEach(listener =>
      listener.onMafiaGameStarted(recAreaLabel, serverGamePlayers),
    );
    return true;
  }

  /**
   * Advances the given mafia game to the next phase
   * @param mafiaGameID
   */
  nextGamePhase(mafiaGameID: string): boolean {
    // Ensure the game exists and is not in the lobby phase
    const mafiaGame = this._mafiaGames.find(game => game.id === mafiaGameID);
    if (!mafiaGame || mafiaGame.phase === 'lobby') {
      return false;
    }

    // Update phase
    try {
      if (mafiaGame.phase === Phase[Phase.day_voting]) {
        mafiaGame.endDay();
      }
      if (mafiaGame.phase === Phase[Phase.night]) {
        mafiaGame.endNight();
      }
      mafiaGame.updatePhase();

      this._listeners.forEach(listener =>
        listener.onMafiaGameUpdated(
          mafiaGameID,
          mafiaGame.phase,
          mafiaGame.gamePlayers.map(p => p.toServerGamePlayer()),
        ),
      );
      mafiaGame.resetFields();
    } catch (err) {
      return false;
    }
    return true;
  }

  sendVote(mafiaGameID: string, voterID: string, votedID: string): boolean {
    const mafiaGame = this._mafiaGames.find(game => game.id === mafiaGameID);
    if (!mafiaGame) {
      return false;
    }
    const alivePlayers = mafiaGame.alivePlayers.map(p => p.id);
    if (!alivePlayers.includes(voterID) || !alivePlayers.includes(votedID)) {
      return false;
    }
    mafiaGame.votePlayer(voterID, votedID);
    this._listeners.forEach(listener => listener.onPlayerVoted(mafiaGameID, voterID, votedID));
    return true;
  }

  /**
   * Sets the player's night target to the given target
   * @param mafiaGameID The game
   * @param playerID Player choosing a target
   * @param targetID The target the player chose
   * @returns Whehter or not the target was successfuly set
   */
  setNightTarget(mafiaGameID: string, playerID: string, targetID: string): boolean {
    // Ensure game exists and is in night phase
    const mafiaGame = this._mafiaGames.find(g => g.id === mafiaGameID);
    if (!mafiaGame || mafiaGame.phase !== Phase[Phase.night]) {
      return false;
    }

    // Ensure players are both in the game and alive
    const player = mafiaGame.alivePlayers.find(p => p.id === playerID);
    const target = mafiaGame.alivePlayers.find(p => p.id === targetID);

    if (!player || !target) {
      return false;
    }

    player.targetPlayer = targetID;
    return true;
  }

  /**
   * Handles a player disconnecting from a mafia game
   *  - Eliminates player from game (treating them as dead)
   *  - Removes player from games list of players (so they aren't added again if new game is started)
   * @param player
   * @param mafiaGameID
   */
  mafiaGamePlayerDisconnect(player: Player, mafiaGameID: string): void {
    const mafiaGame = this.mafiaGames.find(game => game.id === mafiaGameID);
    mafiaGame?.eliminatePlayer(player.id);
    mafiaGame?.removePlayer(player);
  }

  /**
   * Detects whether two bounding boxes overlap and share any points
   *
   * @param box1
   * @param box2
   * @returns true if the boxes overlap, otherwise false
   */
  static boxesOverlap(box1: BoundingBox, box2: BoundingBox): boolean {
    // Helper function to extract the top left (x1,y1) and bottom right corner (x2,y2) of each bounding box
    const toRectPoints = (box: BoundingBox) => ({
      x1: box.x - box.width / 2,
      x2: box.x + box.width / 2,
      y1: box.y - box.height / 2,
      y2: box.y + box.height / 2,
    });
    const rect1 = toRectPoints(box1);
    const rect2 = toRectPoints(box2);
    const noOverlap =
      rect1.x1 >= rect2.x2 || rect2.x1 >= rect1.x2 || rect1.y1 >= rect2.y2 || rect2.y1 >= rect1.y2;
    return !noOverlap;
  }

  /**
   * Subscribe to events from this town. Callers should make sure to
   * unsubscribe when they no longer want those events by calling removeTownListener
   *
   * @param listener New listener
   */
  addTownListener(listener: CoveyTownListener): void {
    this._listeners.push(listener);
  }

  /**
   * Unsubscribe from events in this town.
   *
   * @param listener The listener to unsubscribe, must be a listener that was registered
   * with addTownListener, or otherwise will be a no-op
   */
  removeTownListener(listener: CoveyTownListener): void {
    this._listeners = this._listeners.filter(v => v !== listener);
  }

  onChatMessage(message: ChatMessage): void {
    this._listeners.forEach(listener => listener.onChatMessage(message));
  }

  /**
   * Fetch a player's session based on the provided session token. Returns undefined if the
   * session token is not valid.
   *
   * @param token
   */
  getSessionByToken(token: string): PlayerSession | undefined {
    return this._sessions.find(p => p.sessionToken === token);
  }

  disconnectAllPlayers(): void {
    this._listeners.forEach(listener => listener.onTownDestroyed());
  }
}
