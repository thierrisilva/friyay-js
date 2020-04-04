import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const options = [null, 'Lowest', 'Low', 'Medium', 'High', 'Highest'];

function CardPriorityControl({ className, value, onChange }) {
  const controlClassNames = classNames(className, 'card-priority-control');
  const activeOptionIndex = options.findIndex(opt => opt == value);

  return (
    <div className={controlClassNames}>
      <div className="card-priority-control__options">
        {options.map((option, index) => {
          const isActive = index === activeOptionIndex;
          const isDefault = index === 0;
          const optionClassNames = classNames(
            'card-priority-control__option',
            'material-icons',
            {
              'card-priority-control__option--active': isActive,
              'card-priority-control__option--default': isDefault
            }
          );

          return (
            <React.Fragment key={option}>
              <span
                className={optionClassNames}
                onClick={() => onChange(option)}
              >
                {isDefault ? 'clear' : 'flag'}
              </span>
              <span className="card-priority-control__hint">
                {isDefault ? 'Unset' : option}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

CardPriorityControl.propTypes = {
  className: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired
};

CardPriorityControl.defaultProps = { className: '' };

export default CardPriorityControl;
