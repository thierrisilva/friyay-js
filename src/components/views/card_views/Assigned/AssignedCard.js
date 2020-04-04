import classNames from 'classnames';
import React, { Component, Fragment } from 'react';
import get from 'lodash/get';
import { array, func, number, object, string } from 'prop-types';
import { connect } from 'react-redux';

import AddCardCard from 'Components/shared/cards/AddCardCard';
import CardActionsDropdown from 'Components/shared/cards/elements/CardActionsDropdown';
import CardProgressIndicator from 'Components/shared/cards/elements/CardProgressIndicator';
import CardResourceRequired from 'Components/shared/cards/elements/CardResourceRequired';
import CardStatusIndicator from 'Components/shared/cards/elements/CardStatusIndicator';
import CardTitleLink from 'Components/shared/cards/elements/CardTitleLink';
import IconButton from 'Components/shared/buttons/IconButton';
import {
  dragItemTypes,
  GenericDragDropListing
} from 'Components/shared/drag_and_drop/_index';
import { nestCardUnderCard as nestCardUnderCardAction } from 'Src/newRedux/database/cards/thunks';
import { stateMappings } from 'Src/newRedux/stateMappings';
import GenericDropZone from 'Src/components/shared/drag_and_drop/GenericDropZone.js';
import GenericCard from 'Components/views/card_views/GenericCard';

class AssignedCard extends GenericCard {
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
      topicId
    } = this.props;

    const className = classNames('kanban-card', {
      'show-caret': !this.state.showNestedCards
    });

    const levelMargin = level * 20;
    const nestedCards = nested_tips.data
      .map(nestedCardId => allCardsHash[nestedCardId])
      .filter(nestedCard => !!nestedCard);

    return (
      <Fragment>
        <div
          className={className}
          style={{
            marginLeft: `${levelMargin}px`,
            width: `calc(100% - ${levelMargin}px)`
          }}
        >
          <div className="kanban-card_title-section">
            <div className="kanban-card__title-wrapper">
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
                    additionalClasses="assigned-card__nested-cards-caret dark-grey-icon-button"
                    fontAwesome
                    icon={
                      this.state.showNestedCards ? 'caret-down' : 'caret-right'
                    }
                    onClick={this.handleNestedCardsCaretClick}
                  />
                </div>
              </GenericDropZone>
              <CardTitleLink card={card} />

              <IconButton
                additionalClasses="kanban-card__nested-cards-add"
                icon="add"
                onClick={this.handleNewCardInputButtonClick}
              />
            </div>
            <CardActionsDropdown
              card={card}
              onAddCard={this.handleNewCardInputButtonClick}
            />
          </div>
          <div className="kanban-card_hover-section">
            <CardProgressIndicator card={card} />
            <div className="assigned-card_hover-options">
              <CardResourceRequired card={card} />
              <CardStatusIndicator card={card} />
            </div>
          </div>
        </div>
        {this.state.showNestedCards && (
          <GenericDragDropListing
            dragClassName="task-view_drag-card"
            draggedItemProps={{ origin: { topicId, cardId } }}
            dropZoneProps={{ topicId, cardId }}
            itemList={nestedCards}
            itemType={dragItemTypes.CARD}
            onDropItem={this.handleDropCard}
            parentListDragLeaveHandlers={dragLeaveHandlersForParentLists}
            renderItem={(nestedCard, dragHandlers) => (
              <ConnectedAssignedCard
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

function mapState(state) {
  const sm = stateMappings(state);

  return { allCardsHash: sm.cards };
}

const mapDispatch = { nestCardUnderCard: nestCardUnderCardAction };

const ConnectedAssignedCard = connect(
  mapState,
  mapDispatch
)(AssignedCard);

export default ConnectedAssignedCard;
