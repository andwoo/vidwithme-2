import * as Actions from './Actions';
import * as StoreModels from './StoreModels';

export interface StoreModel {
  connection: ConnectionState,
  room: RoomState
}

export interface ConnectionState {
  isConnected: boolean;
  isUserDataSet: boolean;
  user: UserState;
}

export interface UserState {
  userName : string;
}

export interface RoomState {
  id: string;
  chat: Array<ChatMessage>;
  playlist: Array<PlaylistItem>;
  errors: Array<RoomError>;
}

export interface RoomError {
  title: string;
  description: string;
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
  setUserData: (user : StoreModels.UserState) => void;
  createRoom: () => void;
  joinRoom: (id : string) => void;
  getRoomState: () => void;
  sendChatMessage: (message : string) => void;
  receivedChatMessage: (message : StoreModels.ChatMessage) => Actions.ChatMessageAction
}