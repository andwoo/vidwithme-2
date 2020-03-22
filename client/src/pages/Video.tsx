import * as React from 'react';
import { useParams } from "react-router-dom";
import { Store } from '../redux/Store';
import * as StoreModels from '../redux/interfaces/StoreModels';
import SignalRConnection from '../signalr/SignalRConnection';

interface VideoProps extends Store {
  roomId: string;
}

interface VideoState {
  chatInput: string;
}

class VideoInternal extends React.Component<VideoProps, VideoState> {
  constructor(props) {
    super(props);
    this.state = {
      chatInput: ''
    }
  }
  componentDidMount() {
    SignalRConnection.registerEvent('chatMessageReceived', this.handleOnChatMessageReceived);
    this.props.setRedirectRoomId(this.props.roomId);
  }

  componentWillUnmount() {
    SignalRConnection.unregisterEvent('chatMessageReceived');
  }

  handleOnChatMessageReceived = (user : StoreModels.UserState, message : string) => {
    this.props.receivedChatMessage({
      message: message, 
      user: user
    });
  }

  isInRoom = () => {
    return this.props.connection.isConnected &&
    this.props.connection.isUserDataSet &&
    this.props.room.id && this.props.room.id.length > 0;
  }

  onSendChatMessagePressed(): void {
    this.props.sendChatMessage(this.state.chatInput);
  }

  renderRoomState = () => {
    return (
      <React.Fragment>
        {this.props.room.playlist.map((value : StoreModels.PlaylistItem, index : number) => <p key={index}>{value.url}</p>)}
      </React.Fragment>
    );
  }

  renderChat = () => {
    return (
      <React.Fragment>
        <label>
          Chat Message:
          <input type="text" value={this.state.chatInput} onChange={(event) => this.setState({chatInput: event.target.value})} />
        </label>
        <button className="button" onClick={(): void => this.onSendChatMessagePressed()}>
          Send Message
        </button>
        <br/>
        {this.props.room.chat.map((message : StoreModels.ChatMessage, index : number) => <p key={index}>{`[${message.user.userName}] - ${message.message}`}</p>)}
      </React.Fragment>
    )
  }

  render() {
    return (
      <div>
        {this.isInRoom() && this.renderRoomState()}
        {this.isInRoom() && this.renderChat()}
      </div>
    )
  }
}

export default function Video(store) {
  let { room_id } = useParams();
  return <VideoInternal {...store} roomId={room_id}/>
}
