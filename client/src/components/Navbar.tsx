import * as React from 'react';
import { Store } from '../redux/Store';

export default class Navbar extends React.Component<Store> {
  render () {
    return (
      <div className="navbar">
        <h3>{this.props.room.id}</h3>
      </div>
    );
  }
}