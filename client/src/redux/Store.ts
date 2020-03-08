import { createStore, compose } from 'redux';
import CombinedReducers from './reducers/index';

export interface TestObject {
  name: string;
}

export interface StoreDispatch {
  TestAction(name: string);
}

export interface StoreModel {
  testObject: TestObject;
}

//combined interface for easy include in React Components
export interface Store extends StoreDispatch, StoreModel {}

const defaultModel: StoreModel = {
  testObject: {
    name: '',
  },
};

/* eslint-disable */
const enhancers = compose(window['devToolsExtension'] ? window['devToolsExtension']() : f => f);
const store = createStore(CombinedReducers, defaultModel, enhancers);
/* eslint-enable */

if (module['hot']) {
  module['hot'].accept('./reducers', () => {
    const nextRootReducer = require('./reducers/index').default;
    store.replaceReducer(nextRootReducer);
  });
}

export default store;
