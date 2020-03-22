import { ConnectionState } from '../interfaces/StoreModels';
import * as Actions from '../interfaces/Actions';
import ActionTypes from '../constants/ActionTypes';

function connectionReducer(state: ConnectionState, action: Actions.BaseAction) {
  const nextState = {...state};
  if(action.type === ActionTypes.CONNECTED) {
    nextState.isConnected = (action as Actions.ConnectionAction).connected;
  } else if(action.type === ActionTypes.USER_DATA_IN_PROGRESS) {
    nextState.isUserDataSettingInProgress = true;
  } else if(action.type === ActionTypes.USER_DATA_SET) {
    nextState.user = (action as Actions.UserDataAction).user;
    nextState.isUserDataSet = true;
    nextState.isUserDataSettingInProgress = false;
  }
  return nextState;
}

export default connectionReducer;