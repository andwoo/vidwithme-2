import { combineReducers } from 'redux';
import testReducerMethod from './TestReducer';

const CombinedReducers = combineReducers({ testObject: testReducerMethod });

export default CombinedReducers;
