import * as React from 'react';
import GenericOverlay from './GenericOverlay';
import { Store } from '../redux/Store';
import UsernameTextInput from './UsernameTextInput';

interface JoinRoomOverlayProps extends Store {
  roomId: string;
}

interface JoinRoomOverlayState {
  userName: string;
  inProgress: boolean;
  isValid: boolean;
}

export default class JoinRoomOverlay extends React.PureComponent<JoinRoomOverlayProps, JoinRoomOverlayState> {

  private textInputRef: React.RefObject<UsernameTextInput>;
  
  constructor(props) {
    super(props);
    this.textInputRef = React.createRef();
    this.state = {
      inProgress: false,
      userName: '',
      isValid: false
    }
  }

  componentDidUpdate(prevProps : Store) {
    if(!prevProps.connection.isUserDataSet && this.props.connection.isUserDataSet) {
      this.props.joinRoom(this.props.roomId);
    }
  }

  handleOnSubmit = (event) => {
    if(event) {
      event.preventDefault();
    }
    this.setState({inProgress: true}, () => {
      this.props.setUserData({ userName: this.state.userName });
    });
  }

  handleOnUserNameChange = (value : string) => {
    this.setState({
      userName: value,
      isValid: this.textInputRef.current.isValid()
    })
  }

  render() {
    return (
      <GenericOverlay
        overlayType="success"
        title={"Join Room"}
        showCloseButton={false}>
          <fieldset disabled={this.state.inProgress}>
            <form onSubmit={this.handleOnSubmit}>
              <UsernameTextInput ref={this.textInputRef} inProgress={this.state.inProgress} value={this.state.userName} onChange={this.handleOnUserNameChange}/>
              <div className="field is-grouped">
                <div className={`control ${this.state.inProgress ? 'is-loading' : ''}`}>
                  <button disabled={!this.state.isValid} className="button is-success" onClick={this.handleOnSubmit}>Join Room</button>
                </div>
              </div>
            </form>
          </fieldset>
      </GenericOverlay>
    )
  }
}