import React from 'react';
import TreeView from 'Components/shared/tree_view';

const Views = ({ parentTopic, tab }) => (
  <div className="tab-wrapper">
    <div className="info-text">
      Which views should the yay(s) have? <a>Learn More</a>
    </div>
    <TreeView parentTopic={parentTopic} tab={tab} disableOn="tip_detail" />
  </div>
);

export default Views;
