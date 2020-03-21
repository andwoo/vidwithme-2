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
          type: ActionTypes.JOIN_ROOM,
          id: id
        });
        resolve();
      } else {
        dispatch(connectionError({
          title: 'Failed To Create Room',
          description: 'Room does not exist or has been closed.'
        }));
        reject();
      }
    });

    SignalRConnection.sendEvent('createRoom');
  });
}

const joinRoomAsync = async (dispatch, targetId : string) : Promise<void> => {
  return new Promise((resolve, reject) => {
    SignalRConnection.registerEvent('joinedRoom', (success: boolean, id : string) => {
      SignalRConnection.unregisterEvent('joinedRoom');
      console.log(`yuh - ${success} ${id}`)
      if(success) {
        dispatch({
          type: ActionTypes.JOIN_ROOM,
          id: id
        });
        resolve();
      } else {
        dispatch(connectionError({
          title: 'Failed To Join Room',
          description: 'Room does not exist or has been closed.'
        }));
        reject();
      }
    });

    SignalRConnection.sendEvent('joinRoom', targetId);
  });
}

const getRoomStateAsync = async (dispatch, id : string) : Promise<void> => {
  return new Promise((resolve, reject) => {
    SignalRConnection.registerEvent('roomStateReceived', (success: boolean, roomState : StoreModels.RoomState) => {
      SignalRConnection.unregisterEvent('roomStateReceived');
      console.log(`yuh - success[${success}]`);
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

    SignalRConnection.sendEvent('getRoomState', id);
  });
}

const joinRoomSequenceAsync = async (dispatch, id : string) : Promise<void> => {
  try {
    await joinRoomAsync(dispatch, id);
    await getRoomStateAsync(dispatch, id);
  } catch(error) {}
}

const sendChatMessageAsync = async (dispatch, message : StoreModels.ChatMessage, id : string) : Promise<void> => {
  dispatch(receivedChatMessage(message));
  SignalRConnection.sendEvent('SendChatMessage', message.user, message.message, id)
  Promise.resolve();
}

export function createRoom() {
  return (dispatch) : void => {
    createRoomAsync(dispatch).catch((error) => {});
  };
}

export function joinRoom(id : string) {
  return (dispatch) : void => {
    joinRoomSequenceAsync(dispatch, id);
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

export function getRoomState(id : string) {
  return (dispatch) : void => {
    getRoomStateAsync(dispatch, id);
  }
}

export function connectionError(error: StoreModels.RoomError) : Actions.RoomErrorAction {
  return {
    type: ActionTypes.ROOM_ERROR,
    error: error
  }
}