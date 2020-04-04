import React from 'react';
import PropTypes from 'prop-types';

const TopicSelectorHeader = props => {
  const pathContent = [
    ...props.parentPath.map((path, index) => [
      <a
        href="javascript:void(0)"
        key={'topic-path-' + index}
        className="link-menu-parent-path"
        onClick={e => props.handleTopicClick(path, e)}
      >
        {path.title}
      </a>,
      <span key={'link-menu-parent-path-span-' + index + '-' + path.id}>/</span>
    ])
  ];

  if (pathContent.length === 0 && !props.hideHeader) {
    return <div id="topic-selector-header">Select yays</div>;
  }

  return (
    <div>
      <div id="topic-selector-header">
        <a
          href="javascript:void(0)"
          className="fa fa-arrow-left"
          onClick={props.handleTopicBack}
        />

        <div className="path-selector">
          <span style={{ margin: '0 5px' }}>{pathContent}</span>
        </div>

        {!props.hideHeader && (
          <div className="pull-right text-muted" style={{ marginLeft: 5 }}>
            Select yays
          </div>
        )}
      </div>
    </div>
  );
};

TopicSelectorHeader.propTypes = {
  parentPath: PropTypes.array.isRequired,
  handleTopicBack: PropTypes.func.isRequired
};

TopicSelectorHeader.defaultProps = {
  parentPath: []
};

export default TopicSelectorHeader;
