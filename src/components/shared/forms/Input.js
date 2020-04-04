import React from 'react';
import PropTypes from 'prop-types';

const Input = ({
  type,
  id,
  name,
  className,
  autoComplete,
  tabIndex,
  defaultValue,
  required,
  onChange,
  placeholder
}) => (
  <input
    type={type}
    id={id}
    name={name}
    className={className}
    placeholder={placeholder}
    autoComplete={autoComplete}
    defaultValue={defaultValue}
    required={required}
    tabIndex={tabIndex}
    onFocus={({ target }) => {
      target.placeholder = '';
      target.selectionStart = target.selectionEnd = target.value.length;
      target.setSelectionRange(target.value.length, target.value.length);
      target.scrollLeft = target.scrollWidth;
    }}
    onBlur={({ target }) => {
      target.placeholder = placeholder;
    }}
    onChange={onChange}
  />
);

Input.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  autoComplete: PropTypes.string,
  tabIndex: PropTypes.number,
  defaultValue: PropTypes.any,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.string
};

Input.defaultProps = {
  type: 'text',
  autoComplete: 'off',
  tabIndex: 1,
  required: false,
  placeholder: ''
};

export default Input;
