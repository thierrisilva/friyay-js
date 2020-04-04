import React from 'react';

const RevolvingToggleButton = ({ active, onClick }) => (
  <div className={'revolving-toggle-button ' + (active ? 'active' : '')} onClick={onClick} />
);

export default RevolvingToggleButton;
