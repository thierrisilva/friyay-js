import React from 'react';
import PropTypes from 'prop-types';

const ColorBlock = ({ onSelect, colorIndex, selected }) => (
  <div
    className={`color-block color-${colorIndex}`}
    onClick={() => onSelect(colorIndex)}
  >
    {selected && '✔'}
  </div>
);

ColorBlock.defaultProps = {
  colorIndex: 1
};

ColorBlock.propTypes = {
  colorIndex: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool
};

export default ColorBlock;
