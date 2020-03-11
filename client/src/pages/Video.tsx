import * as React from 'react';
import { Store } from '../redux/Store';
import { useParams } from "react-router-dom";

interface VideoProps extends Store {
  roomId: string;
}

class VideoInternal extends React.Component<VideoProps> {
  render() {
    return (
      <div>{`VIDEO - ${this.props.roomId}`}</div>
    )
  }
}

export default function Video(store) {
  let { room_id } = useParams();
  return <VideoInternal {...store} roomId={room_id}/>
}
