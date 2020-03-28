import * as React from 'react';
import { Store } from '../redux/Store';

export default class Navbar extends React.Component<Store> {

  isInRoom = () : boolean => {
    return this.props.room.id && this.props.room.id.length > 0;
  }
  isCopySupported = () : boolean => {
    return this.isInRoom() && !!navigator.clipboard;
  }

  handleCopyRoomUrl = () => {
    navigator.clipboard.writeText(`${location.protocol}//${location.host}/${this.props.room.id}`);
  }

  renderClipboard = () => {
    if(this.isCopySupported()) {
      return (
        <i onClick={this.handleCopyRoomUrl} className="far fa-clipboard clipboard"/>
      );
    }
    return null;
  }

  render () {
    return (
      <div className="columns is-gapless is-mobile has-background-white navbar">
        <div className="column is-narrow has-text-left navbar--left">
          <img src="/images/logo.svg" className="logo" />
        </div>
        <div className="column has-text-left navbar--center">
          <span className="vid--text">Vid</span>
          <span className="withme--text">With.me</span>
        </div>
        <div className="column has-text-right navbar--right">
          <span className="is-size-4 is-family-monospace has-text-danger roomId">{this.props.room.id}</span>
          {this.renderClipboard()}
        </div>
      </div>
    );
  }
}