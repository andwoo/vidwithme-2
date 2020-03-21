import { RoomState } from '../interfaces/StoreModels';
import * as Actions from '../interfaces/Actions';
import ActionTypes from '../constants/ActionTypes';

function roomReducer(state: RoomState, action: Actions.BaseAction) {
  const nextState = {...state};
  if(action.type === ActionTypes.JOIN_ROOM) {
    nextState.id = (action as Actions.RoomAction).id;
  } else if(action.type === ActionTypes.RECEIVED_CHAT_MESSAGE) {
    nextState.chat.push((action as Actions.ChatMessageAction).message);
  } else if(action.type === ActionTypes.ROOM_STATE_RECEIVED) {
    nextState.id = (action as Actions.RoomStateAction).roomState.id;
    nextState.playlist = (action as Actions.RoomStateAction).roomState.playlist;
  } else if(action.type === ActionTypes.ROOM_ERROR) {
    nextState.errors.push((action as Actions.RoomErrorAction).error);
  }
  return nextState;
}

export default roomReducer;