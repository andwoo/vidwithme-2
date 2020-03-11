import * as React from 'react';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

//store
import store from './Store';
import * as StoreModels from './interfaces/StoreModels';
//actions
import * as ConnectionActions from './actions/ConnectionActions';
import * as UserActions from './actions/UserActions';
import * as RoomActions from './actions/RoomActions';

import App from '../App';

function MapStateToProps(state: StoreModels.StoreModel): StoreModels.StoreModel {
  return {
    connection: state.connection,
    user: state.user,
    room: state.room,
  };
}

function MapDispatchToProps(dispatch): StoreModels.StoreDispatch {
  return bindActionCreators({...ConnectionActions, ...UserActions, ...RoomActions}, dispatch);
}

const ReduxPropsBinder = connect(MapStateToProps, MapDispatchToProps)(App);

export default class ReduxRootComponent extends React.Component {
  render(): Provider {
    return (
      <Provider store={store}>
        <ReduxPropsBinder />
      </Provider>
    );
  }
}
