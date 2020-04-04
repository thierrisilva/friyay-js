import React from 'react';
import { string } from 'prop-types';

const MaterialIconButton = ({
  additionalClasses = '',
  additionalIconClasses = '',
  icon,
  onClick
}) => (
  <a className={`grey-icon-button ${additionalClasses}`} onClick={onClick}>
    <span className={`material-icons ${additionalIconClasses}`}>{icon}</span>
  </a>
);

MaterialIconButton.propTypes = {
  additionalClasses: string,
  icon: string.isRequired
};

export default MaterialIconButton;
