import * as React from 'react';
import { Store } from '../redux/Store';
import { Link } from "react-router-dom";

export default class Home extends React.Component<Store> {
  render() {
    return (
      <div>
        <p>HOME</p>
        <Link to="/asdasd">video</Link>
      </div>
    )
  }
}

// <div>
      //   <p>Howdy Yall!</p>
      //   <p>{`Actual room id - ${this.props.room.id}`}</p>

      //   <button className="button" onClick={(): void => this.onCreateRoomPressed()}>
      //     Create Room
      //   </button>
      //   <br/>

      //   <label>
      //     Room id:
      //     <input type="text" value={this.state.roomIdInput} onChange={(event) => this.setState({roomIdInput: event.target.value})} />
      //   </label>
      //   <button className="button" onClick={(): void => this.onJoinRoomPressed()}>
      //     Join Room
      //   </button>
      //   <br/>

      //   <label>
      //     Chat Message:
      //     <input type="text" value={this.state.chatInput} onChange={(event) => this.setState({chatInput: event.target.value})} />
      //   </label>
      //   <button className="button" onClick={(): void => this.onSendChatMessagePressed()}>
      //     Send Message
      //   </button>
      //   <br/>
      //   {this.props.room.chat.map((message : StoreModels.ChatMessage, index : number) => <p key={index}>{`[${message.user.userName}] - ${message.message}`}</p>)}
      // </div>