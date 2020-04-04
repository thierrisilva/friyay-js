import React, { Component } from 'react';
import { array, number } from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import GoalCard from './GoalCard';
import AddCardButton from 'Src/components/shared/buttons/AddCardButton.js';
import DMLoader from 'Src/dataManager/components/DMLoader';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import { moveOrCopyCardInOrToTopicFromDragAndDrop } from 'Src/newRedux/database/cards/abstractions';
import GenericDragDropListing from 'Components/shared/drag_and_drop/GenericDragDropListing';
import AddCardCard from 'Components/shared/cards/AddCardCard';
import GenericDropZone from 'Src/components/shared/drag_and_drop/GenericDropZone';
import { updateCard } from 'Src/newRedux/database/cards/thunks';
import Ability from 'Lib/ability';
import { failure } from 'Utils/toast';
import { scrollToShow } from 'Src/lib/utilities';

class ToDoSection extends Component {
  state = {
    inInputMode: false
  };

  handleDropCard = ({ droppedItemProps, dropZoneProps, itemOrder }) => {
    const {
      item: {
        id,
        attributes: {
          start_date,
          due_date,
          completed_percentage,
          completion_date
        }
      }
    } = droppedItemProps;

    const {
      columnMode,
      updateCard,
      timeframeDate,
      moveOrCopyCardInOrToTopicFromDragAndDrop
    } = this.props;

    if (Ability.can('update', 'self', droppedItemProps.item)) {
      let attributes = {};

      if (completed_percentage == 100) {
        attributes.completed_percentage = 0;
      }

      const timeUnit = columnMode === 'any' ? 'year' : columnMode;

      attributes.due_date = timeframeDate
        .clone()
        .endOf(timeUnit)
        .format();

      if (
        !start_date ||
        moment(start_date).isSameOrAfter(moment(attributes.due_date))
      ) {
        attributes.start_date = timeframeDate
          .clone()
          .startOf(timeUnit)
          .format();
      }

      if (completion_date) {
        attributes.completion_date = null;
      }

      updateCard({ attributes, id });
      moveOrCopyCardInOrToTopicFromDragAndDrop({
        droppedItemProps,
        dropZoneProps,
        itemOrder
      });
    } else {
      failure("You don't have permission to move that card!");
    }
  };

  handleToggleInputMode = () => {
    this.setState(state => ({ inInputMode: !state.inInputMode }));
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
      cards,
      topic,
      cardRequirements,
      columnMode,
      timeframeDate
    } = this.props;

    const totalOfPercentages = cards.reduce((total, card) => {
      return total + card.attributes.completed_percentage;
    }, 0);

    const totalPercentPossible = cards.length * 100;

    const percentageDone = Math.ceil(
      (totalOfPercentages / totalPercentPossible) * 100
    );

    const startDate = timeframeDate.startOf(columnMode).isSameOrBefore()
      ? moment()
      : timeframeDate.startOf(columnMode);
    const showAddCard = topic && !timeframeDate.endOf(columnMode).isBefore();
    return (
      <div className="goal-view-section prel">
        <header className="header-links divider goal-view-section-header">
          <h2 className="goal-view_title">To-Do</h2>
          <span className="goal-view_percentage">
            {isNaN(percentageDone) ? '-' : `${percentageDone}%`}
          </span>
        </header>

        <GenericDragDropListing
          dragClassName="task-view_drag-card"
          dropClassName="goal-view_card-listing"
          dropZoneProps={{ topicId: topic ? topic.id : null }}
          draggedItemProps={{ origin: { topicId: topic ? topic.id : null } }}
          itemContainerClassName="grid-view_card-container"
          itemList={cards}
          itemType={dragItemTypes.CARD}
          onDropItem={this.handleDropCard}
          renderItem={card => (
            <GoalCard
              card={card}
              key={card.id}
              topicId={topic ? topic.id : null}
            />
          )}
        >
          <DMLoader
            dataRequirements={{
              cardsWithAttributes: { attributes: cardRequirements }
            }}
            loaderKey="cardsWithAttributes"
          />
        </GenericDragDropListing>

        <div className="toggle-archive">
          {showAddCard && (
            <AddCardCard
              cardClassName="goal-card"
              topicId={topic.id}
              inInputMode={this.state.inInputMode}
              newCardAttributes={{
                start_date: startDate.format(),
                due_date: timeframeDate.endOf(columnMode).format()
              }}
              afterCardCreated={this.afterCardCreated}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapDispatch = {
  moveOrCopyCardInOrToTopicFromDragAndDrop,
  updateCard
};

export default connect(
  undefined,
  mapDispatch
)(ToDoSection);
