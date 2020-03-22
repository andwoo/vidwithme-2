import { ConnectionState } from '../interfaces/StoreModels';
import * as Actions from '../interfaces/Actions';
import ActionTypes from '../constants/ActionTypes';

function connectionReducer(state: ConnectionState, action: Actions.BaseAction) {
  const nextState = {...state};
  if(action.type === ActionTypes.CONNECTED) {
    nextState.isConnected = (action as Actions.ConnectionAction).connected;
  } else if(action.type === ActionTypes.USER_DATA_IN_PROGRESS) {
    nextState.isUserDataSettingInProgress = true;
  } else if(action.type === ActionTypes.USER_DATA_SUCCESS) {
    nextState.user = (action as Actions.UserDataAction).user;
    nextState.isUserDataSet = true;
    nextState.isUserDataSettingInProgress = false;
  } else if(action.type === ActionTypes.USER_DATA_FAILED) {
    nextState.isUserDataSet = false;
    nextState.isUserDataSettingInProgress = false;
  }
  return nextState;
}

export default connectionReducer;