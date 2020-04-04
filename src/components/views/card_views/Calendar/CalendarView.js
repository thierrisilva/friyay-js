import React, { Component } from 'react';
import moment from 'moment';
import GenericDragDropListing from 'Components/shared/drag_and_drop/GenericDragDropListing';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import { updateCard } from 'Src/newRedux/database/cards/thunks';
import ActiveFiltersPanel from 'Components/shared/filters/ActiveFiltersPanel';
import TimelineTimeframeSelector from 'Components/shared/TimelineTimeframeSelector';
import TimelineModeSelector from 'Components/shared/TimelineModeSelector';
import withDataManager from 'Src/dataManager/components/withDataManager';
import LoadingIndicator from 'Components/shared/LoadingIndicator';
import AddCardCard from 'Components/shared/cards/AddCardCard';
import IconButton from 'Components/shared/buttons/IconButton';
import CalendarCard from './CalendarCard';
import CalendarViewGrid from './CalendarViewGrid';
import { getSidePaneArrowTop, getSidePaneArrowLeft } from 'Src/lib/utilities';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { yayDesign } from 'Src/lib/utilities';

class CalendarView extends Component {
  state = {
    noDueCards: [],
    dueCards: [],
    showNoDuePanel: true,
    columnMode: 'months',
    timeframeDate: moment().startOf('hour')
  };

  viewRef = React.createRef();

  componentDidMount() {
    this.updateCardsState(this.props.cards);
  }

  componentDidUpdate({ cards }) {
    if (cards !== this.props.cards) {
      this.updateCardsState(this.props.cards);
    }
  }

  updateCardsState(cards) {
    let noDueCards = [];
    let dueCards = [];

    cards.forEach(card => {
      const hasNoDates = !!card.attributes.due_date;

      if (hasNoDates) {
        dueCards.push(card);
      } else {
        noDueCards.push(card);
      }
    });

    this.setState({ noDueCards, dueCards });
  }

  toggleShowNoDuePanel = () => {
    this.setState(prevState => ({ showNoDuePanel: !prevState.showNoDuePanel }));
  };

  handleTimelineModeChange = columnMode => {
    const updates = { columnMode };

    if (columnMode === 'weeks' || columnMode === 'weeksWD') {
      updates.timeframeDate = this.state.timeframeDate.clone().startOf('month');
    }

    this.setState(updates);
  };

  handleTimeframeDateChange = timeframeDate => {
    this.setState({ timeframeDate });
  };

  handleToggleInputMode = () => {
    this.setState(state => ({ inInputMode: !state.inInputMode }));
  };

  render() {
    const {
      cardRequirements,
      topic,
      dmLoading,
      displayLeftSubtopicMenuForTopic,
      displayLeftMenu,
      active_design
    } = this.props;
    const topicId = topic ? topic.id : null;
    const {
      card_font_color,
      card_background_color,
      card_background_color_display
    } = active_design || {};
    return (
      <div ref={this.viewRef} className="planning-view calendar-view">
        {this.state.showNoDuePanel && (
          <div className="calendar-view__no-due-panel">
            <GenericDragDropListing
              dragClassName=""
              dropClassName="calendar-view__drop-zone"
              dropZoneProps={{ topicId: topicId }}
              draggedItemProps={{ origin: { topicId: topicId } }}
              itemContainerClassName=""
              itemList={this.state.noDueCards || []}
              itemType={dragItemTypes.CARD}
              onDropItem={({ droppedItemProps: { item } }) => {
                if (item) {
                  this.props.updateCard({
                    id: item.id,
                    attributes: { due_date: null, start_date: null },
                    relationships: { tip_assignments: { data: [] } }
                  });
                }
              }}
              renderItem={card => (
                <CalendarCard
                  card={card}
                  className="planning-view__no-due-card"
                  compactView
                  topicId={topicId}
                />
              )}
            >
              {dmLoading && <LoadingIndicator />}
            </GenericDragDropListing>
            <AddCardCard
              cardClassName="planning-card"
              topicId={topicId}
              inInputMode={this.state.inInputMode}
              afterCardCreated={this.afterCardCreated}
            />
          </div>
        )}

        <div className="planning-view__content">
          <div className="planning-view__actions p-l-5px p-t-10px">
            <div className="planning-view__actions-group">
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
                icon={`${
                  this.state.showNoDuePanel ? 'chevron-left' : 'chevron-right'
                }`}
                onClick={this.toggleShowNoDuePanel}
              />
              <TimelineTimeframeSelector
                className="planning-view__timeframe"
                columnMode={this.state.columnMode}
                value={this.state.timeframeDate}
                onChange={this.handleTimeframeDateChange}
                view="calendar"
                color={card_font_color}
              />
            </div>
            <div className="planning-view__actions-group">
              <TimelineModeSelector
                color={card_font_color}
                className="planning-view__mode-selector"
                value={this.state.columnMode}
                onChange={this.handleTimelineModeChange}
                view="calendar"
              />
              <ActiveFiltersPanel />
            </div>
          </div>

          <CalendarViewGrid
            cardRequirements={cardRequirements}
            cards={this.state.dueCards || []}
            className="planning-view__timeline"
            columnMode={this.state.columnMode}
            timeframeDate={this.state.timeframeDate}
            topicId={topicId}
            dmLoading={dmLoading}
          />
        </div>
      </div>
    );
  }
}

const dataRequirements = ({ user, cardRequirements }) => ({
  cardsWithAttributes: {
    attributes: {
      ...cardRequirements,
      personId: user && user.id
    }
  }
});

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
  updateCard
};

export default withDataManager(dataRequirements, mapState, mapDispatch, {
  dontShowLoadingIndicator: true
})(CalendarView);
