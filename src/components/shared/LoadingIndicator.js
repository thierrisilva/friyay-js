import React from 'react';
import classNames from 'classnames';

const LoadingIndicator = ({ className, style }) => (
  <div
    className={classNames('loading-indicator-container', className)}
    style={style}
  >
    <img className="loader" src="/images/ajax-loader.gif" />
  </div>
);

export default LoadingIndicator;
