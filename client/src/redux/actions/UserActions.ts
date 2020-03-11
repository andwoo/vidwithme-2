import * as Actions from '../interfaces/Actions';
import ActionTypes from '../constants/ActionTypes';

export function setUser(userName : string) : Actions.UserAction {
  return {
    type: ActionTypes.SET_USER,
    userName: userName
  }
}