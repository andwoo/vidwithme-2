import * as React from 'react';
import * as StoreModels from '../redux/interfaces/StoreModels';

export default class ChatMessage extends React.Component<StoreModels.ChatMessage> {
  render() {
    return (
      <p>{`[${this.props.user.userName}] - ${this.props.message}`}</p>
    )
  }
}