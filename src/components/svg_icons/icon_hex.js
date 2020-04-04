import React from 'react';

const IconHex = (props) => {
  const { className, width, height, fill, stroke, strokeWidth } = props;

  const initialClassName = 'icon icon-hex';
  const classes = initialClassName.concat(' ', className);

  var viewBox = '';
  if (props.scaleViewBox === false) {
    viewBox = props.viewBox;
  } else {
    viewBox = '0 0 ' + width + ' ' + height;
  }

  return (
    <svg className={classes}
         width={width} height={height}
         viewBox={viewBox}
         xmlns="http://www.w3.org/2000/svg">
      <title>Hex Icon</title>
      <path stroke={stroke}
            strokeWidth={strokeWidth} d="M7.835 2l6.495 3.75v7.5L7.835 17 1.34 13.25v-7.5z"
            fill={fill} fillRule="evenodd"/>
    </svg>
  );
};

IconHex.defaultProps = {
  className: 'icon-hex',
  width: '16',
  height: '19',
  viewBox: '0 0 16 19',
  fill: '#000',
  strokeWidth: '2',
  stroke: '#000'
};

export default IconHex;
