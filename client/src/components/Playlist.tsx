//SignalRConnection.sendEvent('joinRoom', targetId);

import * as React from 'react';
import { Store } from '../redux/Store';
import * as StoreModels from '../redux/interfaces/StoreModels';

export default class Playlist extends React.Component<Store> {
  render () {
    return (
      <div className="playlist">
        {this.props.room.playlist.map((item: StoreModels.PlaylistItem, index: number) => <PlaylistItem key={index} {...item}/>)}
      </div>
    )
  }
}

//dark colour
class PlaylistItem extends React.PureComponent<StoreModels.PlaylistItem> {
  render() {
    return (
      <div className="playlistItem has-background-black-ter">
        <img src={this.props.thumbnail}/>
        <span className="has-text-light">
          {this.props.title}
        </span>
      </div>
    )
  }
}