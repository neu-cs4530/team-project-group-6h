import { ServerConversationArea, ServerRecreationArea } from '../client/TownsServiceClient';
import { ChatMessage } from '../CoveyTypes';
import GamePlayer from '../lib/mafia_lib/GamePlayer';
import MafiaGame from '../lib/mafia_lib/MafiaGame';
import Player from './Player';

/**
 * A listener for player-related events in each town
 */
export default interface CoveyTownListener {
  /**
   * Called when a player joins a town
   * @param newPlayer the new player
   */
  onPlayerJoined(newPlayer: Player): void;

  /**
   * Called when a player's location changes
   * @param movedPlayer the player that moved
   */
  onPlayerMoved(movedPlayer: Player): void;

  /**
   * Called when a player disconnects from the town
   * @param removedPlayer the player that disconnected
   */
  onPlayerDisconnected(removedPlayer: Player): void;

  /**
   * Called when a town is destroyed, causing all players to disconnect
   */
  onTownDestroyed(): void;

  /**
   * Called when a conversation area is created or updated
   * @param conversationArea the conversation area that is updated or created
   */
  onConversationAreaUpdated(conversationArea: ServerConversationArea) : void;

  /**
   * Called when a recreation area is created or updated
   * @param recreationArea the recreation area that is created or updated
   */
  onRecreationAreaUpdated(recreationArea: ServerRecreationArea) : void; 

  /**
   * Called when a conversation area is destroyed
   * @param conversationArea the conversation area that has been destroyed
   */
  onConversationAreaDestroyed(conversationArea: ServerConversationArea): void;

  /**
   * Called when a recreation area is destroyed
   * @param recreationArea the recreation area that has been destroyed
   */
  onRecreationAreaDestroyed(recreationArea: ServerRecreationArea): void;

  /**
   * Called when a new mafia game lobby is created
   * @param recreationArea Rec area where the game is created
   * @param hostID The host of the game 
   */
  onLobbyCreated(recreationArea: ServerRecreationArea, hostID: string, mafiaGameID: string): void;

  /**
   * Called when a player joins a mafia game
   * @param recreationAreaLabel Rec area containing the game
   * @param playerID Player joining the game 
   */
  onPlayerJoinedGame(recreationAreaLabel: string, playerID: string): void;


  /**
   * Called when a mafia game is started
   * @param playerRoles Roles assigned to players in the game
   */
  onMafiaGameStarted(recAreaLabel: string, playerRoles: GamePlayer[]): void;

  /**
   * Called when a chat message is received from a user
   * @param message the new chat message
   */
  onChatMessage(message: ChatMessage): void;
}
