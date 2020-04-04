/* global vex */
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { array, func, object } from 'prop-types';
import get from 'lodash/get';
import set from 'lodash/set';
import { createSelector } from 'reselect';
import Ability from 'Lib/ability';
import { failure } from 'Utils/toast';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import ActiveFiltersPanel from 'Components/shared/filters/ActiveFiltersPanel';
import { getSelectedLabelOrder } from 'Src/newRedux/database/labelOrders/selectors';
import {
  addLabelOrderIdToLabelOrderNewOrChangeConfirmed,
  addTopicIdToNoSelectedLabelOrderInformed
} from 'Src/newRedux/session/actions';
import { addRemoveLabelsOnCard } from 'Src/newRedux/database/cards/thunks';
import { moveOrCopyCardInOrToTopicFromDragAndDrop } from 'Src/newRedux/database/cards/abstractions';
import { createLabelOrder } from 'Src/newRedux/database/labelOrders/thunks';
import { updateOrCreateLabelOrder } from 'Src/newRedux/database/labelOrders/abstractions';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';
import { yayDesign } from 'Src/lib/utilities';
import DMLoader from 'Src/dataManager/components/DMLoader';
import GenericDragDropListing from 'Components/shared/drag_and_drop/GenericDragDropListing';
import IconButton from 'Components/shared/buttons/IconButton';
import KanbanLane from './KanbanLane';
import KanbanCard from './KanbanCard';
import LabelIndicatorBar from 'Components/shared/labels/elements/LabelIndicatorBar';
import AddCardCard from 'Components/shared/cards/AddCardCard';
import {
  scrollToShow,
  getSidePaneArrowTop,
  getSidePaneArrowLeft
} from 'Src/lib/utilities';

const KanbanLaneDragPreview = ({ label }) => (
  <div className="kanban-lane_drag-preview">
    <LabelIndicatorBar labels={[label]} />
    <div className="kanban-lane_drag-preview-title">
      {label.attributes.name}
    </div>
  </div>
);

class KanbanView extends PureComponent {
  static propTypes = {
    createLabelOrder: func.isRequired,
    addRemoveLabelsOnCard: func.isRequired,
    group: object,
    labelOrderLabelIds: array.isRequired,
    laneMap: object.isRequired,
    topic: object
  };
  viewRef = React.createRef();

  state = {
    displayUnlabelledPanel: true,
    newLane: null,
    inInputMode: false
  };

  componentDidUpdate() {
    const {
      selectedLabelOrder,
      topic,
      informedNoSelectedOrder = [],
      topicDefaultLabelOrderId
    } = this.props;
    if (!selectedLabelOrder && !topicDefaultLabelOrderId) {
      if (
        topic &&
        topic.relationships &&
        !informedNoSelectedOrder.includes(topic.id)
      ) {
        this.handleNoLabelOrderSelected();
      }
    }
  }

  handleChangeLabelForLane = (prevLabel, newLabelId) => {
    const { labelOrderLabelIds, updateOrCreateLabelOrder } = this.props;
    const revisedLabelOrderLabelIds = labelOrderLabelIds.filter(
      id => id != newLabelId
    ); //map is temp solution as server returning ints

    prevLabel
      ? revisedLabelOrderLabelIds.splice(
          revisedLabelOrderLabelIds.indexOf(prevLabel.id),
          1,
          newLabelId
        )
      : revisedLabelOrderLabelIds.push(newLabelId);

    updateOrCreateLabelOrder(revisedLabelOrderLabelIds);

    this.setState({ newLane: newLabelId });
  };

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

  handleDropLane = ({ itemOrder }) => {
    const { updateOrCreateLabelOrder } = this.props;
    updateOrCreateLabelOrder(itemOrder.map(label => label.id));
  };

  handleNoLabelOrderSelected = () => {
    const {
      addTopicIdToNoSelectedLabelOrderInformed,
      setRightMenuOpenForMenu,
      topic
    } = this.props;
    addTopicIdToNoSelectedLabelOrderInformed(topic ? topic.id : '0');
    setRightMenuOpenForMenu('Orders_Labels');
    topic &&
      vex.dialog.alert({
        message:
          'There is no default label order for this view.  You can select a label order in the Label Orders menu on the right'
      });
  };

