import * as React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import SignalRConnection from './signalr/SignalRConnection';
import { Store } from './redux/Store';
import * as StoreModels from './redux/interfaces/StoreModels';
import BasePage from './pages/BasePage';
import Home from './pages/Home';
import Video from './pages/Video';
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

  render(): JSX.Element {
    const showContent: boolean = this.props.connection.isConnected && this.props.connection.isUserDataSet;
    return (
      <BasePage {...this.props}>
        {this.props.room.errors.map((value: StoreModels.RoomError, index: number) => {
          return <ErrorOverlay key={index} {...value}/>
        })}
        { showContent && 
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
        }
      </BasePage>
    );
  }
}

export default hot(module)(App);
