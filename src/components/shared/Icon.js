import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Icon = ({
  additionalClasses = '',
  containerClasses = '',
  color,
  fontAwesome,
  icon,
  size = ''
}) => {
  return (
    <div className={cx('icon-container', size, containerClasses)}>
      {icon == 'topic' && (
        <div
          style={{ color }}
          className={cx('revolving-toggle-button', additionalClasses)}
        />
      )}

      {icon != 'topic' && fontAwesome && (
        <i
          style={{ color }}
          className={cx('material-icons icon-fa', additionalClasses, size)}
        >
          <span className={cx('fa', `fa-${icon}`)} />
        </i>
      )}

      {icon != 'topic' && !fontAwesome && (
        <span
          style={{ color }}
          className={cx('tiphive-icon material-icons', additionalClasses, size)}
        >
          {icon}
        </span>
      )}
    </div>
  );
};

Icon.propTypes = {
  additionalClasses: PropTypes.string,
  icon: PropTypes.string.isRequired
};

export default Icon;
