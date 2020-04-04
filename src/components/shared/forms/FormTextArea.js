import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FormTextArea extends Component {

  handleChange = ( e ) => {
    e.preventDefault();
    const value = e.target.value;
    this.props.onChange( value );
  }

  render() {
    const { className, defaultValue, placeholder, onChange } = this.props;

    return (
      <textarea
        className={ className}
        placeholder={this.props.placeholder}
        defaultValue={this.props.defaultValue}
        onChange={ this.handleChange }>
      </textarea>
    );
  }
}

FormTextArea.propTypes = {
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string
};

export default FormTextArea;
