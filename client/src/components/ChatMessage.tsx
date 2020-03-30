import * as React from 'react';
import * as StoreModels from '../redux/interfaces/StoreModels';

export default class ChatMessage extends React.Component<StoreModels.ChatMessage> {

  isPlaylistItemAddedMessage = () => {
    return !!(this.props as StoreModels.PlaylistItemAddedMessage).item && this.props.message === "added";
  }

  renderMessage = () => {
    return (
      <React.Fragment>
        <span className="tag is-danger is-light">{this.props.user.userName}</span>
        <span>{` ${this.props.message}`}</span>
      </React.Fragment>
    );
  }

  renderPlaylistItemAdded = () => {
    const item: StoreModels.PlaylistItemAddedMessage = this.props as StoreModels.PlaylistItemAddedMessage;
    return (
      <div className="chatPlaylistItem has-background-white">
        <img src={item.item.thumbnail}/>
        <span>
          <span className="tag is-danger is-light">{this.props.user.userName}</span>
          {' '}
          <span className="tag is-success is-light">{this.props.message}</span>
          <br/>
          {item.item.title}
        </span>
      </div>
    );
  }

  render() {
    return (
      <div className="chatMessage">
        {this.isPlaylistItemAddedMessage() ? this.renderPlaylistItemAdded() : this.renderMessage()}
      </div>
    )
  }
}