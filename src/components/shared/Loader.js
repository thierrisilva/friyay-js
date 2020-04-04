import React from 'react';
import PropTypes from 'prop-types';

const Loader = ({ isLoading, small }) => {
  if (isLoading) {
    const url = small ? '/images/ajax-loader-small.gif' : '/images/ajax-loader.gif';
    return <img className="loader" src={url} />;
  }

  return null;
};

Loader.propTypes = {
  isLoading: PropTypes.bool,
  small: PropTypes.bool,
};

Loader.defaultProps = {
  isLoading: true,
  small: false
};

export default Loader;