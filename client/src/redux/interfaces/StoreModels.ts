import * as Actions from './Actions';
import * as StoreModels from './StoreModels';

export interface StoreModel {
  connection: ConnectionState,
  user: UserState,
  room: RoomState
}

export interface ConnectionState {
  isConnected: boolean;
}

export interface UserState {
  userName : string;
}

export interface RoomState {
  id: string;
  chat: Array<ChatMessage>;
  playlist: Array<PlaylistItem>;
}

export interface ChatMessage {
  user : UserState;
  message: string;
}

export interface PlaylistItem {
  url: string;
}

export interface StoreDispatch {
  connectToServer: () => void;
  setUser: (userName: string) => Actions.UserAction;
  createRoom: (user : UserState) => void;
  joinRoom: (user : UserState, id : string) => void;
  sendChatMessage: (message : StoreModels.ChatMessage, id : string) => void;
  receivedChatMessage: (message : StoreModels.ChatMessage) => Actions.ChatMessageAction
}