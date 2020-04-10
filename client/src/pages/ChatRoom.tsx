import * as React from 'react';
import { useParams } from "react-router-dom";
import { Store } from '../redux/Store';
import * as StoreModels from '../redux/interfaces/StoreModels';
import SignalRConnection from '../signalr/SignalRConnection';
import ChatMessage from '../components/ChatMessage';

interface ChatRoomProps extends Store {
  roomId: string;
}

interface ChatRoomState {
  chatInput: string;
}

class ChatRoomInternal extends React.Component<ChatRoomProps, ChatRoomState> {
  private shouldScrollToBottom: boolean;

  constructor(props) {
    super(props);
    this.state = {
      chatInput: ''
    }
  }
  componentDidMount() {
    SignalRConnection.registerEvent('joinedRoomMessageReceived', this.handleOnjoinedOrLeaveMessageReceived);
    SignalRConnection.registerEvent('leftRoomMessageReceived', this.handleOnjoinedOrLeaveMessageReceived);
    SignalRConnection.registerEvent('chatMessageReceived', this.handleOnChatMessageReceived);
    SignalRConnection.registerEvent('playlistItemMessageReceived', this.handleOnPlaylistItemMessageReceived);
      
    this.props.setRedirectRoomId(this.props.roomId);
  }

  componentWillUnmount() {
    SignalRConnection.unregisterEvent('joinedRoomMessageReceived');
    SignalRConnection.unregisterEvent('leftRoomMessageReceived');
    SignalRConnection.unregisterEvent('chatMessageReceived');
    SignalRConnection.unregisterEvent('playlistItemMessageReceived');
  }

  componentWillUpdate() {
    let container : any = document.querySelector('#chatLog .simplebar-content-wrapper');
    if(container) {
      this.shouldScrollToBottom = (container.scrollTop + container.offsetHeight) === container.scrollHeight;
    }
  }

  componentDidUpdate() {
    let container : any = document.querySelector('#chatLog .simplebar-content-wrapper');
    if (container && this.shouldScrollToBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }

  handleOnjoinedOrLeaveMessageReceived = (user : StoreModels.UserState, message : string) => {
    this.props.receivedChatMessage({
      message: message, 
      user: user,
      type: StoreModels.ChatMessageType.room
    });
  }

  handleOnChatMessageReceived = (user : StoreModels.UserState, message : string) => {
    this.props.receivedChatMessage({
      message: message, 
      user: user,
      type: StoreModels.ChatMessageType.message
    });
  }

  handleOnPlaylistItemMessageReceived = (user : StoreModels.UserState, message: string, item : StoreModels.PlaylistItem) => {
    this.props.receivedPlaylistItemMessage({
      message: message,
      user: user,
      item: item,
      type: StoreModels.ChatMessageType.media
    });
  }

  isInRoom = () => {
    return this.props.connection.isConnected &&
    this.props.connection.isUserDataSet &&
    this.props.room.id && this.props.room.id.length > 0;
  }

  handleOnSubmit = (event) => {
    if(event) {
      event.preventDefault();
    }
    this.props.sendChatMessage(this.state.chatInput);
    this.setState({
      chatInput: ''
    });
  }

  renderChat = () => {
    return (
        <div className="chatRoom">
          <div className="chatLog has-background-light">
            <div className="chatLogScrollView" id="chatLog" data-simplebar>
              <div>
                {this.props.room.chat.map((message : StoreModels.ChatMessage, index : number) => <ChatMessage key={index} {...message}/>)}
              </div>
            </div>
          </div>
          <div className="chatInput has-background-white">
            <form onSubmit={this.handleOnSubmit}>
              <div style={{display: 'flex'}}>
                <div className="field" style={{flexGrow: 1, marginBottom: '0rem'}}>
                  <div className="control">
                  <input className="input" type="text" placeholder="'Hey all!' or 'https://www.youtube.com/watch?v=a1b2c3'" value={this.state.chatInput} onChange={(event) => this.setState({chatInput: event.target.value})}/>
                  </div>
                </div>
                <div className="field is-grouped" style={{marginLeft: '0.75rem', marginBottom: '0rem'}}>
                  <div className="control">
                    <button className="button is-danger" onClick={this.handleOnSubmit}>Send</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
    )
  }

  render() {
    return this.isInRoom() && this.renderChat();
  }
}

export default function ChatRoom(store) {
  let { room_id } = useParams();
  return <ChatRoomInternal {...store} roomId={room_id}/>
}
