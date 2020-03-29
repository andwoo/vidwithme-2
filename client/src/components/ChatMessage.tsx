import * as React from 'react';
import * as StoreModels from '../redux/interfaces/StoreModels';

export default class ChatMessage extends React.Component<StoreModels.ChatMessage> {
  render() {
    return (
      <div className="chatMessage">
        <span className="tag is-danger is-light">{this.props.user.userName}</span>
        <span>{` ${this.props.message}`}</span>
      </div>
    )
  }
}