import * as React from 'react';
import { Store } from '../redux/Store';
import * as StoreModels from '../redux/interfaces/StoreModels';
import SignalRConnection from '../signalr/SignalRConnection';

export default class Playlist extends React.Component<Store> {
  render () {
    return (
      <div className="playlist" data-simplebar>
        <div style={{whiteSpace: "nowrap"}}>
          <div style={{display: "flex", flexDirection: "row"}}>
            {this.props.room.playlist.map((item: StoreModels.PlaylistItem, index: number) => <PlaylistItem key={index} item={item} isNowPlaying={index === 0}/>)}
          </div>
        </div>
      </div>
    )
  }
}

interface PlaylistItemProps {
  item: StoreModels.PlaylistItem;
  isNowPlaying: boolean;
}

class PlaylistItem extends React.PureComponent<PlaylistItemProps> {

  handleOnRemoveItem = () => {
    SignalRConnection.sendEvent('removePlaylistItem', this.props.item.uid);
  }

  getVendorIcon = () => {
    if(this.props.item.vendor === "youtube") {
      return "fab fa-youtube";
    }
    return "fas fa-question";
  }

  getVendorColour = () => {
    if(this.props.item.vendor === "youtube") {
      return "#c4302b";
    }
    return "#ffffff";
  }

  render() {
    return (
      <div className="playlistItem">
        <div className={`container ${this.props.isNowPlaying ? 'has-background-grey-dark' : 'has-background-black-ter'}`}>
          <img src={this.props.item.thumbnail}/>
          <div className="has-text-light" style={{overflow: "hidden", textOverflow: "ellipsis"}}>
            <span>
              {this.props.item.title}
            </span>
            <br/>
            <i className={this.getVendorIcon()} style={{color: this.getVendorColour()}}/>
            <span>{this.props.isNowPlaying ? ' PLAYING' : ''}</span>
          </div>
          <button className="delete" onClick={this.handleOnRemoveItem}/>
        </div>
      </div>
    )
  }
}