import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { object } from 'prop-types';

import { failure } from 'Utils/toast';
import { stateMappings } from 'newRedux/stateMappings';
import AssignedLane from './AssignedLane';
import GenericDragDropListing from '../../../shared/drag_and_drop/GenericDragDropListing';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import AssignedCard from './AssignedCard';
import ViewTopBar from 'Components/shared/assemblies/ViewTopBar';
import { addRemoveAssignedUsersOnCard } from 'Src/newRedux/database/cards/thunks';
import { moveOrCopyCardInOrToTopicFromDragAndDrop } from 'Src/newRedux/database/cards/abstractions';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';

import { getSelectedPeopleOrder } from 'Src/newRedux/database/peopleOrders/selectors';
import { updateOrCreatePeopleOrder } from 'Src/newRedux/database/peopleOrders/abstractions';
import { yayDesign } from 'Src/lib/utilities';
import IconButton from 'Components/shared/buttons/IconButton';
import AddCardCard from 'Components/shared/cards/AddCardCard';
import Ability from 'Lib/ability';
import DMLoader from 'Src/dataManager/components/DMLoader';
import {
  scrollToShow,
  getSidePaneArrowTop,
  getSidePaneArrowLeft
} from 'Src/lib/utilities';

const alphabet = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
];

const AlphaFilter = ({ currentFilter, onClick, color }) => (
  <div className="assigned-view_alpha-filter-bar">
    <IconButton
      additionalIconClasses={`grey-link ${!currentFilter && 'active'}`}
      fontAwesome
      icon="globe"
      color={color}
      onClick={() => onClick()}
    />
    {alphabet.map(letter => (
      <a
        className={`dark-grey-link w400 ${currentFilter == letter && 'active'}`}
        onClick={() => onClick(letter)}
        key={letter}
      >
        {letter}
      </a>
    ))}
  </div>
);

const AssignedLaneDragPreview = ({ person }) => (
  <div className="assigned-lane_drag-preview">
    <UserAvatar user={person} showName />
  </div>
);

class AssignedView extends PureComponent {
  state = {
    displayUnassignedPanel: true,
    currentFilter: '',
    newLane: null,
    inInputMode: false
  };

  viewRef = React.createRef();

  static propTypes = {
    topic: object
  };

  toggleUnassignedPanel = () => {
    this.setState(prevState => {
      return { displayUnassignedPanel: !prevState.displayUnassignedPanel };
    });
  };

  handleApplyFilter = filterLetter => {
    this.setState({ currentFilter: filterLetter });
  };

  handleChangePersonForLane = (prevPerson, newPersonId) => {
    const { peopleOrderPeopleIds, updateOrCreatePeopleOrder } = this.props;
    const revisedPeopleOrderPeopleIds = peopleOrderPeopleIds.filter(
      id => id != newPersonId
    ); //map is temp solution as server returning ints

    prevPerson
      ? revisedPeopleOrderPeopleIds.splice(
          revisedPeopleOrderPeopleIds.indexOf(prevPerson.id),
          1,
          newPersonId
        )
      : revisedPeopleOrderPeopleIds.push(newPersonId);
    updateOrCreatePeopleOrder(revisedPeopleOrderPeopleIds);
    this.setState({ newLane: newPersonId });
  };

