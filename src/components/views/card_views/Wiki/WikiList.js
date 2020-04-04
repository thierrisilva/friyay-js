import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createSelector } from 'reselect';
import { getSortedTopicsByParentTopic } from 'Src/newRedux/database/topics/selectors';
import { getSortedFilteredCardsByTopic } from 'Src/newRedux/database/cards/selectors';

import WikiListTopicSegment from './WikiListTopicSegment';
import IconButton from 'Components/shared/buttons/IconButton';
import {
  dragItemTypes,
  GenericDragDropListing,
  GenericDropZone
} from 'Components/shared/drag_and_drop/_index';
import DMLoader from 'Src/dataManager/components/DMLoader';
import WikiCard from './WikiCard';
import withDataManager from 'Src/dataManager/components/withDataManager';

class WikiList extends Component {
  renderSubtopicRow = (topic, dragLeaveHandlers = [], hideHeader = false) => {
    const { topic: thisTopic, color } = this.props;

    return (
      <WikiListTopicSegment
        color={color}
        dragLeaveHandlersForParentLists={dragLeaveHandlers}
        hideHeader={hideHeader}
        onSelectCard={this.props.onSelectCard}
        renderSubtopicSection={(subtopic, parentDragLeaveHandlers) =>
          this.renderSubtopicRow(subtopic, parentDragLeaveHandlers)
        }
        selectedCardId={this.props.selectedCardId}
        topic={topic}
        isRoot={(topic ? topic.id : '0') === (thisTopic ? thisTopic.id : '0')}
      />
    );
  };

  render() {
    const { cards, selectedCardId, topic, topics } = this.props;
    const topicId = topic ? topic.id : '0';

    return (
      <div className="wiki-list_container">
        <div className="wiki-list">
          {this.renderSubtopicRow(topic, [], true)}
        </div>
      </div>
    );
  }
}

const mapState = (state, props) => ({
  topics: getSortedTopicsByParentTopic(state) || [],
  cards: getSortedFilteredCardsByTopic(state) || []
});

const dataRequirements = props => {
  return props.topic
    ? {
        subtopicsForTopic: { topicId: props.topic.id },
        cardsForTopic: { topicId: props.topic.id }
      }
    : {
        cards: {}
      };
};

export default withDataManager(dataRequirements, mapState)(WikiList);
