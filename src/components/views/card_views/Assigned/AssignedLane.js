import React, { Fragment, Component } from 'react';
import { array, object } from 'prop-types';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';

import AddCardCard from 'Components/shared/cards/AddCardCard';
import AssignedCard from './AssignedCard';
import DMLoader from 'Src/dataManager/components/DMLoader';
import GenericDragDropListing from '../../../shared/drag_and_drop/GenericDragDropListing';
import GenericDropZone from 'Components/shared/drag_and_drop/GenericDropZone';
import IconButton from 'Components/shared/buttons/IconButton';
import OptionsDropdownButton from 'Components/shared/buttons/OptionsDropdownButton';
import UserSelect from 'Components/shared/users/elements/UserSelect';
import { scrollToShow } from 'Src/lib/utilities';
import cx from 'classnames';

class AssignedLane extends Component {
  static propTypes = {
    person: object,
    cards: array
  };

  constructor(props) {
    super(props);
    this.state = {
      laneIsOpen:
        this.cardsAssignedToPerson(props.cards, props.person).length > 0
    };
  }

  componentDidUpdate = prevProps => {
    const { cards, person } = this.props;
    if (cards.length !== prevProps.cards.length) {
      if (
        !this.state.laneIsOpen &&
        this.cardsAssignedToPerson(cards, person).length > 0
      ) {
        this.setState({ laneIsOpen: true });
      }
    }
  };

  cardsAssignedToPerson = (cards, person) =>
    cards.filter(card =>
      card.relationships.tip_assignments.data.includes(person.id)
    );

  handleChangePersonForLane = selectedUserId => {
    const { onChangePersonForLane, person } = this.props;
    onChangePersonForLane(person, selectedUserId);
  };

  handleRemoveLane = () => {
    this.props.onRemoveLane(this.props.person.id);
  };

  toggleCollapsedView = () => {
    this.setState(prevState => {
      return { ...prevState, collapsed: !prevState.collapsed };
    });
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
      onChangePersonForLane,
      onDropCard,
      person,
      topicId
    } = this.props;
    const { laneIsOpen } = this.state;
    const personId = person ? person.id : null;
    const thisLanesCards = person
      ? this.cardsAssignedToPerson(cards, person)
      : [];

    return (
      <div className={`kanban-lane ${laneIsOpen ? 'is-open' : ''}`}>
        <div className={cx({ flex: laneIsOpen })}>
          {person ? (
            <Fragment>
              <GenericDropZone
                dropClassName="kanban-lane_open-close-button"
                dropsDisabled
                itemType={dragItemTypes.CARD}
                onDragEnter={() => this.setState({ laneIsOpen: true })}
              >
                <IconButton
                  additionalClasses="large"
                  additionalIconClasses="large"
                  fontAwesome
                  icon={`${laneIsOpen ? 'minus-circle' : 'plus-circle'}`}
                  onClick={() => this.setState({ laneIsOpen: !laneIsOpen })}
                />
              </GenericDropZone>
            </Fragment>
          ) : (
            <div className="kanban-lane_open-close-button">
              <IconButton
                additionalClasses="large kanban-lane_open-close-button"
                additionalIconClasses="large"
                fontAwesome
                icon={`${laneIsOpen ? 'minus-circle' : 'plus-circle'}`}
                onClick={() => this.setState({ laneIsOpen: !laneIsOpen })}
              />
            </div>
          )}

          {laneIsOpen ? (
            <div className="kanban-lane_open-header">
              <UserSelect
                onSelectUser={this.handleChangePersonForLane}
                selectedUser={person}
              />
              <OptionsDropdownButton>
                <a
                  className="dropdown-option-item"
                  onClick={this.handleRemoveLane}
                >
                  Remove Lane
                </a>
              </OptionsDropdownButton>
            </div>
          ) : (
            <div className="kanban-lane_closed-header">
              <div className="kanban-lane_closed-label">
                {person
                  ? `${person.attributes.name} (${thisLanesCards.length})`
                  : 'Select Person'}{' '}
              </div>
            </div>
          )}
        </div>

        {person && laneIsOpen && (
          <GenericDragDropListing
            dropClassName="kanban-view_lane-catchment"
            dragClassName="task-view_drag-card"
            dropZoneProps={{ personId: personId, topicId: topicId }}
            draggedItemProps={{
              origin: { personId: personId, topicId: topicId }
            }}
            itemContainerClassName=""
            itemList={thisLanesCards}
            itemType={dragItemTypes.CARD}
            onDropItem={onDropCard}
            renderItem={card => (
              <AssignedCard card={card} key={card.id} topicId={topicId} />
            )}
            style={{ display: laneIsOpen ? 'block' : 'none' }}
          >
            <AddCardCard
              cardClassName="kanban-card"
              newCardRelationships={{ tip_assignments: { data: [personId] } }}
              topicId={topicId}
              cardStyle={{ display: laneIsOpen ? 'block' : 'none' }}
              afterCardCreated={this.afterCardCreated}
            />

            <DMLoader
              dataRequirements={{
                cardsWithAttributes: {
                  attributes: {
                    ...cardRequirements,
                    assignedId: personId,
                    topicId
                  }
                }
              }}
              style={{ display: laneIsOpen ? 'block' : 'none' }}
              loaderKey="cardsWithAttributes"
            />
          </GenericDragDropListing>
        )}
      </div>
    );
  }
}

export default AssignedLane;
