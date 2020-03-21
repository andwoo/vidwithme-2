import * as React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import SignalRConnection from './signalr/SignalRConnection';
import { Store } from './redux/Store';
import * as StoreModels from './redux/interfaces/StoreModels';
import Home from './pages/Home';
import Video from './pages/Video';

class App extends React.Component<Store> {
  constructor(props) {
    super(props);
    this.state = {
      roomIdInput: '',
      chatInput: ''
    }
  }

  componentDidMount() {
    SignalRConnection.registerEvent('chatMessageReceived', (user : StoreModels.UserState, message : string) => {
      this.props.receivedChatMessage({
        message: message, 
        user: user
      });
    });

    
    this.props.connectToServer();
  }

  componentDidUpdate(prevProps : Store) {
    if(!prevProps.connection.isConnected && this.props.connection.isConnected) {
      this.props.setUserData({
        userName: Date.now().toString()
      });
    }
  }

  renderConnecting = () => {
    return (
      <div>
        <h2>Connecting</h2>
      </div>
    );
  }

  renderApp = () => {
    return (
      <div>
        {this.props.room.errors.map((value: StoreModels.RoomError, index: number) => {
          return (<div key={index}>
            <h2>{value.title}</h2>
            <h3>{value.description}</h3>
          </div>)
        })}
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
      </div>
    );
  }

  render(): JSX.Element {
    return this.props.connection.isConnected && this.props.connection.isUserDataSet ? this.renderApp() : this.renderConnecting();
  }
}

export default hot(module)(App);
