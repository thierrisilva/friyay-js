import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import TopicHexGrid from './topic_hex_grid';
import ItemsContainer from '../../shared/items_container';

const tooltipStyle = {
  top: 'auto',
  bottom: -40,
  left: -75
};

const TopicHexagonView = ({
  group,
  topic,
  subtopics,
  isLoadingItems,
  history,
  location,
  showTopicFilterView,
  showTopicHexGrid,
  toggleTopicHexGrid,
  handleStarSubhiveClick,
  moveDraggingTip,
  itemAddActive,
  items,
  dropDraggingTip,
  view
}) => {
  let topicHexGridContent = null;
  if (showTopicHexGrid) {
    topicHexGridContent = (
      <TopicHexGrid
        handleStarSubhiveClick={handleStarSubhiveClick}
        group={group}
        topic={topic}
        subtopics={subtopics}
      />
    );
  }

  const iconClassName = classNames({
    glyphicon: true,
    'glyphicon-chevron-up': showTopicHexGrid,
    'glyphicon-chevron-down': !showTopicHexGrid
  });

  return (
    <div className="full-height">
      <div className="topic-hexa-grid-toggle-container">
        <a
          className="btn btn-toggle-subhive-nav link-tooltip-container"
          onClick={toggleTopicHexGrid}
          style={{ marginTop: showTopicHexGrid ? -12 : -13 }}
        >
          <i className={iconClassName} />
          <span className="link-tooltip" style={tooltipStyle}>
            Expand/Collapse Hexagons
          </span>
        </a>
        {topicHexGridContent}
      </div>
      <ItemsContainer
        history={history}
        location={location}
        items={items}
        isLoading={isLoadingItems}
        group={group}
        topic={topic}
        showTopicFilterView={showTopicFilterView}
        moveDraggingTip={moveDraggingTip}
        dropDraggingTip={dropDraggingTip}
        itemAddActive={itemAddActive}
        topicView={view}
      />
    </div>
  );
};

TopicHexagonView.propTypes = {
  group: PropTypes.any,
  topic: PropTypes.object,
  subtopics: PropTypes.any,
  items: PropTypes.array,
  isLoadingItems: PropTypes.bool,
  history: PropTypes.any,
  location: PropTypes.any,
  showTopicFilterView: PropTypes.any,
  topicViewFilterSettings: PropTypes.object,
  showTopicHexGrid: PropTypes.bool,
  toggleTopicHexGrid: PropTypes.func,
  handleStarSubhiveClick: PropTypes.func,
  moveDraggingTip: PropTypes.func,
  dropDraggingTip: PropTypes.func.isRequired,
  itemAddActive: PropTypes.bool,
  view: PropTypes.number
};

export default TopicHexagonView;
