/* global vex */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Ability from 'Lib/ability';
import { stateMappings } from 'Src/newRedux/stateMappings';
import isUndefined from 'lodash/isUndefined';
import CardDetails from './CardDetails';
import CardCard from './CardCard';
import ActiveFiltersPanel from 'Components/shared/filters/ActiveFiltersPanel';
import { yayDesign } from 'Src/lib/utilities';
import IconButton from 'Components/shared/buttons/IconButton';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import GenericDragDropListing from 'Components/shared/drag_and_drop/GenericDragDropListing';
import DMLoader from 'Src/dataManager/components/DMLoader';
import AddCardCard from 'Components/shared/cards/AddCardCard';
import { moveOrCopyCardInOrToTopicFromDragAndDrop } from 'Src/newRedux/database/cards/abstractions';
import {
  scrollToShow,
  getSidePaneArrowTop,
  getSidePaneArrowLeft
} from 'Src/lib/utilities';

class CardView extends Component {
  // static propTypes = {
  //   group: PropTypes.object,
  //   showTopicFilterView: PropTypes.bool,
  //   items: PropTypes.array.isRequired,
  //   topic: PropTypes.object,
  //   isEditing: PropTypes.bool,
  //   showEdit: PropTypes.func.isRequired,
  //   hideEdit: PropTypes.func.isRequired,
  //   filterBySlug: PropTypes.func.isRequired,
  //   reset: PropTypes.func.isRequired,
  //   cardViewTip: PropTypes.object,
  //   filterCardViewById: PropTypes.func.isRequired,
  //   resetCardView: PropTypes.func.isRequired,
  //   itemAddActive: PropTypes.bool,
  //   router: PropTypes.object.isRequired,
  //   currentUser: PropTypes.object,
  //   isHexGridVisible: PropTypes.bool,
  // };

  constructor(props) {
    super(props);
    this.state = {
      showCardList: true,
      autoSaveEditItem: false, //true,
      isEditing: false,
      action: null,
      height: 0,
      cardViewTip: null,
      selectedCardId: null,
      inInputMode: false
    };

    this.viewRef = React.createRef();
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

  componentDidUpdate() {
    const { inInputMode, cards } = this.props;
    const defaultCard = cards[0];

    if (!this.state.selectedCardId && defaultCard && defaultCard.id) {
      this.setState({ selectedCardId: defaultCard.id });
    }

    if (!isUndefined(inInputMode) && inInputMode !== this.state.inInputMode) {
      this.setState({ inInputMode });
    }
  }

  handleDropCard = ({ droppedItemProps, dropZoneProps, itemOrder }) => {
    if (Ability.can('update', 'self', droppedItemProps.item)) {
      const {
        addRemoveLabelsOnCard,
        moveOrCopyCardInOrToTopicFromDragAndDrop
      } = this.props;

      if (dropZoneProps.labelId != droppedItemProps.origin.labelId) {
        const newLabel = dropZoneProps.labelId ? [dropZoneProps.labelId] : [];
        const oldLabel = droppedItemProps.origin.labelId
          ? [droppedItemProps.origin.labelId]
          : [];
        addRemoveLabelsOnCard(droppedItemProps.item, newLabel, oldLabel);
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

  /**
   * On editor scrolling event handler.
   *
   * @param {Event} e
   * @param {Node}  toolbarEl
   * @return  {Void}
   */
  handleEditorScroll = (e, toolbarEl) => {
    if (e.currentTarget.scrollTop >= 191) {
      // 191px is when the first line of text gone from view port while scrolling
      if (toolbarEl && !toolbarEl.classList.contains('fixed')) {
        toolbarEl.classList.add('fixed');
      }
    } else {
      if (toolbarEl && toolbarEl.classList.contains('fixed')) {
        toolbarEl.classList.remove('fixed');
      }
    }
  };

  toggleLeftPane = () =>
    this.setState(state => ({ ...state, showCardList: !state.showCardList }));

  handleToggleInputMode = () =>
    this.setState(state => ({ inInputMode: !state.inInputMode }));

  afterCardCreated = cardId => {
    const elem = document.querySelector('.card-title.c' + cardId);
    scrollToShow(elem, 14, 24);
  };

  render() {
    const {
      cardRequirements,
      cards,
      topic,
      displayLeftSubtopicMenuForTopic,
      displayLeftMenu,
      active_design
    } = this.props;
    const { showCardList, selectedCardId } = this.state;

    const topicId = topic ? topic.id : null;
    const {
      card_font_color,
      card_background_color,
      card_background_color_display
    } = active_design || {};
    return (
      <div ref={this.viewRef} className="card-view">
        <div className={`card-view-list ${showCardList ? 'presented' : ''}`}>
          <GenericDragDropListing
            dragClassName="task-view_drag-card"
            dropZoneProps={{ topicId }}
            draggedItemProps={{ origin: { topicId } }}
            itemContainerClassName="task-view_card-container"
            itemList={cards}
            itemType={dragItemTypes.CARD}
            onDropItem={this.handleDropCard}
            renderItem={card => (
              <CardCard
                card={card}
                key={card.id}
                onClick={id => this.setState({ selectedCardId: id })}
                selectedCardId={selectedCardId}
                topicId={topicId}
              />
            )}
          >
            <AddCardCard
              afterCardCreated={cardId =>
                this.setState({ selectedCardId: cardId })
              }
              cardClassName="kanban-card"
              topicId={topicId}
              inInputMode={this.state.inInputMode}
            />
            <DMLoader
              dataRequirements={{
                cardsWithAttributes: { attributes: { ...cardRequirements } }
              }}
              loaderKey="cardsWithAttributes"
            />
          </GenericDragDropListing>
        </div>
        <IconButton
          containerClasses="left-section-icon-container"
          wrapperClasses="left-section-icon"
          style={{
            top: getSidePaneArrowTop(this.viewRef),
            backgroundColor:
              card_background_color_display && card_background_color
                ? card_background_color
                : '#fafafa',
            left: `${getSidePaneArrowLeft(false) +
              (displayLeftSubtopicMenuForTopic.topicId ? 270 : 0) +
              (displayLeftMenu ? 270 : 0)}px`
          }}
          fontAwesome
          color={card_font_color}
          icon={`${showCardList ? 'chevron-left' : 'chevron-right'}`}
          onClick={this.toggleLeftPane}
        />
        <div
          className={`card-view-main-section ${
            showCardList ? 'card-list-shown' : 'card-list-hidden'
          }`}
        >
          <ActiveFiltersPanel />
          <CardDetails
            cardId={selectedCardId}
            onEditorScroll={this.handleEditorScroll}
            rootContainerClass="card-view"
            showMinMax
          />
        </div>
      </div>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);
  const topicId = sm.page.topicId;
  const active_design = yayDesign(topicId, sm.topics[topicId]);

  return {
    active_design,
    displayLeftSubtopicMenuForTopic: sm.menus.displayLeftSubtopicMenuForTopic,
    displayLeftMenu: sm.menus.displayLeftMenu,
    topic: sm.topics[topicId],
    topicId: topicId,
    currentUser: sm.user,
    isEditing: sm.modals.displayEditCardModal,
    group: Object.values(sm.groups)[0]
  };
};

const mapDispatch = {
  moveOrCopyCardInOrToTopicFromDragAndDrop
};

export default connect(
  mapState,
  mapDispatch
)(CardView);
