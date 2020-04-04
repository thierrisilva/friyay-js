import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { failure } from 'Utils/toast';

import Ability from 'Lib/ability';
import { completeCard } from 'Actions/tips';

function CompleteCheckbox({ card, className, complete }) {
  function handleCompletion() {
    if (Ability.can('update', 'self', card)) {
      complete(card, completion);
    } else {
      failure('Unable to mark card as completed');
    }
  }

  const checkboxClassNames = classNames(className, 'complete-checkbox');
  const isCompleted = card.attributes.completed_percentage === 100;
  const completion = isCompleted ? 0 : 100;

  return (
    <button
      className={checkboxClassNames}
      role="checkbox"
      aria-checked={isCompleted}
      aria-label="completed"
      onClick={handleCompletion}
    >
      <span className="complete-checkbox__icon material-icons">
        {isCompleted ? 'check_box' : 'check_box_outline_blank'}
      </span>
    </button>
  );
}

CompleteCheckbox.propTypes = {
  card: PropTypes.object.isRequired,
  className: PropTypes.string,
  complete: PropTypes.func.isRequired
};

const mapDispatch = { complete: completeCard };

export default connect(null, mapDispatch)(CompleteCheckbox);
