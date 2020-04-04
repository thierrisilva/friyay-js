import React from 'react';
import cx from 'classnames';
import Icon from 'Components/shared/Icon';

const OptionsDropdownButton = React.memo(
  ({
    children,
    className = 'more_vert',
    dropdownLeft,
    icon = 'more_vert',
    additionalClasses = 'dark-grey-icon-button',
    color
  }) => (
    <div className={cx('dropdown flex-r-center-center', className)}>
      <a
        className="grey-link dropdown"
        data-toggle="dropdown"
        role="button"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <Icon
          color={color}
          additionalClasses={cx('medium', additionalClasses)}
          icon={icon}
        />
      </a>

      <div
        className={cx('dropdown-menu', {
          'dropdown-menu-right': !dropdownLeft
        })}
        aria-labelledby="dropDown"
      >
        {children}
      </div>
    </div>
  )
);

export default OptionsDropdownButton;
