import { combineReducers } from 'redux';
import userReducer from './UserReducer';
import roomReducer from './RoomReducer';

const CombinedReducers = combineReducers({ user: userReducer, room: roomReducer });

export default CombinedReducers;
