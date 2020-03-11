import * as React from 'react';
import { hot } from 'react-hot-loader';
import SignalRConnection from './signalr/SignalRConnection';

import { Store } from './redux/Store';
import * as StoreModels from './redux/interfaces/StoreModels';

interface TestState {
  roomIdInput: string;
  chatInput: string;
}

class App extends React.Component<Store, TestState> {
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

  onCreateRoomPressed() : void {
    this.props.createRoom(this.props.user);
  }

  onJoinRoomPressed(): void {
    this.props.joinRoom(this.props.user, this.state.roomIdInput);
  }

  onSendChatMessagePressed(): void {
    this.props.sendChatMessage({
      message: this.state.chatInput,
      user: this.props.user
    }, this.props.room.id);
  }

  render(): JSX.Element {
    return (
      <div>
        <p>Howdy Yall!</p>
        <p>{`Actual room id - ${this.props.room.id}`}</p>

        <button className="button" onClick={(): void => this.onCreateRoomPressed()}>
          Create Room
        </button>
        <br/>

        <label>
          Room id:
          <input type="text" value={this.state.roomIdInput} onChange={(event) => this.setState({roomIdInput: event.target.value})} />
        </label>
        <button className="button" onClick={(): void => this.onJoinRoomPressed()}>
          Join Room
        </button>
        <br/>

        <label>
          Chat Message:
          <input type="text" value={this.state.chatInput} onChange={(event) => this.setState({chatInput: event.target.value})} />
        </label>
        <button className="button" onClick={(): void => this.onSendChatMessagePressed()}>
          Send Message
        </button>
        <br/>
        {this.props.room.chat.map((message : StoreModels.ChatMessage, index : number) => <p key={index}>{`[${message.user.userName}] - ${message.message}`}</p>)}
      </div>
    );
  }
}

export default hot(module)(App);
