import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import get from 'lodash/get';
import set from 'lodash/set';
import { failure } from 'Utils/toast';
import PrioritizeContentVert from './PrioritizeContentVert';
import PrioritizeContentHori from './PrioritizeContentHori';
import PrioritizeContentHoriCard from './PrioritizeContentHoriCard';
import PrioritizeCard from './PrioritizeCard';
import AddCardCard from 'Src/components/shared/cards/AddCardCard';
import GenericDragDropListing from 'Components/shared/drag_and_drop/GenericDragDropListing';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import DMLoader from 'Src/dataManager/components/DMLoader';
import { updateCard } from 'Src/newRedux/database/cards/thunks';
import { moveOrCopyCardInOrToTopicFromDragAndDrop } from 'Src/newRedux/database/cards/abstractions';
import { toggleUnprioritizedPanel } from 'Src/newRedux/interface/menus/thunks';
import Ability from 'Lib/ability';
import { PRIORITY_LEVELS } from 'Src/constants';
import { stateMappings } from 'Src/newRedux/stateMappings';
import {
  scrollToShow,
  getSidePaneArrowTop,
  getSidePaneArrowLeft
} from 'Src/lib/utilities';
import { yayDesign } from 'Src/lib/utilities';

const ContentComponent = props => {
  switch (props.setup) {
    case 'Vertical':
      return <PrioritizeContentVert {...props} />;
    case 'Horizontal':
      return <PrioritizeContentHori {...props} />;
    case 'HorizontalCardDetails':
      return <PrioritizeContentHoriCard {...props} />;
    default:
      return <div />;
  }
};

class PrioritizeView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCardId: null,
      inInputMode: false
    };
    this.viewRef = React.createRef();

    this.setSelected = this.setSelected.bind(this);
  }

  componentDidMount() {
    const {
      props: { cards },
      state: { selectedCardId }
    } = this;
    if (cards && cards.length > 0 && !selectedCardId) {
      this.setState({ selectedCardId: cards[0].id });
    }
  }

  componentDidUpdate = () => {
    const cardIds = this.props.cards.map(card => card.id);
    if (cardIds.length > 0 && !cardIds.includes(this.state.selectedCardId)) {
      this.setSelected(cardIds[0]);
    }
  };

  handleDropCard = ({ droppedItemProps, dropZoneProps, itemOrder }) => {
    if (Ability.can('update', 'self', droppedItemProps.item)) {
      const {
        updateCard,
        moveOrCopyCardInOrToTopicFromDragAndDrop
      } = this.props;

      if (dropZoneProps.priority != droppedItemProps.origin.priority) {
        const attributes = { priority_level: dropZoneProps.priority };
        updateCard({ id: droppedItemProps.item.id, attributes });
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

  setSelected = selectedCardId => this.setState({ selectedCardId });

  toggleUnprioritizedPanel = () => {
    const { topic, toggleUnprioritizedPanelForTopic } = this.props;
    toggleUnprioritizedPanelForTopic(topic ? topic.id : '0');
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
      topic,
      cardRequirements,
      laneMap,
      displayUnprioritizedPanel,
      displayLeftSubtopicMenuForTopic,
      priorityView,
      displayLeftMenu,
      active_design
    } = this.props;
    const { selectedCardId } = this.state;
    const topicId = topic ? topic.id : null;
    const cardView = priorityView === 'HorizontalCardDetails';
    const {
      card_font_color,
      card_background_color,
      card_background_color_display
    } = active_design || {};
    return (
      <div ref={this.viewRef} className="kanban-view">
        <aside
          className={`kanban-view_unlabelled-panel ${
            displayUnprioritizedPanel ? 'presented' : ''
          }`}
        >
          {displayUnprioritizedPanel && (
            <Fragment>
              <GenericDragDropListing
                dropClassName="kanban-view_lane-catchment"
                dragClassName="task-view_drag-card"
                dropZoneProps={{ priority: null, topicId: topicId }}
                draggedItemProps={{
                  origin: { priority: null, topicId: topicId }
                }}
                itemContainerClassName="task-view_card-container"
                itemList={laneMap['Unprioritized'] || []}
                itemType={dragItemTypes.CARD}
                onDropItem={this.handleDropCard}
                renderItem={card => (
                  <PrioritizeCard
                    card={card}
                    key={card.id}
                    isSelected={card.id === selectedCardId}
                    onSelectCard={cardView ? this.setSelected : null}
                    horizontalView={priorityView === 'HorizontalCardDetails'}
                    cardView={cardView}
                    topicId={topicId}
                  />
                )}
              >
                <AddCardCard
                  cardClassName="prioritize-card"
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
        <ContentComponent
          top={getSidePaneArrowTop(this.viewRef)}
          left={`${getSidePaneArrowLeft(false) +
            (displayLeftSubtopicMenuForTopic.topicId ? 270 : 0) +
            (displayLeftMenu ? 270 : 0)}px`}
          background={card_background_color_display && card_background_color}
          color={card_font_color}
          setup={priorityView}
          cardRequirements={cardRequirements}
          priorityLevels={PRIORITY_LEVELS}
          topicId={topicId}
          onDropCard={this.handleDropCard}
          laneMap={laneMap}
          selectCard={this.setSelected}
          selectedCardId={selectedCardId}
          displayUnprioritizedPanel={displayUnprioritizedPanel}
          toggleUnprioritizedPanel={this.toggleUnprioritizedPanel}
        />
      </div>
    );
  }
}

const mapCardsToLanes = createSelector(
  ({ cards }) => cards,
  cards =>
    cards.reduce((a, b) => {
      const cardPriority = b.attributes.priority_level;
      const key = cardPriority ? cardPriority : 'Unprioritized';
      set(a, key, [...get(a, key, []), b]);
      return a;
    }, {})
);

const mapState = (state, props) => {
  const sm = stateMappings(state);
  const { page } = sm;
  const active_design = yayDesign(page.topicId, sm.topics[page.topicId]);

  return {
    active_design,
    priorityView: sm.utilities.priorityView,
    displayLeftSubtopicMenuForTopic: sm.menus.displayLeftSubtopicMenuForTopic,
    displayLeftMenu: sm.menus.displayLeftMenu,
    laneMap: mapCardsToLanes({ state, cards: props.cards }),
    displayUnprioritizedPanel: !sm.menus.unprioritizedPanelClosed[
      props.topic ? props.topic.id : '0'
    ]
  };
};

const mapDispatch = {
  toggleUnprioritizedPanelForTopic: toggleUnprioritizedPanel,
  moveOrCopyCardInOrToTopicFromDragAndDrop,
  updateCard
};

export default connect(
  mapState,
  mapDispatch
)(PrioritizeView);
