import * as React from 'react';
import * as StoreModels from '../redux/interfaces/StoreModels';

interface ErrorOverlayProps extends StoreModels.RoomError {
  onClose: () => void;
}

export default class ErrorOverlay extends React.Component<ErrorOverlayProps> {
  constructor(props) {
    super(props);
    console.dir(props);
  }
  handleOnClose = () => {
    this.props.onClose && this.props.onClose();
  }
  render() {
    return (
      <div className="modal" style={{display: "inline-flex"}}>
        <div className="modal-background"></div>
        <article className="modal-card message is-danger">
          <div className="message-header">
            <p>{this.props.title}</p>
            <button className="delete" aria-label="delete" onClick={this.handleOnClose}></button>
          </div>
          <div className="message-body">
            {this.props.description}
          </div>
        </article>
      </div>
    );
  }
}