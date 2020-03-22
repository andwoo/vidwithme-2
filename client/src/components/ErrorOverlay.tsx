import * as React from 'react';
import * as StoreModels from '../redux/interfaces/StoreModels';
import GenericOverlay from './GenericOverlay';

interface ErrorOverlayProps extends StoreModels.RoomError {
  onClose: () => void;
}

export default class ErrorOverlay extends React.PureComponent<ErrorOverlayProps> {
  handleOnClose = () => {
    this.props.onClose && this.props.onClose();
  }
  render() {
    return (
      <GenericOverlay
        overlayType="danger"
        title={this.props.title}
        showCloseButton={true}
        onClose={this.handleOnClose}>
          {this.props.description}
      </GenericOverlay>
    );
  }
}