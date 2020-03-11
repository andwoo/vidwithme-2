import { combineReducers } from 'redux';
import connectionReducer from './ConnectionReducer';
import userReducer from './UserReducer';
import roomReducer from './RoomReducer';

const CombinedReducers = combineReducers({ connection: connectionReducer, user: userReducer, room: roomReducer });

export default CombinedReducers;
