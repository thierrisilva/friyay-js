import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import withPlanTabLink from './withPlanTabLink';

function CardWorkEstimationLabel({
  card,
  className,
  hideOnUndefinedValue,
  onClick,
  showTooltip,
  showValue
}) {
  const containerClassNames = classNames(
    className,
    'card-work-estimation-label',
    'link-tooltip-container'
  );
  const hours = Number(card.attributes.resource_required) || 0;
  const renderControl = hours > 0 || hideOnUndefinedValue !== true;

  return (
    renderControl && (
      <div className={containerClassNames} onClick={onClick}>
        <span className="card-work-estimation-label__icon fa fa-wrench fa-lg" />
        {showTooltip && (
          <div className="card-work-estimation-label__tooltip link-tooltip bottom">
            {hours ? `Work estimation - ${hours} hours` : 'Work estimation'}
          </div>
        )}
        {showValue && !!hours && (
          <div className="card-work-estimation-label__value">{hours} h</div>
        )}
      </div>
    )
  );
}

CardWorkEstimationLabel.propTypes = {
  card: PropTypes.object,
  className: PropTypes.string,
  hideOnUndefinedValue: PropTypes.bool,
  showTooltip: PropTypes.bool,
  showValue: PropTypes.bool,
  onClick: PropTypes.func
};

export default withPlanTabLink(CardWorkEstimationLabel);
