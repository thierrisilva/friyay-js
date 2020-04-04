import classNames from 'classnames';
import moment from 'moment';
import React, { Fragment } from 'react';
import get from 'lodash/get';
import { array, func, number, object, string } from 'prop-types';
import { connect } from 'react-redux';

import Ability from 'Lib/ability';
import CardTitleLink from 'Components/shared/cards/elements/CardTitleLink';
import AddCardCard from 'Components/shared/cards/AddCardCard';
import CardActionsDropdown from 'Components/shared/cards/elements/CardActionsDropdown';
import CardLabels from 'Components/shared/cards/elements/assemblies/CardLabels';
import Icon from 'Components/shared/Icon';
import IconButton from 'Components/shared/buttons/IconButton';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import {
  dragItemTypes,
  GenericDragDropListing
} from 'Components/shared/drag_and_drop/_index';
import {
  nestCardUnderCard as nestCardUnderCardAction,
  updateCard,
  viewCard
} from 'Src/newRedux/database/cards/thunks';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { failure } from 'Utils/toast';
import GenericDropZone from 'Src/components/shared/drag_and_drop/GenericDropZone.js';
import GenericCard from 'Components/views/card_views/GenericCard';
import DateInput from 'Components/shared/forms/DateInput';

class TodoCard extends GenericCard {
  static defaultProps = { level: 0 };

  static propTypes = {
    allCardsHash: object.isRequired,
    card: object.isRequired,
    dragLeaveHandlersForParentLists: array,
    level: number,
    nestCardUnderCard: func.isRequired,
    topicId: string,
    updateCard: func.isRequired,
    viewCard: func.isRequired,
    color: string
  };

