import React, { Fragment, Component } from 'react';
import { stateMappings } from 'Src/newRedux/stateMappings';
import ActiveFiltersPanel from 'Components/shared/filters/ActiveFiltersPanel';
import { connect } from 'react-redux';
import ToDoSection from './ToDoSection';
import CompletedSection from './CompletedSection';
import CompletionSlider from 'Components/shared/CompletionSlider';
import TimelineModeSelector from 'Components/shared/TimelineModeSelector';
import TimelineTimeframeSelector from 'Components/shared/TimelineTimeframeSelector';
import IconButton from 'Components/shared/buttons/IconButton';
import GenericDragDropListing from '../../../shared/drag_and_drop/GenericDragDropListing';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import AddCardCard from 'Components/shared/cards/AddCardCard';
import DMLoader from 'Src/dataManager/components/DMLoader';
import Ability from 'Lib/ability';
import { failure } from 'Utils/toast';
import { updateCard } from 'Src/newRedux/database/cards/thunks';
import { moveOrCopyCardInOrToTopicFromDragAndDrop } from 'Src/newRedux/database/cards/abstractions';
import KanbanCard from 'Src/components/views/card_views/Kanban/KanbanCard';
import {
  scrollToShow,
  getSidePaneArrowTop,
  getSidePaneArrowLeft
} from 'Src/lib/utilities';
import { yayDesign } from 'Src/lib/utilities';

class GoalView extends Component {
  state = {
    columnMode: 'weeks',
    noDueCards: [],
    dueCards: [],
    showNoDuePanel: true,
    timeframeDate: moment(),
    inInputMode: false
  };

  viewRef = React.createRef();

  componentDidMount() {
    this.updateCardsState(this.props.cards);
  }

  componentWillReceiveProps({ cards }) {
    if (cards !== this.props.cards) {
      this.updateCardsState(cards);
    }
  }

  handleTimelineModeChange = mode => {
    this.setState({ columnMode: mode });
  };

  handleTimeframeDateChange = date => {
    this.setState({ timeframeDate: date });
  };

  toggleShowNoDuePanel = () => {
    this.setState({ showNoDuePanel: !this.state.showNoDuePanel });
  };

  updateCardsState = cards => {
    let noDueCards = [];
    let dueCards = [];

    cards.forEach(card => {
      if (
        !card.attributes.completion_date &&
        !card.attributes.due_date &&
        !card.attributes.start_date
      ) {
        noDueCards.push(card);
      } else {
        dueCards.push(card);
      }
    });

    this.setState({ noDueCards, dueCards });
  };

