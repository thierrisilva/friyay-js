import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const CONFIDENT_EMOJI = '😊';
const CONFUSED_EMOJI = '😕';

const options = [null, 20, 40, 60, 80, 100];

function ConfidenceRange({ className, compactView, value, onChange }) {
  const controlClassNames = classNames('confidence-range', className, {
    'confidence-range--compact': compactView
  });
  const activeOptionIndex = options.findIndex(opt => opt == (value || null));

  return (
    <div className={controlClassNames}>
      <div className="confidence-range__wrapper">
        <div className="confidence-range__emoji">{CONFUSED_EMOJI}</div>
        <div className="confidence-range__value">
          {options.map((option, index) => {
            const isActive = index === activeOptionIndex;
            const isDefault = index === 0;
            const isLastOption = index === options.length - 1;
            const optionClassNames = classNames(
              'link-tooltip-container',
              'confidence-range__option',
              {
                'confidence-range__option--active': isActive
              }
            );

            return (
              <div
                key={option}
                className={optionClassNames}
                onClick={() => onChange(option)}
              >
                {isDefault ? 'Unset' : `${option}%`}
                {!isDefault &&
                  !isLastOption && (
                    <div className="link-tooltip bottom">
                      {`Might be +/- ${100 - option}% of work`}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
        <div className="confidence-range__emoji">{CONFIDENT_EMOJI}</div>
      </div>
    </div>
  );
}

ConfidenceRange.propTypes = {
  className: PropTypes.string,
  compactView: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired
};

export default ConfidenceRange;
