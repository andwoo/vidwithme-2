import * as React from 'react';
import GenericOverlay from './GenericOverlay';
import { Store } from '../redux/Store';

interface EntryOverlayState {
  userName: string;
  roomId: string;
  isCreatingRoom: boolean;
  inProgress: boolean;
}

export default class EntryOverlay extends React.Component<Store, EntryOverlayState> {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      roomId: '',
      isCreatingRoom: false,
      inProgress: false
    };
  }

  componentDidUpdate(prevProps : Store) {
    if(!prevProps.connection.isUserDataSet && this.props.connection.isUserDataSet) {
      if(this.state.isCreatingRoom) {
        this.props.createRoom();
      } else {
        this.props.joinRoom(this.state.roomId);
      }
    }
  }

  handleOnCreateRoom = (event) => {
    if(event) {
      event.preventDefault();
    }
    this.setState({inProgress: true, isCreatingRoom: true});
    this.props.setUserData({
      userName: this.state.userName
    });
  }

  handleOnJoinRoom = (event) => {
    if(event) {
      event.preventDefault();
    }
    this.setState({inProgress: true, isCreatingRoom: false});
    this.props.setUserData({
      userName: this.state.userName
    });
  }

  handleOnJoinRedirectRoom = (event) => {
    if(event) {
      event.preventDefault();
    }
    this.setState({inProgress: true, roomId: this.props.room.redirect_id, isCreatingRoom: false});
    this.props.setUserData({
      userName: this.state.userName
    });
  }

  getIsLoadingClassName = () => {
    return this.isRequestInProgress() ? 'is-loading' : '';
  }

  isRequestInProgress = () => {
    return !this.props.connection.isConnected || 
            this.props.connection.isUserDataSettingInProgress || 
            this.props.room.isJoiningInProgress || 
            this.state.inProgress;
  }

  isCreateRoomRequested = () => {
    return !(this.props.room.redirect_id && this.props.room.redirect_id.length > 0);
  }

  renderUserDataForm = () => {
    return (
      <div className="field">
        <label className="label">Username</label>
        <div className={`control has-icons-left has-icons-right ${this.getIsLoadingClassName()}`}>
          <input className="input is-success" type="text" placeholder="username" value={this.state.userName} onChange={(event) => this.setState({userName: event.target.value})}/>
          <span className="icon is-small is-left">
            <i className="fas fa-user"></i>
          </span>
        </div>
      </div>
    );
  }

  renderCreateOrJoinRoomForm = () => {
    return (
      <form onSubmit={this.handleOnCreateRoom}>
        {this.renderUserDataForm()}

        <div className="field">
          <label className="label">Room ID</label>
          <div className={`control has-icons-left has-icons-right ${this.getIsLoadingClassName()}`}>
            <input className="input is-success" type="text" placeholder="QXdHn" value={this.state.roomId} onChange={(event) => this.setState({roomId: event.target.value})}/>
            <span className="icon is-small is-left">
              <i className="fas fa-hashtag"></i>
            </span>
          </div>
        </div>

        <div className="field is-grouped">
          <div className={`control ${this.getIsLoadingClassName()}`}>
            <button className="button is-success" onClick={this.handleOnCreateRoom}>Create Room</button>
          </div>
          <div className={`control ${this.getIsLoadingClassName()}`}>
            <button className="button is-success is-outlined" onClick={this.handleOnJoinRoom}>Join Room</button>
          </div>
        </div>
      </form>
    )
  }

  renderJoinRoomForm = () => {
    return (
      <form onSubmit={this.handleOnJoinRoom}>
        {this.renderUserDataForm()}

        <div className="field is-grouped">
          <div className={`control ${this.getIsLoadingClassName()}`}>
            <button className="button is-success" onClick={this.handleOnJoinRedirectRoom}>Join Room</button>
          </div>
        </div>
      </form>
    )
  }

  composeWithDisable = (child) => {
    return this.isRequestInProgress() ? (
      <fieldset disabled>
        {child}
      </fieldset>
    ) : child;
  }

  render() {
    return (
      <GenericOverlay
        overlayType="success"
        title={"Create Or Join Room"}
        showCloseButton={false}>
          {this.isCreateRoomRequested() ? this.composeWithDisable(this.renderCreateOrJoinRoomForm()) : this.composeWithDisable(this.renderJoinRoomForm())}
      </GenericOverlay>
    );
  }
}