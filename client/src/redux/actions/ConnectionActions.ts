import ActionTypes from '../constants/ActionTypes';
import SignalRConnection from '../../signalr/SignalRConnection';
import * as StoreModels from '../interfaces/StoreModels';
import * as RoomActions from './RoomActions';

const setUserDataAsync = async (dispatch, user : StoreModels.UserState) : Promise<void> => {
  return new Promise((resolve, reject) => {
    SignalRConnection.registerEvent('userDataSet', (success: boolean) => {
      SignalRConnection.unregisterEvent('userDataSet');
      if(success) {
        dispatch({
          type: ActionTypes.USER_DATA_SET,
          user: user
        });
        resolve();
      } else {
        dispatch(RoomActions.connectionError({
          title: 'Failed To Set User Data',
          description: 'Failed for unknown reasons.'
        }));
        reject();
      }
    });

    SignalRConnection.sendEvent('setUserData', user);
  })
}

const connectToServerAsync = async (dispatch) : Promise<void> => {
  return new Promise((resolve, reject) => {
    SignalRConnection.connect().then(() => {
      dispatch({
        type: ActionTypes.CONNECTED,
        connected: true
      });
      resolve();
    }).catch(() => {
      dispatch({
        type: ActionTypes.CONNECTED,
        connected: false
      });
      reject();
    })
  })
}


export function setUserData(user : StoreModels.UserState) {
  return (dispatch) : void => {
    setUserDataAsync(dispatch, user).catch((error) => {});
  };
}

export function connectToServer() {
  return (dispatch) : void => {
    connectToServerAsync(dispatch);
  };
}