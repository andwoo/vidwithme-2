import * as Actions from './Actions';
import * as StoreModels from './StoreModels';

export interface StoreModel {
  connection: ConnectionState,
  room: RoomState
}

export interface ConnectionState {
  isConnected: boolean;
  isUserDataSettingInProgress: boolean;
  isUserDataSet: boolean;
  user: UserState;
}

export interface UserState {
  userName : string;
}

export interface RoomState {
  redirect_id: string;
  id: string;
  isJoiningInProgress: boolean;
  chat: Array<ChatMessage>;
  playlist: Array<PlaylistItem>;
  errors: Array<RoomError>;
}

export interface RoomError {
  title: string;
  description: string;
}

export enum ChatMessageType {
  message,
  media,
  room
}

export interface ChatMessage {
  user : UserState;
  type: ChatMessageType;
  message: string;
}

export interface PlaylistItemAddedMessage extends ChatMessage {
  user : UserState;
  item: PlaylistItem;
}

export interface PlaylistItem {
  vendor: string;
  title: string;
  videoId: string;
  thumbnail: string;
  uid: string;
  startTime: number;
  isPlaying: boolean;
}

export interface StoreDispatch {
  connectToServer: () => void;
  setUserData: (user : StoreModels.UserState) => void;
  setRedirectRoomId: (redirectId : string) => Actions.RoomAction;
  createRoom: () => void;
  joinRoom: (id : string) => void;
  getRoomState: () => void;
  sendChatMessage: (message : string) => void;
  receivedPlaylistItemMessage: (message : StoreModels.PlaylistItemAddedMessage) => Actions.ChatMessageAction;
  receivedChatMessage: (message : StoreModels.ChatMessage) => Actions.ChatMessageAction;
  popConnectionError: () => Actions.BaseAction;
}