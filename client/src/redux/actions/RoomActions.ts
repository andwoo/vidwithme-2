import ActionTypes from '../constants/ActionTypes';
import * as Actions from '../interfaces/Actions';
import * as StoreModels from '../interfaces/StoreModels';
import SignalRConnection from '../../signalr/SignalRConnection';

const createRoomAsync = async (dispatch, user : StoreModels.UserState) : Promise<void> => {
  return new Promise((resolve) => {
    SignalRConnection.registerEvent('joinedRoom', (id : string) => {
      SignalRConnection.unregisterEvent('joinedRoom');
      dispatch({
        type: ActionTypes.JOIN_ROOM,
        id: id
      });
      resolve();
    });

    SignalRConnection.sendEvent('createRoom', user);
  });
}

const joinRoomAsync = async (dispatch, user : StoreModels.UserState, targetId : string) : Promise<void> => {
  return new Promise((resolve) => {
    SignalRConnection.registerEvent('joinedRoom', (id : string) => {
      SignalRConnection.unregisterEvent('joinedRoom');
      dispatch({
        type: ActionTypes.JOIN_ROOM,
        id: id
      });
      resolve();
    });

    SignalRConnection.sendEvent('joinRoom', user, targetId);
  });
}

const sendChatMessageAsync = async (dispatch, message : StoreModels.ChatMessage, id : string) : Promise<void> => {
  dispatch(receivedChatMessage(message));
  SignalRConnection.sendEvent('SendChatMessage', message.user, message.message, id)
  Promise.resolve();
}

export function createRoom(user : StoreModels.UserState) {
  return (dispatch) : void => {
    createRoomAsync(dispatch, user)
  };
}

export function joinRoom(user : StoreModels.UserState, id : string) {
  return (dispatch) : void => {
    joinRoomAsync(dispatch, user, id);
  }
}

export function sendChatMessage(message : StoreModels.ChatMessage, id : string) {
  return (dispatch) : void => {
    sendChatMessageAsync(dispatch, message, id);
  }
}

export function receivedChatMessage(message : StoreModels.ChatMessage) : Actions.ChatMessageAction {
  return {
    type: ActionTypes.RECEIVED_CHAT_MESSAGE,
    message: message
  }
}