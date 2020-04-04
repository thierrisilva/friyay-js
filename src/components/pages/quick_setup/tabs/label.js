import React from 'react';
import TreeView from 'Components/shared/tree_view';

const Label = ({ parentTopic, tab }) => (
  <div className="tab-wrapper">
    <div className="info-text">
      Add labels to cards <a>Learn More</a>
    </div>
    <TreeView parentTopic={parentTopic} tab={tab} disableOn="topics" />
  </div>
);

export default Label;
