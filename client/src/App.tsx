import * as React from 'react';
import { hot } from 'react-hot-loader';
import * as signalR from "@microsoft/signalr";

import { Store } from './redux/Store';

class App extends React.Component<Store> {
  private userName : string;
  private connection : signalR.HubConnection;

  constructor(props) {
    super(props);

    this.userName = Date.now().toString();
    console.log(`username - ${this.userName}`);

    this.connection = new signalR.HubConnectionBuilder().withUrl('/chatHub').build();
    this.connection.on('messageReceived', this.onMessageReceivedHandler);
    this.connection.start().catch(error => console.error(`SignaR error: ${error}`));
  }

  onMessageReceivedHandler = (username: string, message: string) => {
    console.log(`inbound - [${username}] - ${message}`);
  }

  onClickButton(): void {
    // this.props.TestAction('NEW CONTENT');
    this.connection.send('sendMessage', this.userName, 'some message text here')
  }

  render(): JSX.Element {
    return (
      <div>
        <p>Howdy Yall!</p>
        <p>{this.props.testObject.name}</p>
        <button className="button" onClick={(): void => this.onClickButton()}>
          Click this
        </button>
      </div>
    );
  }
}

export default hot(module)(App);
