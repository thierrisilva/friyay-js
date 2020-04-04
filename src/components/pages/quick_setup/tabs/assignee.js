import React from 'react';
import TreeView from 'Components/shared/tree_view';

const Assignees = ({ parentTopic, tab }) => (
  <div className="tab-wrapper">
    <div className="info-text">
      Assign cards to team members <a>Learn More</a>
    </div>
    <TreeView parentTopic={parentTopic} tab={tab} disableOn="topics" />
  </div>
);

export default Assignees;