  handleRemoveLane = labelId => {
    const { labelOrderLabelIds, updateOrCreateLabelOrder } = this.props;
    const order = labelOrderLabelIds.filter(id => id != labelId);
    updateOrCreateLabelOrder(order);
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
      laneMap,
      labelOrderLabels,
      topic,
      displayLeftSubtopicMenuForTopic,
      displayLeftMenu,
      active_design
    } = this.props;
    const { displayUnlabelledPanel, newLane, inInputMode } = this.state;
    const topicId = topic ? topic.id : null;
    const {
      card_font_color,
      card_background_color,
      card_background_color_display
    } = active_design || {};
    return (
      <div ref={this.viewRef} className="kanban-view">
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
          fontAwesome
          color={card_font_color}
          icon={`${displayUnlabelledPanel ? 'chevron-left' : 'chevron-right'}`}
          onClick={() =>
            this.setState({
              displayUnlabelledPanel: !displayUnlabelledPanel
            })
          }
        />
        <aside
          className={`kanban-view_unlabelled-panel ${
            displayUnlabelledPanel ? 'presented' : ''
          }`}
        >
          {displayUnlabelledPanel && (
            <Fragment>
              <GenericDragDropListing
                dropClassName="kanban-view_lane-catchment"
                dragClassName="task-view_drag-card"
                dropZoneProps={{ labelId: null, topicId: topicId }}
                draggedItemProps={{
                  origin: { labelId: null, topicId: topicId }
                }}
                itemContainerClassName=""
                itemList={laneMap['unlabelled'] || []}
                itemType={dragItemTypes.CARD}
                onDropItem={this.handleDropCard}
                renderItem={card => (
                  <KanbanCard card={card} key={card.id} topicId={topicId} />
                )}
              >
                <AddCardCard
                  cardClassName="kanban-card"
                  topicId={topicId}
                  inInputMode={inInputMode}
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
        <div className="kanban-view_main-section">
          <ActiveFiltersPanel />
          <div className="kanban-view_lanes-container">
            <GenericDragDropListing
              dropClassName="kanban-view_lanes"
              dragClassName="kanban-lane_drag-container"
              dragPreview={label => <KanbanLaneDragPreview label={label} />}
              dropZoneProps={{ topicId: topicId }}
              draggedItemProps={{ origin: { topicId: topicId } }}
              itemContainerClassName="kanban-lane_drag-container"
              itemList={labelOrderLabels}
              itemType={dragItemTypes.LABEL}
              keyExtractor={label => label.id}
              onDropItem={this.handleDropLane}
              renderItem={label => (
                <KanbanLane
                  cardRequirements={cardRequirements}
                  cards={laneMap[label.id] || []}
                  label={label}
                  labelId={label.id}
                  newLane={newLane}
                  onChangeLabelForLane={this.handleChangeLabelForLane}
                  onDropCard={this.handleDropCard}
                  onRemoveLane={this.handleRemoveLane}
                  topicId={topicId}
                />
              )}
            />

            <KanbanLane
              cards={[]}
              labelId={null}
              label={undefined}
              onChangeLabelForLane={this.handleChangeLabelForLane}
              topicId={topicId}
            />
          </div>
        </div>
      </div>
    );
  }
}

//A selector that maps cards to labels:
const mapCardsToKanbanLanes = createSelector(
  ({ cards }) => cards,
  ({ labelOrderLabelIds }) => labelOrderLabelIds,
  (cards, labelOrderLabelIds) =>
    cards.reduce((a, b) => {
      const firstMatchingLabelId = labelOrderLabelIds.find(labelId =>
        b.relationships.labels.data.includes(labelId)
      );
      const key = firstMatchingLabelId ? firstMatchingLabelId : 'unlabelled';
      set(a, key, [...get(a, key, []), b]);
      return a;
    }, {})
);

const mapState = (state, props) => {
  const sm = stateMappings(state);
  const {
    page: { topicId },
    topics
  } = sm;
  const selectedLabelOrder = getSelectedLabelOrder(state);
  const labelOrderLabelIds = selectedLabelOrder
    ? selectedLabelOrder.attributes.order.filter(
        labelId => !!sm.labels[labelId]
      )
    : [];
  const topic = topicId && topics[topicId];
  const active_design = yayDesign(topicId, topic);

  return {
    active_design,
    confirmedNewOrChangeOrderIds:
      sm.session.labelOrdersUserHasConfirmedNewOrChangeOrder,
    labels: sm.labels,
    labelOrderLabelIds: labelOrderLabelIds,
    labelOrderLabels: labelOrderLabelIds.map(id => sm.labels[id]),
    laneMap: mapCardsToKanbanLanes({
      state,
      cards: props.cards,
      labelOrderLabelIds
    }),
    displayLeftSubtopicMenuForTopic: sm.menus.displayLeftSubtopicMenuForTopic,
    displayLeftMenu: sm.menus.displayLeftMenu,
    selectedLabelOrder: selectedLabelOrder,
    informedNoSelectedOrder:
      sm.session.topicsUserHasBeenInformedNoSelectedLabelOrder,
    topicDefaultLabelOrderId: topic
      ? get(topic, 'relationships.label_order.data')
      : null
  };
};

const mapDispatch = {
  addLabelOrderIdToLabelOrderNewOrChangeConfirmed,
  addRemoveLabelsOnCard,
  addTopicIdToNoSelectedLabelOrderInformed,
  createLabelOrder,
  moveOrCopyCardInOrToTopicFromDragAndDrop,
  setRightMenuOpenForMenu,
  updateOrCreateLabelOrder
};

export default connect(
  mapState,
  mapDispatch
)(KanbanView);
