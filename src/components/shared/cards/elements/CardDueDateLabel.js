import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import withPlanTabLink from './withPlanTabLink';

function CardDueDateLabel({
  card,
  className,
  dateFormat = 'DD MMM',
  hideOnUndefinedValue,
  onClick,
  showTooltip,
  showValue
}) {
  const containerClassNames = classNames(
    className,
    'card-due-date-label',
    'link-tooltip-container'
  );
  const dateValue = card.attributes.due_date;
  const dueDate = dateValue ? moment(dateValue).format(dateFormat) : null;
  const renderControl = !!dueDate || hideOnUndefinedValue !== true;

  return (
    renderControl && (
      <div className={containerClassNames} onClick={onClick}>
        <span className="card-due-date-label__icon fa fa-calendar fa-lg" />
        {showTooltip && (
          <div className="card-due-date-label__tooltip link-tooltip bottom">
            {dueDate ? `Due date - ${dueDate}` : 'Due date'}
          </div>
        )}
        {showValue && !!dueDate && (
          <div className="card-due-date-label__value">{dueDate}</div>
        )}
      </div>
    )
  );
}

CardDueDateLabel.propTypes = {
  card: PropTypes.object,
  className: PropTypes.string,
  dateFormat: PropTypes.string,
  hideOnUndefinedValue: PropTypes.bool,
  showTooltip: PropTypes.bool,
  showValue: PropTypes.bool,
  onClick: PropTypes.func
};

export default withPlanTabLink(CardDueDateLabel);
