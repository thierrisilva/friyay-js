import classNames from 'classnames';
import React, { Component, Fragment } from 'react';
import get from 'lodash/get';
import { array, func, number, object, string } from 'prop-types';
import { connect } from 'react-redux';

import AddCardCard from 'Components/shared/cards/AddCardCard';
import CardActionsDropdown from 'Components/shared/cards/elements/CardActionsDropdown';
import CardTitleLink from 'Components/shared/cards/elements/CardTitleLink';
import IconButton from 'Components/shared/buttons/IconButton';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import {
  dragItemTypes,
  GenericDragDropListing
} from 'Components/shared/drag_and_drop/_index';
import GenericDropZone from 'Src/components/shared/drag_and_drop/GenericDropZone.js';
import { nestCardUnderCard as nestCardUnderCardAction } from 'Src/newRedux/database/cards/thunks';
import { stateMappings } from 'Src/newRedux/stateMappings';
import GenericCard from 'Components/views/card_views/GenericCard';

class CardCard extends GenericCard {
  static defaultProps = { dragLeaveHandlersForParentLists: [], level: 0 };

  static propTypes = {
    allCardsHash: object.isRequired,
    card: object.isRequired,
    dragLeaveHandlersForParentLists: array,
    level: number,
    nestCardUnderCard: func.isRequired,
    onClick: func.isRequired,
    selectedCardId: string,
    topicId: string
  };

  state = {
    fillColor: null,
    showNestedCards: false,
    showNewCardInput: false,
    card: this.props.card
  };

  handleDropCard = ({ droppedItemProps, dropZoneProps, itemOrder }) => {
    this.props.nestCardUnderCard({
      nestedCard: droppedItemProps.item,
      parentCard: this.props.allCardsHash[dropZoneProps.cardId],
      fromTopicId: droppedItemProps.origin.topicId,
      toTopicId: dropZoneProps.topicId,
      itemOrder
    });
  };

  handleNewCardInputButtonClick = () => {
    this.setState({
      showNestedCards: true,
      showNewCardInput: !this.state.showNewCardInput
    });
  };

  toggleFillColor = () => {
    this.setState(state => {
      return { fillColor: state.fillColor ? null : '#777' };
    });
  };

  render() {
    const {
      allCardsHash,
      card: {
        attributes: { creator, slug, title },
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
      onClick,
      selectedCardId,
      topicId
    } = this.props;
    const { fillColor, showNestedCards, showNewCardInput } = this.state;

    const isSelected = selectedCardId == card.id;
    const levelMargin = level * 20;

    const className = classNames('card-card', {
      'is-selected': isSelected,
      'show-caret': !showNestedCards
    });

    const nestedCards = nested_tips.data
      .map(nestedCardId => allCardsHash[nestedCardId])
      .filter(nestedCard => !!nestedCard);

    return (
      <Fragment>
        <div
          className={className}
          onMouseEnter={this.toggleFillColor}
          onMouseLeave={this.toggleFillColor}
          style={{ marginLeft: `${levelMargin}px`, marginTop: '10px' }}
        >
          <div className="card-card__content">
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
                  additionalClasses="card-card__nested-cards-caret dark-grey-icon-button"
                  fontAwesome
                  icon={
                    this.state.showNestedCards ? 'caret-down' : 'caret-right'
                  }
                  onClick={this.handleNestedCardsCaretClick}
                />
              </div>
            </GenericDropZone>
            <UserAvatar user={creator} size={24} />
            <div className="card-card_title">
              <CardTitleLink onClick={() => onClick(card.id)} card={card} />
              <IconButton
                additionalClasses="card-card__nested-cards-add dark-grey-icon-button"
                icon="add"
                onClick={this.handleNewCardInputButtonClick}
              />
            </div>
            <CardActionsDropdown
              card={card}
              fill={isSelected ? '#777' : fillColor}
              onAddCard={this.handleNewCardInputButtonClick}
            />
          </div>
        </div>
        {showNestedCards && (
          <GenericDragDropListing
            dragClassName="task-view_drag-card"
            draggedItemProps={{ origin: { topicId, cardId } }}
            dropZoneProps={{ topicId, cardId }}
            itemContainerClassName="task-view_card-container"
            itemList={nestedCards}
            itemType={dragItemTypes.CARD}
            onDropItem={this.handleDropCard}
            parentListDragLeaveHandlers={dragLeaveHandlersForParentLists}
            renderItem={(nestedCard, dragHandlers) => (
              <ConnectedCardCard
                card={nestedCard}
                dragLeaveHandlersForParentLists={dragHandlers}
                key={nestedCard.id}
                level={level + 1}
                onClick={onClick}
                selectedCardId={selectedCardId}
                topicId={topicId || defaultTopicId}
              />
            )}
          />
        )}
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
      </Fragment>
    );
  }
}

function mapState(state) {
  const sm = stateMappings(state);

  return { allCardsHash: sm.cards };
}

const mapDispatch = { nestCardUnderCard: nestCardUnderCardAction };

const ConnectedCardCard = connect(
  mapState,
  mapDispatch
)(CardCard);

export default ConnectedCardCard;
