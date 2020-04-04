import React from 'react';
import TreeView from 'Components/shared/tree_view';

const Share = ({ parentTopic, tab }) => (
  <div className="tab-wrapper">
    <div className="info-text">
      Who can see and access this yay and its cards? <a>Learn More</a>
    </div>
    <TreeView parentTopic={parentTopic} tab={tab} />
  </div>
);

export default Share;
