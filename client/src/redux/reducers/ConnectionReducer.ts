import { ConnectionState } from '../interfaces/StoreModels';
import * as Actions from '../interfaces/Actions';
import ActionTypes from '../constants/ActionTypes';

function connectionReducer(state: ConnectionState, action: Actions.BaseAction) {
  const nextState = {...state};
  if(action.type === ActionTypes.CONNECTED) {
    nextState.isConnected = (action as Actions.ConnectionAction).connected;
  }
  return nextState;
}

export default connectionReducer;