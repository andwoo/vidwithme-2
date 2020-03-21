import { combineReducers } from 'redux';
import connectionReducer from './ConnectionReducer';
import roomReducer from './RoomReducer';

const CombinedReducers = combineReducers({ connection: connectionReducer, room: roomReducer });

export default CombinedReducers;
