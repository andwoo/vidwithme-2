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
    SignalRConnection.connect();
    SignalRConnection.registerEvent('receiveChatMessage', (user : StoreModels.UserState, message : string) => {
      this.props.receivedChatMessage({
        message: message, 
        user: user
      });
    });

    this.props.setUser(Date.now().toString());
  }

  render(): JSX.Element {
    return (
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
    );
  }
}

export default hot(module)(App);
