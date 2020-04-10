import * as React from 'react';
import ReactPlayer from 'react-player';
import { Store } from '../redux/Store';
import * as StoreModels from '../redux/interfaces/StoreModels';
import SignalRConnection from '../signalr/SignalRConnection';

interface VideoPlayerState {
  url : string;
  isPlaying: boolean;
}

export default class VideoPlayer extends React.Component<Store, VideoPlayerState> {
  private videoPlayerRef : React.RefObject<ReactPlayer>;
  private ignoreVideoEnd : boolean;
  private videoEndTimeout : NodeJS.Timeout;

  constructor(props) {
    super(props);
    this.videoPlayerRef = React.createRef();
    this.ignoreVideoEnd = false;
    this.state = {
      url: '',
      isPlaying: false
    }
  }

  componentDidUpdate(prevProps : Store) {
    const currentActiveVideo : StoreModels.PlaylistItem = this.getActivePlaylistItemForStore(this.props);
    if(!currentActiveVideo) {
      if( this.state.url !== '') {
        this.ignoreVideoEnd = false;
        this.setState({
          url: '',
          isPlaying: false
        });
      }
      return;
    }

    const previousActiveVideo : StoreModels.PlaylistItem = this.getActivePlaylistItemForStore(prevProps);
    if(!previousActiveVideo || previousActiveVideo.uid !==  currentActiveVideo.uid) {
      this.ignoreVideoEnd = true;
      clearTimeout(this.videoEndTimeout);
      this.videoEndTimeout = setTimeout(() => {
        this.ignoreVideoEnd = false;
      }, 3000);

      this.setState({
        url: `https://www.youtube.com/watch?v=${currentActiveVideo.videoId}`,
        isPlaying: currentActiveVideo.isPlaying
      }, () => {
        this.videoPlayerRef.current && this.videoPlayerRef.current.seekTo(currentActiveVideo.startTime, 'seconds');
      });
      return;
    }

    if(previousActiveVideo.isPlaying !== currentActiveVideo.isPlaying) {
      this.setState({
        isPlaying: currentActiveVideo.isPlaying
        }, () => {
          this.videoPlayerRef.current && this.videoPlayerRef.current.seekTo(currentActiveVideo.startTime, 'seconds');
        }
      );
      return;
    }
  }

  getActivePlaylistItemForStore = (store : Store): StoreModels.PlaylistItem => {
    if(store.room.playlist && store.room.playlist.length > 0) {
      return store.room.playlist[0];
    }
    return null;
  }

//EVENTS FROM VIDEO PLAYER
  handleLocalVideoPause = () => {
    const currentActiveVideo : StoreModels.PlaylistItem = this.getActivePlaylistItemForStore(this.props);
    if(!currentActiveVideo || !this.state.isPlaying && !currentActiveVideo.isPlaying) {
      return;
    }

    if(this.state.isPlaying) {
      const seekSeconds : number = this.videoPlayerRef.current && this.videoPlayerRef.current.getCurrentTime();
      SignalRConnection.sendEvent('pauseVideo', currentActiveVideo.uid, seekSeconds);
    }
  }

  handleLocalVideoResume = () => {
    const currentActiveVideo : StoreModels.PlaylistItem = this.getActivePlaylistItemForStore(this.props);
    if(!currentActiveVideo || this.state.isPlaying && currentActiveVideo.isPlaying) {
      return;
    }

    if(!this.state.isPlaying) {
      const seekSeconds : number = this.videoPlayerRef.current && this.videoPlayerRef.current.getCurrentTime();
      SignalRConnection.sendEvent('resumeVideo', currentActiveVideo.uid, seekSeconds);
    }
  }

  handleLocalVideoComplete = () => {
    const currentActiveVideo : StoreModels.PlaylistItem = this.getActivePlaylistItemForStore(this.props);
    if(this.ignoreVideoEnd || !currentActiveVideo) {
      // console.log(`short circuit video end`);
      return;
    }
    SignalRConnection.sendEvent('completeVideo', currentActiveVideo.uid);
  }
  
  render () {
    return (
      <ReactPlayer
        ref={this.videoPlayerRef}
        url={this.state.url}
        playing={this.state.isPlaying}
        controls={true}
        onPlay={this.handleLocalVideoResume}
        onPause={this.handleLocalVideoPause}
        onEnded={this.handleLocalVideoComplete}
        width="100%"
        height="calc(100% - 5rem)"
      />
    );
  }
}