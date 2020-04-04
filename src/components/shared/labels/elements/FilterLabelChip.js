import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

function FilterLabelChip({
  className,
  color,
  isStretching,
  title,
  onRemoveClick
}) {
  const chipBaseClass = 'filter-label-chip';
  const chipClassNames = classNames(className, chipBaseClass, {
    [`${chipBaseClass}--color-${color}`]: !!color,
    [`${chipBaseClass}--stretching`]: isStretching
  });

  return (
    <div className={chipClassNames}>
      <span className="filter-label-chip__title">{title}</span>
      {onRemoveClick && (
        <button className="filter-label-chip__remove" onClick={onRemoveClick}>
          <i className="glyphicon glyphicon-remove" />
        </button>
      )}
    </div>
  );
}

FilterLabelChip.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  isStretching: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onRemoveClick: PropTypes.func
};

FilterLabelChip.defaultProps = { color: '' };

export default FilterLabelChip;
