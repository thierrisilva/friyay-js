import React from 'react';
import TreeView from 'Components/shared/tree_view';

const Design = ({ parentTopic, tab }) => (
  <div className="tab-wrapper">
    <div className="info-text">
      Change colors and add banner image <a>Learn More</a>
    </div>
    <TreeView parentTopic={parentTopic} tab={tab} />
  </div>
);

export default Design;
