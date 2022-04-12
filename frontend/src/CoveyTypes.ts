import { Socket } from 'socket.io-client';
import { UserLocation } from './classes/Player';
import TownsServiceClient from './classes/TownsServiceClient';

export type CoveyEvent = 'playerMoved' | 'playerAdded' | 'playerRemoved';

export type VideoRoom = {
  twilioID: string,
  id: string
};
export type UserProfile = {
  displayName: string,
  id: string
};
export type CoveyAppState = {
  sessionToken: string,
  userName: string,
  currentTownFriendlyName: string,
  currentTownID: string,
  currentTownIsPubliclyListed: boolean,
  myPlayerID: string,
  emitMovement: (location: UserLocation) => void,
  socket: Socket | null,
  apiClient: TownsServiceClient
};

export type MafiaGameState = {
  gameName: string,
  gameNumDays: number,
  gamePhase: string,
  gameTimeLeft: number,
  playerIDs: string[],
  playerRoles: Map<string, string>, // maps player IDs to their roles
  playerIsAlive: Map<string, boolean>,
  playerVotes: Map<string, string | undefined>, // maps player id to the id of player they voted for
}
