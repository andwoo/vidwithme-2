import * as React from 'react';
import ReactPlayer from 'react-player';
import { Store } from '../redux/Store';
import Playlist from './Playlist';

export default class VideoPlayer extends React.Component<Store> {
  
  render () {
    let videoId : string = this.props.room.playlist.length > 0 ? this.props.room.playlist[0].videoId : '';
    return (
      <React.Fragment>
        <ReactPlayer
          url={`https://www.youtube.com/watch?v=${videoId}`}
          playing={true}
          width="100%"
          height="calc(100% - 5rem)"
        />
        <Playlist {...this.props} />
      </React.Fragment>
    );
  }
}