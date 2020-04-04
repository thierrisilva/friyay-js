import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const ButtonAddSubtopic = ({ isActive, onAddSubtopicClick }) => {
  return (
    <button
      className={classNames('btn btn-noback', { active: isActive })}
      onClick={onAddSubtopicClick}
    >
      + Add yay
    </button>
  );
};

ButtonAddSubtopic.propTypes = {
  isActive: PropTypes.bool,
  onAddSubtopicClick: PropTypes.func.isRequired
};

export default ButtonAddSubtopic;
