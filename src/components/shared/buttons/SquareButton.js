import React from 'react';

const SquareButton = ({
  additionalClasses = '',
  children,
  colour,
  disabled,
  isSolid,
  noBorder,
  onClick
}) => {
  const backgroundColor = isSolid ? colour : 'transparent';
  const borderColor = noBorder ? 'transparent' : colour;
  const color = isSolid ? '#fff' : colour;
  const style = { backgroundColor, borderColor, color };

  return (
    <button
      type="button"
      className={`square-button ${additionalClasses}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
};

export default SquareButton;
