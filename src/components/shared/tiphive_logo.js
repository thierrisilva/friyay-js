import React from 'react';
import PropTypes from 'prop-types';

function TipHiveLogo(props) {
  let { className } = props;

  return (
    <a href="https://www.friyay.io/" className={className}>
      <img src="/images/Friyay-Logo-01.png" height="90" />
    </a>
  );
}

TipHiveLogo.propTypes = {
  className: PropTypes.string
};

export default TipHiveLogo;
