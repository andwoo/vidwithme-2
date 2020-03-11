import * as Actions from './Actions';
import * as StoreModels from './StoreModels';

export interface StoreModel {
  user: UserState,
  room: RoomState
}

export interface UserState {
  userName : string;
}

export interface RoomState {
  id: string;
  chat: Array<ChatMessage>;
}

export interface ChatMessage {
  user : UserState;
  message: string;
}

export interface StoreDispatch {
  setUser: (userName: string) => Actions.UserAction;
  createRoom: (user : UserState) => void;
  joinRoom: (user : UserState, id : string) => void;
  sendChatMessage: (message : StoreModels.ChatMessage, id : string) => void;
  receivedChatMessage: (message : StoreModels.ChatMessage) => Actions.ChatMessageAction
}