import * as React from 'react';
import { hot } from 'react-hot-loader';

import { Store } from './redux/Store';

class App extends React.Component<Store> {
  onClickButton(): void {
    this.props.TestAction('NEW CONTENT');
  }

  render(): JSX.Element {
    return (
      <div>
        <p>Howdy Yall!</p>
        <p>{this.props.testObject.name}</p>
        <button className="button" onClick={(): void => this.onClickButton()}>
          Click this
        </button>
      </div>
    );
  }
}

export default hot(module)(App);
