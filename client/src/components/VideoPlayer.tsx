import * as React from 'react';
import ReactPlayer from 'react-player';
import { Store } from '../redux/Store';

export default class VideoPlayer extends React.Component<Store> {
  render () {
    let url : string = this.props.room.playlist.length > 0 ? this.props.room.playlist[0].url : '';
    return (
      <ReactPlayer
        url={url}
        playing={true}
        width="100%"
        height="calc(100% - 1rem)"
      />
    );
  }
}