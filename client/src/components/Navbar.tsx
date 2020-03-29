import * as React from 'react';
import { Store } from '../redux/Store';

const easeTimeMS: number = 210;
const pauseTimeMS: number = 1000;

interface NavbarState {
  clipboardInprogress: boolean;
  clipboardOpacity: number;
  clipboardText: string;
}

export default class Navbar extends React.Component<Store, NavbarState> {
  constructor(props) {
    super(props);
    this.state = {
      clipboardInprogress: false,
      clipboardOpacity: 1,
      clipboardText: 'Invite'
    }
  }
  
  startClipboardCopySequence = () => {
    if(this.state.clipboardInprogress) {
      return;
    }
    this.setState({clipboardInprogress: true, clipboardOpacity: 0}, () => {

      setTimeout(() => {
        this.setState({
          clipboardOpacity: 1,
          clipboardText: 'Copied'
        });
      }, easeTimeMS);

      setTimeout(() => {
        this.setState({
          clipboardOpacity: 0,
        });
      }, easeTimeMS + pauseTimeMS);

      setTimeout(() => {
        this.setState({
          clipboardOpacity: 1,
          clipboardText: 'Invite',
          clipboardInprogress: false
        });
      }, (easeTimeMS * 2) + pauseTimeMS);
    });
  }

  isInRoom = () : boolean => {
    return this.props.room.id && this.props.room.id.length > 0;
  }

  isCopySupported = () : boolean => {
    return this.isInRoom() && !!navigator.clipboard;
  }

  handleCopyRoomUrl = () => {
    navigator.clipboard.writeText(`${location.protocol}//${location.host}/${this.props.room.id}`);
    this.startClipboardCopySequence();
  }

  renderRoomInformation = () => {
    if(!this.isInRoom()) {
      return null;
    } else if(this.isCopySupported()) {
      return (
        <a className="clipboard is-family-monospace" onClick={this.handleCopyRoomUrl}>
          <span style={{opacity: this.state.clipboardOpacity}}>{`${this.state.clipboardText} `}</span>
          <i className="far fa-clipboard"/>
        </a>
      )
    } else {
      return (
        <span className="is-size-4 is-family-monospace has-text-danger roomId">{this.props.room.id}</span>
      )
    }
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
        <div className="column has-text-right has-text-grey-light navbar--right">
          {this.renderRoomInformation()}
        </div>
      </div>
    );
  }
}