  handleDropCard = ({ droppedItemProps, dropZoneProps, itemOrder }) => {
    const {
      item: {
        id,
        attributes: { start_date, due_date, completion_date }
      }
    } = droppedItemProps;
    const { updateCard, moveOrCopyCardInOrToTopicFromDragAndDrop } = this.props;

    if (Ability.can('update', 'self', droppedItemProps.item)) {
      if (start_date || due_date || completion_date) {
        const attributes = {
          start_date: null,
          due_date: null,
          completed_percentage: 0,
          completion_date: null
        };

        updateCard({ attributes, id });
      }

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
    let {
      cardRequirements,
      topic,
      displayLeftSubtopicMenuForTopic,
      displayLeftMenu,
      active_design
    } = this.props;
    let {
      showNoDuePanel,
      dueCards,
      noDueCards,
      columnMode,
      timeframeDate
    } = this.state;
    const topicId = topic ? topic.id : null;

    let upcomingDueCards = dueCards;

    if (columnMode != 'any') {
      upcomingDueCards = dueCards.filter(card => {
        const {
          completed_percentage,
          due_date,
          completion_date
        } = card.attributes;

        const date = completed_percentage == 100 ? completion_date : due_date;
        return !(
          moment(date).isBefore(timeframeDate.clone().startOf(columnMode)) ||
          moment(date).isAfter(timeframeDate.clone().endOf(columnMode))
        );
      });
    }

    const numberInProgress = upcomingDueCards.filter(card => {
      return card.attributes.completed_percentage < 100;
    });

    const numberComplete = upcomingDueCards.filter(card => {
      return card.attributes.completed_percentage == 100;
    });

    // const percentageInProgress = Math.floor((numberInProgress.length / dueCards.length) * 100);
    const percentageComplete = Math.ceil(
      (numberComplete.length / upcomingDueCards.length) * 100
    );

    const {
      card_font_color,
      card_background_color,
      card_background_color_display
    } = active_design || {};

    return (
      <div ref={this.viewRef} className="kanban-view">
        <aside
          className={`kanban-view_unlabelled-panel ${
            showNoDuePanel ? 'presented' : ''
          }`}
        >
          {showNoDuePanel && (
            <Fragment>
              <GenericDragDropListing
                dropClassName="kanban-view_lane-catchment"
                dragClassName="task-view_drag-card"
                dropZoneProps={{ topicId: topic ? topic.id : null }}
                draggedItemProps={{
                  origin: { topicId: topic ? topic.id : null }
                }}
                itemContainerClassName=""
                itemList={noDueCards}
                itemType={dragItemTypes.CARD}
                onDropItem={this.handleDropCard}
                renderItem={card => (
                  <KanbanCard
                    card={card}
                    key={card.id}
                    topicId={topic ? topic.id : null}
                  />
                )}
              >
                <AddCardCard
                  cardClassName="goal-card"
                  topicId={topicId}
                  inInputMode={this.state.inInputMode}
                  afterCardCreated={this.afterCardCreated}
                />

                <DMLoader
                  dataRequirements={{
                    cardsWithAttributes: { attributes: cardRequirements }
                  }}
                  loaderKey="cardsWithAttributes"
                />
              </GenericDragDropListing>
            </Fragment>
          )}
        </aside>
        <div className="kanban-view_main-section goal-view_main-section">
          <div className="goal-view_top-bar">
            <IconButton
              containerClasses="left-section-icon-container"
              wrapperClasses="left-section-icon"
              style={{
                top: getSidePaneArrowTop(this.viewRef),
                backgroundColor:
                  card_background_color && card_background_color_display
                    ? card_background_color
                    : '#fafafa',
                left: `${getSidePaneArrowLeft(false) +
                  (displayLeftSubtopicMenuForTopic.topicId ? 270 : 0) +
                  (displayLeftMenu ? 270 : 0)}px`
              }}
              color={card_font_color}
              fontAwesome
              icon={`${showNoDuePanel ? 'chevron-left' : 'chevron-right ml10'}`}
              onClick={this.toggleShowNoDuePanel}
            />
            {columnMode != 'any' && (
              <TimelineTimeframeSelector
                color={card_font_color}
                className="timeline-view__timeframe goal-view-options"
                columnMode={this.state.columnMode}
                value={this.state.timeframeDate}
                onChange={this.handleTimeframeDateChange}
                goalView
              />
            )}
            <TimelineModeSelector
              color={card_font_color}
              className="timeline-view__mode-selector goal-view-options"
              value={this.state.columnMode}
              onChange={this.handleTimelineModeChange}
              goalView
            />
            <ActiveFiltersPanel />
          </div>
          <div className="header-links align-i-center pl10 pr25">
            <div className="ml5 mr5 full-width">
              <CompletionSlider
                width="100%"
                value={percentageComplete}
                dontUpdate
              />
            </div>
            <span className="background-purple goal-view_fraction">
              <span className="fraction">
                {numberComplete.length}
                <span className="divisor">/</span>
                {upcomingDueCards.length}
              </span>
            </span>
          </div>
          <div className="goal-view-content-container">
            <ToDoSection
              topic={topic}
              cards={numberInProgress}
              // percentageOfCards={percentageInProgress}
              cardRequirements={cardRequirements}
              columnMode={columnMode}
              timeframeDate={timeframeDate}
            />
            <CompletedSection
              topic={topic}
              cards={numberComplete}
              percentageOfCards={percentageComplete}
              cardRequirements={cardRequirements}
              columnMode={columnMode}
              timeframeDate={timeframeDate}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);
  const {
    page: { topicId },
    topics
  } = sm;
  const topic = topicId && topics[topicId];
  const active_design = yayDesign(topicId, topic);

  return {
    active_design,
    displayLeftSubtopicMenuForTopic: sm.menus.displayLeftSubtopicMenuForTopic,
    displayLeftMenu: sm.menus.displayLeftMenu,
    topic: sm.topics[topicId],
    topicId: topicId
  };
};

const mapDispatch = {
  updateCard,
  moveOrCopyCardInOrToTopicFromDragAndDrop
};

export default connect(
  mapState,
  mapDispatch
)(GoalView);
