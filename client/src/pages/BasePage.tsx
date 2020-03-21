import * as React from 'react';
import VideoPlayer from '../components/VideoPlayer';
import { Store } from '../redux/Store';
import * as StoreModels from '../redux/interfaces/StoreModels';

export default class BasePage extends React.Component<Store> {
  render() {
    return (
      <div>
        <VideoPlayer {...this.props}/>
        <div>{/* side bar */}
          <header>{/* nav bar */}</header>
          {this.props.room.errors.map((value: StoreModels.RoomError, index: number) => {
            return (<div key={index}>
              <h2>{value.title}</h2>
              <h3>{value.description}</h3>
            </div>)
          })}
          {this.props.children}
        </div>
      </div>
    )
  }
}