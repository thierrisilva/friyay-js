import React from 'react';
import { any, bool, func, oneOfType, string } from 'prop-types';

import IconButton from './IconButton';

const ButtonMenuOpenDismiss = ({
  additionalClasses = '',
  dismissRight = false,
  isOpen = false,
  minimalistic = false,
  onClick,
  tooltip,
  color
}) =>
  minimalistic === false ? (
    <IconButton
      color={color}
      additionalClasses={additionalClasses}
      icon={isOpen ? (dismissRight ? 'chevron_right' : 'chevron_left') : 'menu'}
      onClick={onClick}
      tooltip={tooltip}
    />
  ) : (
    <div className="min-menu-bar" onClick={onClick} tooltip={tooltip} />
  );

ButtonMenuOpenDismiss.propTypes = {
  additionalClasses: string,
  dismissRight: bool,
  isOpen: oneOfType([bool, string]),
  minimalistic: bool,
  onClick: func.isRequired,
  tooltip: any
};

export default ButtonMenuOpenDismiss;
