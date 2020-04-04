import React from 'react';
import TreeView from 'Components/shared/tree_view';

const Priorities = ({ parentTopic, tab }) => (
  <div className="tab-wrapper">
    <div className="info-text">
      Prioritize cards by priorit level <a>Learn More</a>
    </div>
    <TreeView parentTopic={parentTopic} tab={tab} disableOn="topics" />
  </div>
);

export default Priorities;
