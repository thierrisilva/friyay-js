import React from 'react';
import TreeView from 'Components/shared/tree_view';

const Content = ({ parentTopic, tab }) => (
  <div className="tab-wrapper">
    <div className="info-text">
      Add content to cards: text, images, files, tables and so forth{' '}
      <a>Learn More</a>
    </div>
    <TreeView parentTopic={parentTopic} tab={tab} disableOn="topics" />
  </div>
);

export default Content;
