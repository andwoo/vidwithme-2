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
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{this.props.title}</p>
            <button className="delete" aria-label="close" onClick={this.handleOnClose}></button>
          </header>
          <section className="modal-card-body">
            {this.props.description}
          </section>
          <footer className="modal-card-foot"></footer>
        </div>
      </div>
    );
  }
}