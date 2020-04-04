import React from 'react';
import ReactTooltip from 'react-tooltip';

const Tooltip = (options, id) => {
  let newOptions = Object.assign({}, options);
  !options.id && (newOptions.id = id && id.id);
  newOptions.id = newOptions.id
    ? newOptions.id.toString()
    : Math.ceil(Math.random() * 100000, 6).toString();
  return <ReactTooltip className="tiphive-tooltip" {...newOptions} />;
};

export default Tooltip;