  handleDropCard = ({ droppedItemProps, dropZoneProps, itemOrder }) => {
    const {
      addRemoveAssignedUsersOnCard,
      moveOrCopyCardInOrToTopicFromDragAndDrop,
      ctrlKeyDown
    } = this.props;

    if (Ability.can('update', 'self', droppedItemProps.item)) {
      if (droppedItemProps.origin.personId != dropZoneProps.personId) {
        const addUsers = [dropZoneProps.personId];
        const removeUsers = !ctrlKeyDown
          ? [droppedItemProps.origin.personId]
          : undefined;

        addRemoveAssignedUsersOnCard(
          droppedItemProps.item,
          addUsers,
          removeUsers
        );
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
    const { updateOrCreatePeopleOrder } = this.props;
    updateOrCreatePeopleOrder(itemOrder.map(label => label.id));
  };

  handleRemoveLane = personId => {
    const { peopleOrderPeopleIds, updateOrCreatePeopleOrder } = this.props;
    const order = peopleOrderPeopleIds.filter(id => id != personId);
    updateOrCreatePeopleOrder(order);
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
      topic,
      peopleOrderPeople,
      cards,
      displayLeftSubtopicMenuForTopic,
      inInputMode,
      displayLeftMenu,
      active_design
    } = this.props;
    const { displayUnassignedPanel, currentFilter, newLane } = this.state;
    const topicId = topic ? topic.id : null;
    const {
      card_font_color,
      card_background_color,
      card_background_color_display
    } = active_design || {};
    const filteredPeopleOrderPeople = currentFilter
      ? peopleOrderPeople.filter(
          person =>
            person.attributes.name &&
            person.attributes.name.charAt(0).toUpperCase() == currentFilter
        )
      : peopleOrderPeople;

    const unassignedCards = cards.filter(
      card =>
        card.relationships.tip_assignments.data.length == 0 ||
        card.relationships.tip_assignments.data[0] == null
    );

    return (
      <div ref={this.viewRef} className="kanban-view">
        <aside
          className={`left-list kanban-view_unlabelled-panel ${
            displayUnassignedPanel ? 'presented' : ''
          }`}
        >
          {displayUnassignedPanel && (
            <Fragment>
              <GenericDragDropListing
                dropClassName="kanban-view_lane-catchment"
                dragClassName="task-view_drag-card"
                dropZoneProps={{ personId: null, topicId: topicId }}
                draggedItemProps={{
                  origin: { personId: null, topicId: topicId }
                }}
                itemContainerClassName=""
                itemList={unassignedCards}
                itemType={dragItemTypes.CARD}
                onDropItem={this.handleDropCard}
                renderItem={card => (
                  <AssignedCard card={card} topicId={topicId} />
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

        <div className="kanban-view_main-section assigned-view_main-section">
          <div className="kanban-view_top-bar">
            <IconButton
              containerClasses="left-section-icon-container"
              wrapperClasses="left-section-icon"
              color={card_font_color}
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
              icon={`${
                displayUnassignedPanel ? 'chevron-left' : 'chevron-right'
              }`}
              onClick={() =>
                this.setState({
                  displayUnassignedPanel: !displayUnassignedPanel
                })
              }
            />
            <ViewTopBar showAddCardButton={false} showFilters topic={topic}>
              <AlphaFilter
                color={card_font_color}
                currentFilter={currentFilter}
                onClick={this.handleApplyFilter}
              />
            </ViewTopBar>
          </div>

          <div className="kanban-view_lanes-container">
            <GenericDragDropListing
              dropClassName="kanban-view_lanes"
              dragClassName="kanban-lane_drag-container"
              dragPreview={person => (
                <AssignedLaneDragPreview person={person} />
              )}
              dropZoneProps={{ topicId: topicId }}
              draggedItemProps={{ origin: { topicId: topicId } }}
              itemContainerClassName="kanban-lane_drag-container"
              itemList={filteredPeopleOrderPeople}
              itemType={dragItemTypes.PERSON}
              keyExtractor={person => person.id}
              onDropItem={this.handleDropLane}
              renderItem={person => (
                <AssignedLane
                  cardRequirements={cardRequirements}
                  cards={cards}
                  key={person.id}
                  newLane={newLane}
                  onChangePersonForLane={this.handleChangePersonForLane}
                  onDropCard={this.handleDropCard}
                  onRemoveLane={this.handleRemoveLane}
                  person={person}
                  topicId={topicId}
                />
              )}
            />

            <AssignedLane
              cards={[]}
              person={null}
              onChangePersonForLane={this.handleChangePersonForLane}
              topicId={topicId}
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
  const selectedPeopleOrder = getSelectedPeopleOrder(state);
  const peopleOrderPeopleIds = selectedPeopleOrder
    ? selectedPeopleOrder.attributes.order.filter(userId => !!sm.people[userId])
    : [];
  const topic = topicId && topics[topicId];
  const active_design = yayDesign(topicId, topic);
  return {
    active_design,
    displayLeftSubtopicMenuForTopic: sm.menus.displayLeftSubtopicMenuForTopic,
    displayLeftMenu: sm.menus.displayLeftMenu,
    confirmedNewOrChangeOrderIds:
      sm.session.peopleOrdersUserHasConfirmedNewOrChangeOrder,
    people: sm.people,
    peopleOrderPeopleIds: peopleOrderPeopleIds,
    peopleOrderPeople: peopleOrderPeopleIds.map(id => sm.people[id]),
    selectedPeopleOrder: selectedPeopleOrder,
    ctrlKeyDown: sm.utilities.ctrlKeyDown,
    informedNoSelectedOrder:
      sm.session.topicsUserHasBeenInformedNoSelectedPeopleOrder
  };
};

const mapDispatch = {
  addRemoveAssignedUsersOnCard,
  moveOrCopyCardInOrToTopicFromDragAndDrop,
  updateOrCreatePeopleOrder
};

export default connect(
  mapState,
  mapDispatch
)(AssignedView);
