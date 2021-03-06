import * as React from 'react';
import GenericOverlay from './GenericOverlay';
import { Store } from '../redux/Store';
import UsernameTextInput from './UsernameTextInput';

interface CreateRoomOverlayProps extends Store {
}

interface CreateRoomOverlayState {
  userName: string;
  isUsernameValid: boolean;
}

export default class CreateRoomOverlay extends React.Component<CreateRoomOverlayProps, CreateRoomOverlayState> {
  private usernameInputRef: React.RefObject<UsernameTextInput>;
  
  constructor(props) {
    super(props);
    this.usernameInputRef = React.createRef();
    this.state = {
      userName: '',
      isUsernameValid: false
    }
  }

  componentDidUpdate(prevProps : Store) {
    if(!prevProps.connection.isUserDataSet && this.props.connection.isUserDataSet) {
      this.props.createRoom();
    }
  }

  handleOnSubmit = (event) => {
    if(event) {
      event.preventDefault();
    }
    this.props.setUserData({ userName: this.state.userName });
  }

  handleOnUserNameChange = (value : string) => {
    this.setState({
      userName: value,
      isUsernameValid: this.usernameInputRef.current.isValid()
    })
  }

  render() {
    const isInProgress = !this.props.connection.isConnected || 
                          this.props.connection.isUserDataSettingInProgress || 
                          this.props.room.isJoiningInProgress;

    return (
      <GenericOverlay
        overlayType=""
        title={"Create Room"}
        showCloseButton={false}>
          <fieldset disabled={isInProgress}>
            <form onSubmit={this.handleOnSubmit}>
              <UsernameTextInput ref={this.usernameInputRef} inProgress={isInProgress} value={this.state.userName} onChange={this.handleOnUserNameChange}/>
              <div className="field is-grouped">
                <div className={`control ${isInProgress ? 'is-loading' : ''}`}>
                  <button disabled={!this.state.isUsernameValid} className="button is-dark" onClick={this.handleOnSubmit}>Create Room</button>
                </div>
              </div>
            </form>
          </fieldset>
      </GenericOverlay>
    )
  }
}