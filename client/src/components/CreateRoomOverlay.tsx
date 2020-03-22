import * as React from 'react';
import GenericOverlay from './GenericOverlay';
import { Store } from '../redux/Store';
import UsernameTextInput from './UsernameTextInput';

interface CreateRoomOverlayProps extends Store {
}

interface CreateRoomOverlayState {
  userName: string;
  inProgress: boolean;
  isUsernameValid: boolean;
}

export default class CreateRoomOverlay extends React.PureComponent<CreateRoomOverlayProps, CreateRoomOverlayState> {

  private usernameInputRef: React.RefObject<UsernameTextInput>;
  
  constructor(props) {
    super(props);
    this.usernameInputRef = React.createRef();
    this.state = {
      inProgress: false,
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
    this.setState({inProgress: true}, () => {
      this.props.setUserData({ userName: this.state.userName });
    });
  }

  handleOnUserNameChange = (value : string) => {
    this.setState({
      userName: value,
      isUsernameValid: this.usernameInputRef.current.isValid()
    })
  }

  render() {
    return (
      <GenericOverlay
        overlayType="success"
        title={"Create Room"}
        showCloseButton={false}>
          <fieldset disabled={this.state.inProgress}>
            <form onSubmit={this.handleOnSubmit}>
              <UsernameTextInput ref={this.usernameInputRef} inProgress={this.state.inProgress} value={this.state.userName} onChange={this.handleOnUserNameChange}/>
              <div className="field is-grouped">
                <div className={`control ${this.state.inProgress ? 'is-loading' : ''}`}>
                  <button disabled={!this.state.isUsernameValid} className="button is-success" onClick={this.handleOnSubmit}>Create Room</button>
                </div>
              </div>
            </form>
          </fieldset>
      </GenericOverlay>
    )
  }
}