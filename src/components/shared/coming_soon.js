import React from 'react';
import PropTypes from 'prop-types';

const ComingSoon = ({logo = '', msg}) => {
  return (
    <div className="coming-soon">
      <h3>Coming Soon...{msg}</h3> <img src={'/images/' + logo} />
    </div>
  );
};

ComingSoon.propTypes = {
  logo: PropTypes.string,
  msg: PropTypes.string,
};

export default ComingSoon;