  state = {
    cardTitle: this.props.card.attributes.title,
    inEditMode: false,
    showNestedCards: !!get(
      this.props.card,
      'relationships.nested_tips.data.length'
    ),
    showNewCardInput: false
  };

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown, true);
  }

  handleDropCard = ({ droppedItemProps, dropZoneProps, itemOrder }) => {
    this.props.nestCardUnderCard({
      nestedCard: droppedItemProps.item,
      parentCard: this.props.allCardsHash[dropZoneProps.cardId],
      fromTopicId: droppedItemProps.origin.topicId,
      toTopicId: dropZoneProps.topicId,
      itemOrder
    });
  };

  handleKeyDown = e => {
    if (e.key == 'Escape' || e.keyCode == 27) {
      this.setState({ inEditMode: false });
    }
  };

  handleNewCardInputButtonClick = () => {
    this.setState({
      showNestedCards: true,
      showNewCardInput: !this.state.showNewCardInput
    });
  };

  handleToggleCompleteCard = card => {
    const { updateCard } = this.props;

    if (Ability.can('update', 'self', card)) {
      const { completed_percentage, completion_date } = card.attributes;
      const attributes = {
        completion_date: completion_date ? null : moment().toISOString(),
        completed_percentage: completed_percentage == 100 ? 0 : 100
      };

      updateCard({ id: card.id, attributes });
    } else {
      failure("You don't have permission to complete that card!");
    }
  };

  handleSaveTitleChange = () => {
    this.handleToggleEditMode();
    const { card, updateCard } = this.props;
    const attributes = {
      title: this.state.cardTitle
    };
    updateCard({ id: card.id, attributes });
  };

  handleTitleChange = cardTitle => {
    this.setState({ cardTitle });
  };

  handleToggleEditMode = () => {
    const inEditMode = this.state.inEditMode;
    this.setState({ inEditMode: !inEditMode });
    inEditMode
      ? window.removeEventListener('keydown', this.handleKeyDown, true)
      : window.addEventListener('keydown', this.handleKeyDown, true);
  };

  toggleDatePicker = () => {
    this.setState({ showDatePicker: !this.state.showDatePicker });
  };

  handleFocusChange = ({ focused }) => {
    this.setState({ showDatePicker: focused });
  };

  handleDateChange = (date, dateType) => {
    const value = date ? date.valueOf() : null;
    const { updateCard, card } = this.props;

    if (Ability.can('update', 'self', card)) {
      let attributes = {};

      attributes[dateType] = value ? moment(value).toISOString() : null;
      updateCard({ id: card.id, attributes });
    } else {
      failure("You don't have permission to update the card!");
    }
  };

  handleDueDateChange = date => {
    this.handleDateChange(date, 'due_date');
  };

  handleStartDateChange = date => {
    this.handleDateChange(date, 'start_date');
  };

  render() {
    const {
      allCardsHash,
      card: {
        attributes: { completed_percentage, due_date, start_date },
        id: cardId,
        relationships: {
          nested_tips,
          tip_assignments: { data },
          topics: {
            data: [defaultTopicId]
          }
        }
      },
      card,
      dragLeaveHandlersForParentLists,
      level,
      topicId,
      users,
      color
    } = this.props;
    const { inEditMode, showNestedCards, showNewCardInput } = this.state;
    const isComplete = completed_percentage == 100;
    const userCanEdit = Ability.can('update', 'self', card);
    const momentDate = due_date ? moment(due_date) : due_date;
    const momentStartDate = start_date
      ? moment(start_date).format('MMM D YYYY')
      : '';

    let avatars = null;

    if (data && data > 0) {
      avatars = data.map((assignedUser, index) => {
        var person = users.find(user => {
          return user.id === assignedUser;
        });

        return (
          <UserAvatar
            user={person}
            key={person ? person.id : `${card.id}_${index}`}
            size={24}
          />
        );
      });
    }

    const className = classNames('todo-card', {
      'show-caret': !this.state.showNestedCards
    });

    const levelMargin = level * 20;
    const nestedCards = nested_tips.data
      .map(nestedCardId => allCardsHash[nestedCardId])
      .filter(nestedCard => !!nestedCard);

    return (
      <Fragment>
        <div className={className}>
          <div
            className="todo-card__wrapper"
            style={{
              marginLeft: `${levelMargin}px`,
              width: `calc(100% - ${levelMargin}px)`
            }}
          >
            <GenericDropZone
              dropClassName="nest-card-zone"
              onDragStart={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDragEnter={attrs => this.showAsNestable(attrs)}
              onDragLeave={attrs => this.dontShowAsNestable(attrs)}
              itemType={dragItemTypes.CARD}
              onDrop={this.handleNestCard}
              key="nest-zone"
            >
              <div className="nest-zone">
                <IconButton
                  additionalClasses="todo-card__nested-cards-caret dark-grey-icon-button"
                  fontAwesome
                  icon={
                    this.state.showNestedCards ? 'caret-down' : 'caret-right'
                  }
                  color={color}
                  onClick={this.handleNestedCardsCaretClick}
                />
              </div>
            </GenericDropZone>
            <IconButton
              fontAwesome
              icon={isComplete ? 'check-square' : 'square'}
              onClick={() => this.handleToggleCompleteCard(card)}
              color={color}
            />
            <div className="todo-card_title-container">
              <CardTitleLink
                additionalClasses={classNames('todo-card_title', {
                  striked: isComplete
                })}
                inEditMode={inEditMode}
                card={card}
              />
              <span className="todo-card_title-edit-button">
                {userCanEdit && !inEditMode && (
                  <IconButton
                    fontAwesome
                    icon="pencil"
                    onClick={this.handleToggleEditMode}
                    color={color}
                  />
                )}
              </span>
              <IconButton
                additionalClasses="todo-card__nested-cards-add"
                icon="add"
                onClick={this.handleNewCardInputButtonClick}
                color={color}
              />
            </div>
            {avatars}
            <CardLabels card={card} expandDirection="left" />
            <div className="todo-card_start-due-dates">
              <span
                data-for={`${card.id}-todo-start`}
                data-tip={
                  !!momentStartDate ? 'Select start date' : 'Click to change'
                }
              >
                <DateInput
                  className="plan-tab-content__date"
                  date={start_date}
                  onChange={this.handleStartDateChange}
                  placeholder=""
                />
              </span>
              <Icon
                additionalClasses="small ml10 mr10"
                fontAwesome
                icon="arrow-right"
                onClick={this.toggleDatePicker}
                color={color}
              />
              <span
                data-for={`${card.id}-todo-due`}
                data-tip={!momentDate ? 'Select due date' : 'Click to change'}
              >
                <DateInput
                  className="plan-tab-content__date"
                  date={momentDate}
                  onChange={this.handleDueDateChange}
                  placeholder=""
                />
              </span>
            </div>
            <CardActionsDropdown
              color={color}
              card={card}
              onAddCard={this.handleNewCardInputButtonClick}
            />
          </div>
        </div>
        {showNestedCards && (
          <GenericDragDropListing
            dragClassName="task-view_drag-card"
            draggedItemProps={{ origin: { topicId, cardId } }}
            dropZoneProps={{ topicId, cardId }}
            itemList={nestedCards}
            itemType={dragItemTypes.CARD}
            onDropItem={this.handleDropCard}
            parentListDragLeaveHandlers={dragLeaveHandlersForParentLists}
            renderItem={(nestedCard, dragHandlers) => (
              <ConnectedTodoCard
                color={color}
                card={nestedCard}
                dragLeaveHandlersForParentLists={dragHandlers}
                key={nestedCard.id}
                level={level + 1}
                topicId={topicId || defaultTopicId}
              />
            )}
          >
            {showNewCardInput && (
              <AddCardCard
                cardStyle={{
                  marginLeft: `${levelMargin + 20}px`,
                  marginTop: '10px'
                }}
                inInputMode
                newCardRelationships={{ follows_tip: { data: card.id } }}
                topicId={topicId}
                onDismiss={this.handleNewCardInputButtonClick}
              />
            )}
          </GenericDragDropListing>
        )}
      </Fragment>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);

  return {
    allCardsHash: sm.cards,
    users: Object.values(sm.people)
  };
};

const mapDispatch = {
  nestCardUnderCard: nestCardUnderCardAction,
  updateCard,
  viewCard
};

const ConnectedTodoCard = connect(
  mapState,
  mapDispatch
)(TodoCard);

export default ConnectedTodoCard;
