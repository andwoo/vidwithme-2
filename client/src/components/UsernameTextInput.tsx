import * as React from 'react';

const MinCharacters : number = 1;
const MaxCharacters : number = 12;

interface UsernameTextInputProps {
  inProgress: boolean;
  value: string;
  onChange(string): void;
}

interface UsernameTextInputState {
  value: string;
  hasEnteredInput: boolean;
}

export default class UsernameTextInput extends React.PureComponent<UsernameTextInputProps, UsernameTextInputState> {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      hasEnteredInput: false
    };
  }
  componentDidUpdate(previousProps: UsernameTextInputProps): void {
    if (previousProps.value != this.props.value) {
      this.setState({ value: this.props.value });
    }
  }
  getIsLoadingClassName = () => {
    return this.props.inProgress ? 'is-loading' : '';
  }
  getIsValidClassName = () => {
    if(this.isValid()) {
      return ''
    } else if(this.state.hasEnteredInput && !this.isValid()) {
      return 'is-danger'
    }
    return ''
  }
  isValid = () => {
    return this.state.value && this.state.value.length >= MinCharacters && this.state.value.length < MaxCharacters;
  }
  handOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState(
      {
        value: event.target.value,
        hasEnteredInput: true
      },
      () => this.props.onChange(this.state.value),
    );
  };
  render(): JSX.Element {
    const isValidClassName = this.getIsValidClassName();
    return (
      <div className="field">
        <label className="label">Username</label>
        <div className={`control has-icons-left ${this.getIsLoadingClassName()} ${isValidClassName}`}>
          <input className={`input ${isValidClassName}`} type="text" placeholder="username" value={this.state.value} onChange={this.handOnChange}/>
          <span className="icon is-small is-left">
            <i className="fas fa-user"></i>
          </span>
        </div>
        {(this.state.hasEnteredInput && !this.isValid()) && <p className={`help ${isValidClassName}`}>{`Username must be between ${MinCharacters} and ${MaxCharacters} characters`}</p>}
      </div>
    );
  }
}