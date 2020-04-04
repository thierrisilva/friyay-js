import React, { Component } from 'react';

class InputWithHiddenLabel extends Component {
  // --- TODO: MAKE THIS NOT ALL ABOUT THE DATEPICKER --
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      placeholder: '',
      labelClass: 'hide'
    };
  }

  componentDidMount() {

    if (this.props.placeholder) {
      this.setState({
        placeholder: this.props.placeholder
      });
    }
  }

  handleFocus() {
    this.setState({
      placeholder: ''
    });
  }

  handleBlur() {
    if (this.props.placeholder) {
      this.setState({
        placeholder: this.props.placeholder
      });
    }
  }

  handleChange(event) {
    var value = event.target.value;

    if (value) {
      this.setState({
        value: value,
        labelClass: ''
      });

      return;
    }

    this.setState({
      value: value,
      labelClass: 'hide'
    });
  }

  render() {
    const { type, id, name, className, autoComplete, tabIndex, labelText } = this.props;
    const { defaultValue, required } = this.props;

    return (
      <div>
        <label htmlFor={id} id='tip-expiration-label' className={this.state.labelClass}>
          {labelText}
        </label>

        <input value={this.state.value}
               type={type}
               id={id}
               name={name}
               className={className}
               placeholder={this.state.placeholder}
               autoComplete={autoComplete}
               defaultValue={defaultValue}
               required={required}
               tabIndex={tabIndex}
               onFocus={this.handleFocus.bind(this)}
               onBlur={this.handleBlur.bind(this)}
               onChange={this.handleChange.bind(this)}
        />
      </div>
    );
  }
}

export default InputWithHiddenLabel;
