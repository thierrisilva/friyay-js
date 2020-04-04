import React from 'react';
import TreeView from 'Components/shared/tree_view';

const Timelines = ({ parentTopic, tab }) => (
  <div className="tab-wrapper">
    <div className="info-text">
      Set start and due dates <a>Learn More</a>
    </div>
    <TreeView parentTopic={parentTopic} tab={tab} disableOn="topics" />
  </div>
);

export default Timelines;
