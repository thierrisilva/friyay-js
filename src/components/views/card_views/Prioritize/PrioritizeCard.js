import React, { Component, Fragment } from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { array, func, number, object, string } from 'prop-types';

import { stateMappings } from 'Src/newRedux/stateMappings';

import CardTitleLink from 'Src/components/shared/cards/elements/CardTitleLink';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import PrioritySelector from './PrioritySelector';
import CardActionsDropdown from 'Components/shared/cards/elements/CardActionsDropdown';
import IconButton from 'Components/shared/buttons/IconButton';
import AddCardCard from 'Components/shared/cards/AddCardCard';
import {
  dragItemTypes,
  GenericDragDropListing
} from 'Components/shared/drag_and_drop/_index';
import { nestCardUnderCard as nestCardUnderCardAction } from 'Src/newRedux/database/cards/thunks';

class PrioritizeCard extends Component {
  static defaultProps = { dragLeaveHandlersForParentLists: [], level: 0 };

  static propTypes = {
    allCardsHash: object.isRequired,
    card: object.isRequired,
    dragLeaveHandlersForParentLists: array,
    level: number,
    nestCardUnderCard: func.isRequired,
    topicId: string
  };

  state = {
    showNestedCards: false,
    showNewCardInput: false
  };

  handleNestedCardsCaretClick = () => {
    this.setState({
      showNestedCards: !this.state.showNestedCards,
      showNewCardInput: false
    });
  };

  handleNewCardInputButtonClick = () => {
    this.setState({
      showNestedCards: true,
      showNewCardInput: !this.state.showNewCardInput
    });
  };

  render() {
    const {
      allCardsHash,
      card: {
        attributes: { slug, title },
        id: cardId,
        relationships: {
          nested_tips,
          topics: {
            data: [defaultTopicId]
          }
        }
      },
      card,
      dragLeaveHandlersForParentLists,
      level,
      topicId,
      onSelectCard,
      isSelected,
      horizontalView,
      cardView
    } = this.props;
    const onClick = onSelectCard ? () => onSelectCard(card.id) : null;
    const levelMargin = level * 20;
    const nestedCards = nested_tips.data
      .map(nestedCardId => allCardsHash[nestedCardId])
      .filter(nestedCard => !!nestedCard);
    return (
      <Fragment>
        <div
          style={{
            marginLeft: `${levelMargin}px`,
            width: `calc(100% - ${levelMargin}px`
          }}
        >
          {!horizontalView && (
            <div className="prioritize-card">
              <IconButton
                additionalClasses="kanban-card__nested-cards-caret dark-grey-icon-button"
                fontAwesome
                icon={
                  nested_tips.data.length > 0
                    ? this.state.showNestedCards
                      ? 'caret-down'
                      : 'caret-right'
                    : 'empty'
                }
                onClick={this.handleNestedCardsCaretClick}
              />
              <CardTitleLink card={card} />
              <CardActionsDropdown
                card={card}
                onAddCard={this.handleNewCardInputButtonClick}
              />
            </div>
          )}
          {horizontalView && (
            <div
              className={`prioritize-card ${
                isSelected && horizontalView ? 'selected' : ''
              }`}
            >
              <IconButton
                additionalClasses="kanban-card__nested-cards-caret dark-grey-icon-button"
                fontAwesome
                icon={
                  nested_tips.data.length > 0
                    ? this.state.showNestedCards
                      ? 'caret-down'
                      : 'caret-right'
                    : 'empty'
                }
                onClick={this.handleNestedCardsCaretClick}
              />
              <CardTitleLink card={card} onClick={onClick} />
              <CardActionsDropdown card={card} />
              {!cardView && (
                <div className="prioritize-horizontal-container">
                  <UserAvatar user={card.attributes.creator} />
                  <PrioritySelector card={card} />
                </div>
              )}
            </div>
          )}
          {this.state.showNestedCards === true && (
            <GenericDragDropListing
              dragClassName="task-view_drag-card"
              draggedItemProps={{ origin: { topicId, cardId } }}
              dropZoneProps={{ topicId, cardId }}
              itemList={nestedCards}
              itemType={dragItemTypes.CARD}
              onDropItem={this.handleDropCard}
              parentListDragLeaveHandlers={dragLeaveHandlersForParentLists}
              renderItem={(nestedCard, dragHandlers) => (
                <ConnectedPrioritizeCard
                  card={nestedCard}
                  dragLeaveHandlersForParentLists={dragHandlers}
                  key={nestedCard.id}
                  level={level + 1}
                  topicId={topicId || defaultTopicId}
                />
              )}
            >
              {this.state.showNewCardInput && (
                <AddCardCard
                  cardStyle={{
                    marginBottom: '10px',
                    marginLeft: `${levelMargin + 20}px`
                  }}
                  inInputMode={this.state.showNewCardInput}
                  newCardRelationships={{ follows_tip: { data: card.id } }}
                  topicId={topicId}
                  onDismiss={this.handleNewCardInputButtonClick}
                  cardClassName="prioritize-card"
                />
              )}
            </GenericDragDropListing>
          )}
        </div>
      </Fragment>
    );
  }
}

function mapState(state) {
  const sm = stateMappings(state);

  return { allCardsHash: sm.cards };
}

const mapDispatch = { nestCardUnderCard: nestCardUnderCardAction };

const ConnectedPrioritizeCard = connect(
  mapState,
  mapDispatch
)(PrioritizeCard);

export default ConnectedPrioritizeCard;
