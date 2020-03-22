import * as React from 'react';

interface GenericOverlayProps {
  overlayType: string; //dark, primary, link, info, success, warning, danger, 
  title: string;
  showCloseButton: boolean;
  onClose?: () => void;
}

export default class GenericOverlay extends React.PureComponent<GenericOverlayProps> {
  handleOnClose = () => {
    this.props.onClose && this.props.onClose();
  }
  render() {
    return (
      <div className="modal" style={{display: "inline-flex"}}>
        <div className="modal-background"></div>
        <article className={`modal-card message is-${this.props.overlayType}`}>
          <div className="message-header">
            <p>{this.props.title}</p>
            {this.props.showCloseButton && <button className="delete" aria-label="delete" onClick={this.handleOnClose}/>}
          </div>
          <div className="message-body">
            {this.props.children}
          </div>
        </article>
      </div>
    );
  }
}