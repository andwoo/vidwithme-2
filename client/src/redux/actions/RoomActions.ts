import ActionTypes from '../constants/ActionTypes';
import * as Actions from '../interfaces/Actions';
import * as StoreModels from '../interfaces/StoreModels';
import SignalRConnection from '../../signalr/SignalRConnection';

const createRoomAsync = async (dispatch) : Promise<void> => {
  return new Promise((resolve, reject) => {
    SignalRConnection.registerEvent('joinedRoom', (success: boolean, id : string) => {
      SignalRConnection.unregisterEvent('joinedRoom');

      if(success) {
        dispatch({
          type: ActionTypes.JOIN_ROOM_SUCCESS,
          id: id
        });
        resolve();
      } else {
        dispatch({
          type: ActionTypes.JOIN_ROOM_FAILED
        });
        dispatch(connectionError({
          title: 'Failed To Create Room',
          description: 'Room does not exist or has been closed.'
        }));
        reject();
      }
    });

    dispatch({
      type: ActionTypes.JOIN_ROOM_IN_PROGRESS
    });
    SignalRConnection.sendEvent('createRoom');
  });
}

const joinRoomAsync = async (dispatch, targetId : string) : Promise<void> => {
  return new Promise((resolve, reject) => {
    SignalRConnection.registerEvent('joinedRoom', (success: boolean, id : string) => {
      SignalRConnection.unregisterEvent('joinedRoom');
      if(success) {
        dispatch({
          type: ActionTypes.JOIN_ROOM_SUCCESS,
          id: id
        });
        resolve();
      } else {
        dispatch({
          type: ActionTypes.JOIN_ROOM_FAILED
        });
        dispatch(connectionError({
          title: 'Failed To Join Room',
          description: 'Room does not exist or has been closed.'
        }));
        reject();
      }
    });

    dispatch({
      type: ActionTypes.JOIN_ROOM_IN_PROGRESS
    });
    SignalRConnection.sendEvent('joinRoom', targetId);
  });
}

const getRoomStateAsync = async (dispatch) : Promise<void> => {
  return new Promise((resolve, reject) => {
    SignalRConnection.unregisterEvent('roomStateReceived');
    SignalRConnection.registerEvent('roomStateReceived', (success: boolean, roomState : StoreModels.RoomState) => {
      if(success) {
        dispatch({
          type: ActionTypes.ROOM_STATE_RECEIVED,
          roomState: roomState
        });
        resolve();
      } else {
        dispatch(connectionError({
          title: 'Failed To Get Room State',
          description: 'Room does not exist or has been closed.'
        }));
        reject();
      }
    });

    SignalRConnection.sendEvent('getRoomState');
  });
}

const createRoomSequenceAsync = async (dispatch) : Promise<void> => {
  try {
    await createRoomAsync(dispatch);
    await getRoomStateAsync(dispatch);
  } catch(error) {}
}

const joinRoomSequenceAsync = async (dispatch, id : string) : Promise<void> => {
  try {
    await joinRoomAsync(dispatch, id);
    await getRoomStateAsync(dispatch);
  } catch(error) {}
}

const sendChatMessageAsync = async (dispatch, message : string) : Promise<void> => {
  SignalRConnection.sendEvent('SendChatMessage', message);
  Promise.resolve();
}

export function setRedirectRoomId(redirectId : string) : Actions.RoomAction {
  return {
    type: ActionTypes.SET_REDIRECT_ROOM_ID,
    id: redirectId
  }
}

export function createRoom() {
  return (dispatch) : void => {
    createRoomSequenceAsync(dispatch).catch((error) => {});
  };
}

export function joinRoom(id : string) {
  return (dispatch) : void => {
    joinRoomSequenceAsync(dispatch, id);
  }
}

export function getRoomState() {
  return (dispatch) : void => {
    getRoomStateAsync(dispatch);
  }
}

export function sendChatMessage(message : string) {
  return (dispatch) : void => {
    sendChatMessageAsync(dispatch, message);
  }
}

export function receivedChatMessage(message : StoreModels.ChatMessage) : Actions.ChatMessageAction {
  return {
    type: ActionTypes.RECEIVED_CHAT_MESSAGE,
    message: message
  }
}

export function connectionError(error: StoreModels.RoomError) : Actions.RoomErrorAction {
  return {
    type: ActionTypes.CONNECTION_ERROR,
    error: error
  }
}

export function popConnectionError() : Actions.BaseAction {
  return {
    type: ActionTypes.POP_CONNECTION_ERROR
  }
}