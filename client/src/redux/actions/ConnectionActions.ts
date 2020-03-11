import ActionTypes from '../constants/ActionTypes';
import SignalRConnection from '../../signalr/SignalRConnection';

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

export function connectToServer() {
  return (dispatch) : void => {
    connectToServerAsync(dispatch)
  };
}