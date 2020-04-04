import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TextArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: ''
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

  render() {
    return (
      <textarea id={this.props.id}
                name={this.props.name}
                className={this.props.className}
                onFocus={this.handleFocus.bind(this)}
                onBlur={this.handleBlur.bind(this)}
                placeholder={this.state.placeholder}
                defaultValue={this.props.defaultValue}>
      </textarea>
    );
  }
}

TextArea.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string
};

export default TextArea;
