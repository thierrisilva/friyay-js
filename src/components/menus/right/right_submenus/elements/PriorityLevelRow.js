import React from 'react';
import { bool, func, object } from 'prop-types';

import Icon from 'Components/shared/Icon';
import PropTypes from 'prop-types';

const PriorityLevelRow = ({ isSelected, onClick, level }) => {
  return (
    <div className="right-submenu_item option" key={level}>
      <a
        className={`right-submenu_item no-border ${isSelected &&
          'active bold'}`}
        onClick={onClick}
      >
        <Icon fontAwesome icon={isSelected ? 'check-square' : 'square'} />
        <span className="ml5">{level}</span>
      </a>
    </div>
  );
};

PriorityLevelRow.propTypes = {
  isSelected: bool,
  onClick: func.isRequired,
  level: PropTypes.string.isRequired
};

export default PriorityLevelRow;
