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
            {this.props.room.playlist.map((item: StoreModels.PlaylistItem, index: number) => <PlaylistItem key={index} {...item}/>)}
          </div>
        </div>
      </div>
    )
  }
}

class PlaylistItem extends React.PureComponent<StoreModels.PlaylistItem> {

  handleOnRemoveItem = () => {
    SignalRConnection.sendEvent('removePlaylistItem', this.props.uid);
  }

  getVendorIcon = () => {
    if(this.props.vendor === "youtube") {
      return "fab fa-youtube";
    }
    return "fas fa-question";
  }

  getVendorColour = () => {
    if(this.props.vendor === "youtube") {
      return "#c4302b";
    }
    return "#ffffff";
  }

  render() {
    return (
      <div className="playlistItem">
        <div className="container has-background-black-ter">
          <img src={this.props.thumbnail}/>
          <div style={{overflow: "hidden", textOverflow: "ellipsis"}}>
            <span className="has-text-light">
              {this.props.title}
            </span>
            <br/>
            <i className={this.getVendorIcon()} style={{color: this.getVendorColour()}}/>
          </div>
          <button className="delete" onClick={this.handleOnRemoveItem}/>
        </div>
      </div>
    )
  }
}