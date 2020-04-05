//SignalRConnection.sendEvent('joinRoom', targetId);

import * as React from 'react';
import { Store } from '../redux/Store';
import * as StoreModels from '../redux/interfaces/StoreModels';

export default class Playlist extends React.Component<Store> {
  render () {
    return (
      <div className="playlist" data-simplebar>
        <div style={{whiteSpace: "nowrap"}}>
          <div style={{display: "flex", flexDirection: "row"}}>
            {this.props.room.playlist.map((item: StoreModels.PlaylistItem, index: number) => <PlaylistItem key={index} {...item}/>)}
          </div>
        </div>
      </div>
    )
  }
}

//dark colour
class PlaylistItem extends React.PureComponent<StoreModels.PlaylistItem> {
  render() {
    return (
      <div className="playlistItem">
        <div className="container has-background-black-ter">
          <img src={this.props.thumbnail}/>
          <span className="has-text-light" style={{overflow: "hidden",
  textOverflow: "ellipsis"}}>
            {this.props.title}
          </span>
        </div>
      </div>
    )
  }
}