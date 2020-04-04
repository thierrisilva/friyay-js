import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { arrayOf, func, object } from 'prop-types';
import { failure } from 'Utils/toast';
import { createSelector } from 'reselect';
import Ability from 'Lib/ability';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import { todoPeriods } from './todoConfig';
import { moveOrCopyCardInOrToTopicFromDragAndDrop } from 'Src/newRedux/database/cards/abstractions';
import { updateCard } from 'Src/newRedux/database/cards/thunks';
import GenericDragDropListing from 'Components/shared/drag_and_drop/GenericDragDropListing';
import GenericDropZone from 'Components/shared/drag_and_drop/GenericDropZone';
import DMLoader from 'Src/dataManager/components/DMLoader';
import ActiveFiltersPanel from 'Components/shared/filters/ActiveFiltersPanel';
import TodoCard from './TodoCard';
const todoTabs = Object.values(todoPeriods);
import AddCardCard from 'Components/shared/cards/AddCardCard';
import { scrollToShow } from 'Src/lib/utilities';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { yayDesign } from 'Src/lib/utilities';

class TodoView extends Component {
  static propTypes = {
    cards: arrayOf(object),
    moveOrCopyCardInOrToTopicFromDragAndDrop: func.isRequired,
    updateCard: func.isRequired
  };

  state = {
    selectedTimePeriod: 'ALL',
    inInputMode: false
  };

  handleDropCardOnNewTimeFrame = ({
    draggedItemProps: { item },
    dropZoneProps
  }) => {
    if (Ability.can('update', 'self', item)) {
      const newDueDate = todoPeriods[dropZoneProps.timePeriodKey].endOfPeriod
        ? moment(todoPeriods[dropZoneProps.timePeriodKey].endOfPeriod)
            .subtract(1, 'hours')
            .toISOString()
        : null;
      const newStartDate =
        item.attributes.start_date &&
        moment(newDueDate).isAfter(moment(item.attributes.start_date))
          ? item.attributes.start_date
          : moment(
              todoPeriods[dropZoneProps.timePeriodKey].startOfPeriod
            ).toISOString();
      const attributes = {
        due_date: newDueDate,
        start_date: newStartDate
      };
      this.props.updateCard({ id: item.id, attributes });
    } else {
      failure("You don't have permission to move that card!");
    }
  };

  handleSelectTimePeriod = key => {
    this.setState({ selectedTimePeriod: key });
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
      cardRequirements,
      cards,
      moveOrCopyCardInOrToTopicFromDragAndDrop,
      topic,
      active_design
    } = this.props;

    const { card_font_color } = active_design || {};
    const { selectedTimePeriod } = this.state;
    const thisTimePeriodsCards = timePeriodFilter(cards, selectedTimePeriod);
    const thisTimePeriodsDueDate = moment(
      todoPeriods[selectedTimePeriod].endOfPeriod
    )
      .subtract(1, 'hours')

      .toISOString();

    return (
      <div className="todo-view">
        <ActiveFiltersPanel />
        <div className="todo-view_time-tab-container">
          {todoTabs.map(tab => (
            <GenericDropZone
              canDrop
              dropClassName={`todo-view_time-tab-dropzone ${tab.breakPoint}`}
              itemType={dragItemTypes.CARD}
              key={tab.key}
              onDrop={this.handleDropCardOnNewTimeFrame}
              timePeriodKey={tab.key}
            >
              <a
                className={`todo-view_time-tab ${tab.key ==
                  selectedTimePeriod && 'selected'}`}
                onClick={() => this.handleSelectTimePeriod(tab.key)}
              >
                {tab.name}
              </a>
            </GenericDropZone>
          ))}
        </div>

        <GenericDragDropListing
          itemList={thisTimePeriodsCards}
          dropClassName="todo-view_card-list"
          dragClassName="task-view_drag-card"
          dropZoneProps={{ topicId: topic ? topic.id : null }}
          draggedItemProps={{ origin: { topicId: topic ? topic.id : null } }}
          itemType={dragItemTypes.CARD}
          onDropItem={moveOrCopyCardInOrToTopicFromDragAndDrop}
          renderItem={card => (
            <TodoCard
              color={card_font_color}
              card={card}
              topicId={topic ? topic.id : null}
            />
          )}
        >
          <AddCardCard
            cardClassName="todo-card"
            newCardAttributes={{ due_date: thisTimePeriodsDueDate }}
            topic={topic}
            inInputMode={this.state.inInputMode}
            afterCardCreated={this.afterCardCreated}
          />

          <DMLoader
            dataRequirements={{
              cardsWithAttributes: { attributes: { ...cardRequirements } }
            }}
            loaderKey="cardsWithAttributes"
          />
        </GenericDragDropListing>
      </div>
    );
  }
}

const timePeriodFilter = createSelector(
  (cards, timePeriod) => todoPeriods[timePeriod],
  (cards, timePeriod) => cards,
  (timePeriod, cards) =>
    cards.filter(card =>
      timePeriod.key == 'ALL'
        ? true
        : timePeriod.startOfPeriod
        ? card.attributes.due_date &&
          moment(card.attributes.due_date).isBetween(
            timePeriod.startOfPeriod,
            timePeriod.endOfPeriod,
            null,
            '[]'
          )
        : !card.attributes.due_date
    )
);

const mapState = state => {
  const sm = stateMappings(state);
  const {
    page: { topicId },
    topics
  } = sm;
  const active_design = yayDesign(topicId, topics[topicId]);

  return {
    active_design
  };
};

const mapDispatch = {
  moveOrCopyCardInOrToTopicFromDragAndDrop,
  updateCard
};

export default connect(
  mapState,
  mapDispatch
)(TodoView);
