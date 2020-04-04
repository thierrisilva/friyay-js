import React from 'react';
import { func, string, object } from 'prop-types';
import Icon from 'Components/shared/Icon';
import Tooltip from 'Components/shared/Tooltip';

const IconButton = ({
  style,
  wrapperClasses,
  containerClasses,
  additionalClasses = '',
  additionalIconClasses = '',
  color,
  fontAwesome,
  icon,
  onClick,
  tooltip = null,
  showBadge = false,
  tooltipOptions
}) => {
  const forId = Math.ceil(Math.random() * 100000, 6);
  return (
    <a
      style={style}
      data-tip={tooltip}
      data-for={forId}
      className={`${additionalClasses} ${wrapperClasses}`}
      onClick={onClick}
    >
      {icon === 'android' && showBadge && (
        <span className="badge-indicator-bot badge">&nbsp;</span>
      )}
      <Icon
        containerClasses={containerClasses}
        additionalClasses={additionalClasses}
        additionalIconClasses={additionalIconClasses}
        color={color}
        fontAwesome={fontAwesome}
        icon={icon}
      />
      <Tooltip {...tooltipOptions} id={forId} />
    </a>
  );
};

IconButton.propTypes = {
  style: object,
  additionalClasses: string,
  additionalIconClasses: string,
  icon: string.isRequired,
  onClick: func
};

export default IconButton;
