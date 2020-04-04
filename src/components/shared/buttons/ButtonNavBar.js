import React from 'react';

const ButtonNavBar = props => {
  return (
    <button
      type="button"
      className="btn btn-default navbar-btn"
      style={buttonStyle}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

const buttonStyle = {
  marginRight: '10px'
};

export default ButtonNavBar;
