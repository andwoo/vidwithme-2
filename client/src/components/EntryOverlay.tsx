import * as React from 'react';
import GenericOverlay from './GenericOverlay';
import { Store } from '../redux/Store';
import CreateRoomOverlay from './CreateRoomOverlay';
import JoinRoomOverlay from './JoinRoomOverlay';

export default class EntryOverlay extends React.Component<Store> {

  isCreateRoomRequested = () => {
    return !(this.props.room.redirect_id && this.props.room.redirect_id.length > 0);
  }

  render() {
    return (
      <GenericOverlay
        overlayType="success"
        title={"Create Or Join Room"}
        showCloseButton={false}>
          {this.isCreateRoomRequested() ? <CreateRoomOverlay {...this.props}/> : <JoinRoomOverlay roomId={this.props.room.redirect_id} {...this.props}/>}
      </GenericOverlay>
    );
  }
}