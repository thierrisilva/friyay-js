import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ActiveFiltersPanel from 'Components/shared/filters/ActiveFiltersPanel';

import { moveOrCopyCardInOrToTopicFromDragAndDrop } from 'Src/newRedux/database/cards/abstractions';

import TaskViewTopicSection from './TaskViewTopicSection';
import { scrollToShow } from 'Src/lib/utilities';

class TaskView extends Component {
  renderTopicSection = topic => {
    const {
      cardRequirements,
      moveOrCopyCardInOrToTopicFromDragAndDrop
    } = this.props;
    return (
      <TaskViewTopicSection
        cardRequirements={cardRequirements}
        displayHeader={true}
        key={topic.id}
        onDropCard={moveOrCopyCardInOrToTopicFromDragAndDrop}
        renderSubtopicSection={subtopic => this.renderTopicSection(subtopic)}
        topicId={topic.id}
      />
    );
  };

  afterCardCreated = cardId => {
    if (this.props.cardsSplitScreen) {
      this.props.updateSelectedCard(cardId);
    }
    const elem = document.querySelector('.card-title.c' + cardId);
    scrollToShow(elem, 14, 24);
  };

  render() {
    const {
      cardRequirements,
      cards,
      moveOrCopyCardInOrToTopicFromDragAndDrop,
      subtopics,
      topic
    } = this.props;

    return (
      <div className="task-view">
        <ActiveFiltersPanel />
        {topic && (
          <TaskViewTopicSection
            cards={cards}
            cardRequirements={cardRequirements}
            displayHeader={false}
            topicId={topic.id}
            onDropCard={moveOrCopyCardInOrToTopicFromDragAndDrop}
          />
        )}

        <div className="p20">
          {subtopics.map(subtopic => this.renderTopicSection(subtopic))}
        </div>
      </div>
    );
  }
}

TaskView.propTypes = {
  topic: PropTypes.object,
  group: PropTypes.object,
  cards: PropTypes.array.isRequired
};

const mapDispatch = {
  moveOrCopyCardInOrToTopicFromDragAndDrop
};

export default connect(
  undefined,
  mapDispatch
)(TaskView);
