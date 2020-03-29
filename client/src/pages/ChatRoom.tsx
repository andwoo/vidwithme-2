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
  private scrollListRef: React.RefObject<HTMLDivElement>;

  constructor(props) {
    super(props);
    this.scrollListRef = React.createRef()
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

  componentWillUpdate() {
    if(this.scrollListRef.current) {
      this.shouldScrollToBottom = (this.scrollListRef.current.scrollTop + this.scrollListRef.current.offsetHeight) === this.scrollListRef.current.scrollHeight;
    }
  }

  componentDidUpdate() {
    if (this.scrollListRef.current && this.shouldScrollToBottom) {
      this.scrollListRef.current.scrollTop = this.scrollListRef.current.scrollHeight;
    }
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
          <div className="chatLog has-background-light" ref={this.scrollListRef}>
            {this.props.room.chat.map((message : StoreModels.ChatMessage, index : number) => <ChatMessage key={index} {...message}/>)}
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
