import { connect } from 'react-redux';
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import IconButton from 'Components/shared/buttons/IconButton';
import ActiveFiltersPanel from 'Components/shared/filters/ActiveFiltersPanel';
import DMLoader from 'Src/dataManager/components/DMLoader';
import GenericDragDropListing from 'Components/shared/drag_and_drop/GenericDragDropListing';
import TimelineCard from './TimelineCard';
import TimelineGrid from './TimelineGrid';
import TimelineModeSelector from 'Components/shared/TimelineModeSelector';
import TimelineTimeframeSelector from 'Components/shared/TimelineTimeframeSelector';
import AddCardCard from 'Components/shared/cards/AddCardCard';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import { moveOrCopyCardInOrToTopicFromDragAndDrop } from 'Src/newRedux/database/cards/abstractions';
import { updateCard } from 'Src/newRedux/database/cards/thunks';
import { setEditCardModalOpen } from 'Src/newRedux/interface/modals/actions';
import {
  scrollToShow,
  getSidePaneArrowTop,
  getSidePaneArrowLeft
} from 'Src/lib/utilities';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { yayDesign } from 'Src/lib/utilities';

class TimelineView extends Component {
  static propTypes = {
    cards: PropTypes.array,
    topic: PropTypes.any,
    updateCard: PropTypes.func
  };

  viewRef = React.createRef();

  state = {
    columnMode: 'weeks',
    noDueCards: [],
    showNoDuePanel: true,
    sortedCards: [],
    timeframeDate: moment(),
    inInputMode: false
  };

  componentDidMount() {
    this.updateCardsState(this.props.cards);
  }

  componentDidUpdate({ cards }) {
    if (cards !== this.props.cards) {
      this.updateCardsState(this.props.cards);
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

  updateCardsState(cards) {
    let noDueCards = [];
    let sortedCards = [];

    cards.forEach(card => {
      if (!card.attributes.due_date) {
        noDueCards.push(card);
      } else {
        sortedCards.push(card);
      }
    });

    sortedCards = orderBy(sortedCards, ({ attributes }) => [
      moment(attributes.start_date).valueOf(),
      moment(attributes.due_date).valueOf()
    ]);

    this.setState({ noDueCards, sortedCards });
  }

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
      displayLeftSubtopicMenuForTopic,
      topic,
      updateCard,
      cardRequirements,
      displayLeftMenu,
      active_design
    } = this.props;
    const {
      noDueCards,
      inInputMode,
      showNoDuePanel,
      columnMode,
      timeframeDate,
      sortedCards
    } = this.state;
    const topicId = topic ? topic.id : null;
    const {
      card_font_color,
      card_background_color,
      card_background_color_display
    } = active_design || {};
    return (
      <div ref={this.viewRef} className="timeline-view">
        {this.state.showNoDuePanel && (
          <div className="timeline-view__no-due-panel">
            <GenericDragDropListing
              dragClassName=""
              dropClassName="timeline-view__drop-zone"
              dropZoneProps={{}}
              draggedItemProps={{}}
              itemContainerClassName=""
              itemList={noDueCards || []}
              itemType={dragItemTypes.CARD}
              onDropItem={({ droppedItemProps: { item } }) => {
                if (item) {
                  updateCard({
                    id: item.id,
                    attributes: { due_date: null, start_date: null }
                  });
                }
              }}
              renderItem={card => (
                <TimelineCard
                  card={card}
                  className="timeline-view__no-due-card"
                  compactView
                  topicId={topic && topic.id}
                />
              )}
            />
            <DMLoader
              dataRequirements={{
                cardsWithAttributes: {
                  attributes: cardRequirements
                }
              }}
              loaderKey="cardsWithAttributes"
            />
            <AddCardCard
              cardClassName="timeline-grid__add-card"
              topicId={topicId}
              inInputMode={inInputMode}
              afterCardCreated={this.afterCardCreated}
            />
          </div>
        )}
        <div className="timeline-view__content">
          <div className="timeline-view__actions p-l-5px">
            <div className="timeline-view__actions-group">
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
                icon={`${showNoDuePanel ? 'chevron-left' : 'chevron-right'}`}
                onClick={this.toggleShowNoDuePanel}
              />
              <TimelineTimeframeSelector
                color={card_font_color}
                className="timeline-view__timeframe"
                columnMode={columnMode}
                value={timeframeDate}
                onChange={this.handleTimeframeDateChange}
              />
            </div>
            <div className="timeline-view__actions-group">
              <TimelineModeSelector
                color={card_font_color}
                className="timeline-view__mode-selector"
                value={columnMode}
                onChange={this.handleTimelineModeChange}
              />
              <ActiveFiltersPanel />
            </div>
          </div>
          <TimelineGrid
            cards={sortedCards}
            cardRequirements={cardRequirements}
            className="timeline-view__timeline"
            columnMode={columnMode}
            noDueVisible={showNoDuePanel}
            timeframeDate={timeframeDate}
            topicId={topic && topic.id}
          />
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
    displayLeftMenu: sm.menus.displayLeftMenu
  };
};

const mapDispatch = {
  moveOrCopyCardInOrToTopicFromDragAndDrop,
  setEditCardModalOpen,
  updateCard
};

export default connect(
  mapState,
  mapDispatch
)(TimelineView);
