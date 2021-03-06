import * as StoreModels from '../interfaces/StoreModels';

export interface BaseAction {
  type: string;
}

export interface ConnectionAction extends BaseAction {
  connected: boolean;
}

export interface UserDataAction extends BaseAction {
  user: StoreModels.UserState;
}

export interface UserAction extends BaseAction {
  userName: string;
}

export interface RoomAction extends BaseAction {
  id: string;
}

export interface ChatMessageAction extends BaseAction {
  message : StoreModels.ChatMessage
}

export interface RoomStateAction extends BaseAction {
  roomState : StoreModels.RoomState
}

export interface RoomErrorAction extends BaseAction {
  error: StoreModels.RoomError;
}