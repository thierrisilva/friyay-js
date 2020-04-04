import classNames from 'classnames';
import React, { Component, Fragment } from 'react';
import get from 'lodash/get';
import { array, func, number, object, string } from 'prop-types';
import { connect } from 'react-redux';

import GenericDropZone from 'Src/components/shared/drag_and_drop/GenericDropZone.js';
import AddCardCard from 'Components/shared/cards/AddCardCard';
import CardActions from 'Components/shared/cards/elements/assemblies/CardActions';
import CardActionsDropdown from 'Components/shared/cards/elements/CardActionsDropdown';
import CardLabels from 'Components/shared/cards/elements/assemblies/CardLabels';
import CardTitleLink from 'Components/shared/cards/elements/CardTitleLink';
import CardTopicLink from 'Components/shared/cards/elements/CardTopicLink';
import IconButton from 'Components/shared/buttons/IconButton';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import GridCardAttachmentDropOptions from 'Components/views/card_views/Grid/GridCardAttachmentDropOptions';
import {
  dragItemTypes,
  GenericDragDropListing
} from 'Components/shared/drag_and_drop/_index';
import { nestCardUnderCard as nestCardUnderCardAction } from 'Src/newRedux/database/cards/thunks';
import { stateMappings } from 'Src/newRedux/stateMappings';
import GenericCard from 'Components/views/card_views/GenericCard';

class ListCard extends GenericCard {
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
    isAttachmentHoveringOnCard: false,
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

  toggleAttachmentHoveringOnCard = status => {
    this.setState(prevState => ({
      ...prevState,
      isAttachmentHoveringOnCard: status
    }));
  };

  render() {
    if (!this.props.card.attributes) {
      return <div>Missing item attributes</div>;
    }

    const {
      props: {
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
        topicId
      },
      state: { isAttachmentHoveringOnCard }
    } = this;

    const className = classNames('list-card', {
      'show-caret': !this.state.showNestedCards
    });

    const levelMargin = level * 20;

    const nestedCards = nested_tips.data
      .map(nestedCardId => allCardsHash[nestedCardId])
      .filter(nestedCard => !!nestedCard);

    return (
      <Fragment>
        <GenericDropZone
          dropClassName="list-card-item_section"
          onDragEnter={() => this.toggleAttachmentHoveringOnCard(true)}
          onDragLeave={() => this.toggleAttachmentHoveringOnCard(false)}
          dropsDisabled
          itemType={dragItemTypes.FILE}
        >
          <div
            className={className}
            style={{
              marginLeft: `${levelMargin}px`,
              width: `calc(100% - ${levelMargin}px`
            }}
          >
            <div className="list-card__wrapper">
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
                    additionalClasses="list-card__nested-cards-caret dark-grey-icon-button"
                    fontAwesome
                    icon={
                      this.state.showNestedCards ? 'caret-down' : 'caret-right'
                    }
                    onClick={this.handleNestedCardsCaretClick}
                  />
                </div>
              </GenericDropZone>
              <div className="list-card_avatar-container">
                <UserAvatar
                  user={creator}
                  extraClass="flex-r-center-center"
                  size={24}
                />
              </div>
              <div className="list-card_title-topic-container">
                <div className="mr10">
                  <CardTitleLink card={card} />
                </div>
                <CardTopicLink card={card} style="lite" />
                {isAttachmentHoveringOnCard ? (
                  <div className="list-card_file-dropzone">
                    <GridCardAttachmentDropOptions
                      card={card}
                      view="list-card"
                    />
                  </div>
                ) : (
                  <Fragment>
                    <IconButton
                      additionalClasses="list-card__nested-cards-add"
                      icon="add"
                      onClick={this.handleNewCardInputButtonClick}
                    />
                  </Fragment>
                )}
              </div>
              <div className="list-card_label-container">
                <CardLabels card={card} expandDirection="left" />
              </div>
              <div className="list-card_actions-container">
                <CardActions card={card} />
                <CardActionsDropdown
                  card={card}
                  onAddCard={this.handleNewCardInputButtonClick}
                />
              </div>
            </div>
          </div>
          {this.state.showNestedCards && (
            <GenericDragDropListing
              dragClassName="task-view_drag-card"
              draggedItemProps={{ origin: { topicId, cardId } }}
              dropClassName="wiki-list_topic-dropzone"
              dropZoneProps={{ topicId, cardId }}
              itemList={nestedCards}
              itemType={dragItemTypes.FILE}
              // itemType={[dragItemTypes.CARD, dragItemTypes.FILE]}
              onDropItem={this.handleDropCard}
              parentListDragLeaveHandlers={dragLeaveHandlersForParentLists}
              renderItem={(nestedCard, dragHandlers) => (
                <ConnectedListCard
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
        </GenericDropZone>
      </Fragment>
    );
  }
}

function mapState(state) {
  const sm = stateMappings(state);

  return { allCardsHash: sm.cards };
}

const mapDispatch = { nestCardUnderCard: nestCardUnderCardAction };

const ConnectedListCard = connect(
  mapState,
  mapDispatch
)(ListCard);

export default ConnectedListCard;
