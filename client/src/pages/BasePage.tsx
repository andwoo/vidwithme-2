import * as React from 'react';
import { Store } from '../redux/Store';
import * as StoreModels from '../redux/interfaces/StoreModels';
import VideoPlayer from '../components/VideoPlayer';
import Navbar from '../components/Navbar';

export default class BasePage extends React.Component<Store> {
  render() {
    return (
      <div className="columns is-gapless root">
        <div className="column video">
          <VideoPlayer {...this.props}/>
        </div>
        <div className="column is-one-quarter sidebar">
          <div className="columns is-gapless is-multiline">
            <div className="column is-full">
              <Navbar {...this.props}/>
            </div>
            <div className="column is-full content">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}