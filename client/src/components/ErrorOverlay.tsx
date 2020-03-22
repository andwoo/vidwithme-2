import * as React from 'react';
import * as StoreModels from '../redux/interfaces/StoreModels';

export default class ErrorOverlay extends React.Component<StoreModels.RoomError> {
  render () {
    return (
      <div className="error">
        <div className="content">
          <h2>{this.props.title}</h2>
          <h3>{this.props.description}</h3>
        </div>
      </div>
    );
  }
}