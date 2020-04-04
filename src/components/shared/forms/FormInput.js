import React from 'react';

const FormInput = ({
  additionalClasses,
  autoFocus,
  centreText,
  defaultValue,
  name,
  onBlur,
  onChange,
  onFocus,
  onSubmit,
  onKeyPress,
  onKeyDown,
  placeholder
}) => {
  const handleChange = e => {
    e.preventDefault();
    const value = e.target.value;
    onChange && onChange(value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit && onSubmit();
  };

  const classes = additionalClasses
    ? additionalClasses
    : 'form-inline full-width';

  return (
    <form className={`${classes}`} method="post" onSubmit={handleSubmit}>
      <input
        autoFocus={autoFocus}
        className={
          centreText
            ? 'form-control form-control-minimal form-input-box-center'
            : 'form-control form-control-minimal form-input-box-left full-width'
        }
        defaultValue={defaultValue}
        type="text"
        name={name || 'formInput'}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
        onKeyDown={onKeyDown}
        onChange={handleChange}
      />
    </form>
  );
};

export default FormInput;
