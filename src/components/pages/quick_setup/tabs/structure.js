import React from 'react';
import TreeView from 'Components/shared/tree_view';

const Structure = ({ parentTopic, tab }) => (
  <div className="tab-wrapper">
    <div className="info-text">
      Add cards and organize them in lists by nesting cards in cards{' '}
      <a>Learn More</a>
    </div>
    <TreeView parentTopic={parentTopic} tab={tab} showAddIcon />
  </div>
);

export default Structure;
