import * as React from 'react';
import { Store } from '../redux/Store';
import { useHistory } from "react-router-dom";

interface HomeProps extends Store {
  history: any;
}

class HomeInternal extends React.Component<HomeProps> {
  componentDidUpdate(prevProps : Store) {
    if(this.props.room.id !== prevProps.room.id && (this.props.room.id && this.props.room.id.length > 0)) {
      this.props.history.push(`/${this.props.room.id}`);
    }
  }

  render() {
    return (
      <div>
        <p>HOME</p>
        <br/>
      </div>
    )
  }
}

export default function Home(store) {
  let history = useHistory();
  return <HomeInternal {...store} history={history}/>
}