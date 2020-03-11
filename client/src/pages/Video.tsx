import * as React from 'react';
import { useParams } from "react-router-dom";
import { Store } from '../redux/Store';
import * as StoreModels from '../redux/interfaces/StoreModels';

interface VideoProps extends Store {
  roomId: string;
}

interface VideoState {
  roomIdInput: string;
  chatInput: string;
}

class VideoInternal extends React.Component<VideoProps, VideoState> {
  constructor(props) {
    super(props);
    this.state = {
      roomIdInput: this.props.roomId,
      chatInput: ''
    }
  }
  componentDidMount() {
    if(!this.isIdValid(this.props.room.id) && this.isIdValid(this.props.roomId)) {
      this.props.joinRoom(this.props.user, this.props.roomId);
    }
  }

  isIdValid = (id) => {
    return id && id.length > 0;
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

  renderJoinRoom = () => {
    return (
      <React.Fragment>
        <label>
          Room id:
          <input type="text" value={this.state.roomIdInput} onChange={(event) => this.setState(   {roomIdInput: event.target.value})} />
          </label>
          <button className="button" onClick={(): void => this.onJoinRoomPressed()}>Join Room</button>
        <br/>
      </React.Fragment>
    );
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
        <p>{`RoomID - ${this.props.room.id}`}</p>
        {!this.isIdValid(this.props.room.id) && this.renderJoinRoom()}
        {this.isIdValid(this.props.room.id) && this.renderRoomState()}
        {this.isIdValid(this.props.room.id) && this.renderChat()}
      </div>
    )
  }
}

export default function Video(store) {
  let { room_id } = useParams();
  return <VideoInternal {...store} roomId={room_id}/>
}
