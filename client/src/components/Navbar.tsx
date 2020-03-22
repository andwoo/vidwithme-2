import * as React from 'react';
import { Store } from '../redux/Store';

export default class Navbar extends React.Component<Store> {
  render () {
    return (
      <div className="columns is-gapless is-mobile has-background-white navbar">
        <div className="column is-half has-text-left navbar--left">
          <img src="/images/logo.svg" className="logo" />
        </div>
        <div className="column is-half has-text-right navbar--right">
          <span className="is-size-4 is-family-monospace has-text-danger roomId">{this.props.room.id}</span>
        </div>
      </div>
    );
  }
}