import { UserState } from '../interfaces/StoreModels';
import * as Actions from '../interfaces/Actions';
import ActionTypes from '../constants/ActionTypes';

function userReducer(state: UserState, action: Actions.BaseAction) {
  const nextState = {...state};
  if(action.type === ActionTypes.SET_USER) {
    nextState.userName = (action as Actions.UserAction).userName;
  }
  return nextState;
}

export default userReducer;