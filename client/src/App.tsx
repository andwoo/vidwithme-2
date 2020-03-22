import * as React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { Store } from './redux/Store';
import * as StoreModels from './redux/interfaces/StoreModels';
import BasePage from './pages/BasePage';
import Home from './pages/Home';
import Video from './pages/Video';
import EntryOverlay from './components/EntryOverlay';
import ErrorOverlay from './components/ErrorOverlay';

class App extends React.Component<Store> {
  constructor(props) {
    super(props);
    this.state = {
      roomIdInput: '',
      chatInput: ''
    }
  }

  componentDidMount() {
    this.props.connectToServer();
  }

  isInRoom = () => {
    return this.props.connection.isConnected &&
    this.props.connection.isUserDataSet &&
    this.props.room.id && this.props.room.id.length > 0;
  }

  render(): JSX.Element {
    const connectionError: StoreModels.RoomError = this.props.room.errors.length > 0 ? this.props.room.errors[0] : null;
    const errorOverlay: JSX.Element = connectionError ? <ErrorOverlay {...connectionError} onClose={this.props.popConnectionError}/> : null;
    
    return (
      <React.Fragment>
        <BasePage {...this.props}>
          <BrowserRouter>
            <Switch>
              <Route path="/:room_id">
                <Video {...this.props}/>
              </Route>
              <Route path="/">
                <Home {...this.props}/>
              </Route>
            </Switch>
          </BrowserRouter>
        </BasePage>
        {!this.isInRoom() && <EntryOverlay {...this.props} />}
        {errorOverlay}
      </React.Fragment>
    );
  }
}

export default hot(module)(App);
