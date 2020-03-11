import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import CombinedReducers from './reducers/index';
import * as StoreModels from './interfaces/StoreModels';

//combined interface for easy include in React Components
export interface Store extends StoreModels.StoreDispatch, StoreModels.StoreModel {}

const defaultModel: StoreModels.StoreModel = {
  connection: {
    isConnected: false
  },
  user: {
    userName: ''
  },
  room: {
    id: '',
    chat: []
  },
};

/* eslint-disable */
const middlewareEnhancer = applyMiddleware(thunk);
const composedEnhancers = compose(middlewareEnhancer, window['devToolsExtension'] ? window['devToolsExtension']() : f => f);
const store = createStore(CombinedReducers, defaultModel, composedEnhancers);
/* eslint-enable */

if (module['hot']) {
  module['hot'].accept('./reducers', () => {
    const nextRootReducer = require('./reducers/index').default;
    store.replaceReducer(nextRootReducer);
  });
}

export default store;
