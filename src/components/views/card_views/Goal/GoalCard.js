import classNames from 'classnames';
import moment from 'moment';
import React, { Component, Fragment } from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';

import AddCardCard from 'Components/shared/cards/AddCardCard';
import CardActionsDropdown from 'Components/shared/cards/elements/CardActionsDropdown';
import CardDueDateLabel from 'Components/shared/cards/elements/CardDueDateLabel';
import CardTitleLink from 'Components/shared/cards/elements/CardTitleLink';
import CardWorkEstimationLabel from 'Components/shared/cards/elements/CardWorkEstimationLabel';
import CommentButton from 'Components/shared/cards/elements/CommentButton';
import CompletionSlider from 'Components/shared/CompletionSlider';
import IconButton from 'Components/shared/buttons/IconButton';
import LabelsList from 'Components/pages/item_page/labels_list';
import LikeButton from 'Components/shared/cards/elements/LikeButton';
import StarButton from 'Components/shared/cards/elements/StarButton';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import { setEditCardModalOpen } from 'Src/newRedux/interface/modals/actions';
import {
  dragItemTypes,
  GenericDragDropListing
} from 'Components/shared/drag_and_drop/_index';
import GenericDropZone from 'Src/components/shared/drag_and_drop/GenericDropZone.js';
import {
  nestCardUnderCard as nestCardUnderCardAction,
  updateCard
} from 'Src/newRedux/database/cards/thunks';
import { stateMappings } from 'Src/newRedux/stateMappings';
import GenericCard from 'Components/views/card_views/GenericCard';

class GoalCard extends GenericCard {
  static defaultProps = { dragLeaveHandlersForParentLists: [], level: 0 };

  state = {
    showNestedCards: false,
    showNewCardInput: false,
    showOptions: false
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

  hideOptions = () => {
    if (this.optionTimeout) {
      clearTimeout(this.optionTimeout);
      this.optionTimeout = null;
    }
    if (!this.props.compactView) {
      this.setState({ showOptions: false });
    }
  };

  showOptions = () => {
    if (!this.optionTimeout) {
      this.optionTimeout = setTimeout(() => {
        if (!this.props.compactView) {
          this.setState({ showOptions: true });
        }
      }, 500);
    }
  };

  updatePercentage = value => {
    let {
      card: { id },
      updateCard,
      card
    } = this.props;
    const attributes = {
      completed_percentage: value
    };

    if (value == 100) {
      attributes.completion_date = moment().format();
    }

    updateCard({ attributes, id });
  };

  updateAssignee = e => {
    e.preventDefault();
    this.props.setEditCardModalOpen({
      cardId: this.props.card.id,
      tab: 'Plan'
    });
  };

  render() {
    let {
      allCardsHash,
      card: {
        attributes: { slug, title },
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
      compactView,
      dragLeaveHandlersForParentLists,
      level,
      topicId,
      users
    } = this.props;
    const { showNestedCards, showOptions } = this.state;

    let labels = card.relationships.labels;
    let avatars = null;

    if (data && data > 0) {
      var person = users.find(user => {
        return user.id === data[0];
      });

      avatars = <UserAvatar user={person} key={person ? person.id : card.id} />;
    }

    var labelsContent = <span />;
    if (labels && labels.length > 0) {
      labelsContent = <LabelsList tip={card} />;
    }

    const className = classNames('to-do-card', 'mt10', 'mb10', 'bdrr5', {
      'show-bottom': showOptions,
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
          onMouseOver={this.showOptions}
          onMouseLeave={this.hideOptions}
          style={{ marginLeft: `${levelMargin}px` }}
        >
          <div className="header-links top-half">
            <div className={`left-side ${compactView ? 'compact-view' : ''}`}>
              <span className="to-do-title">
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
                      additionalClasses="goal-card__nested-cards-caret dark-grey-icon-button"
                      fontAwesome
                      icon={
                        this.state.showNestedCards
                          ? 'caret-down'
                          : 'caret-right'
                      }
                      onClick={this.handleNestedCardsCaretClick}
                    />
                  </div>
                </GenericDropZone>
                <CardTitleLink card={card} />
                <IconButton
                  additionalClasses="goal-card__nested-cards-add"
                  icon="add"
                  onClick={this.handleNewCardInputButtonClick}
                />
              </span>
              {(showOptions || compactView) && (
                <CardActionsDropdown
                  card={card}
                  onAddCard={this.handleNewCardInputButtonClick}
                />
              )}
            </div>
            <div className={`right-side ${compactView ? 'compact-view' : ''}`}>
              <div
                className="goal-card_avatar-container"
                onClick={this.updateAssignee}
              >
                {avatars || <UserAvatar />}
              </div>
              {!compactView && (
                <div
                  className="full-width"
                  style={{ marginLeft: `-${levelMargin / 2}px` }}
                >
                  <CompletionSlider
                    width="100%"
                    card={card}
                    onChange={this.updatePercentage}
                    showEmoji
                  />
                </div>
              )}
            </div>
          </div>
          {showOptions && !compactView && (
            <div className="header-links grey-words pb5 pt5 bottom-half">
              <div className="goal-card-bottom-sections">
                {labelsContent}
                <CardWorkEstimationLabel
                  card={this.props.card}
                  className="timeline-card__plan-label"
                  showTooltip
                />
                <CardDueDateLabel
                  card={this.props.card}
                  className="timeline-card__plan-label"
                  showTooltip
                />
              </div>
              <div className="goal-card-bottom-sections larger">
                <CommentButton card={card} />
                <LikeButton card={card} />
                <StarButton card={card} />
              </div>
            </div>
          )}
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
              <ConnectedGoalCard
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
                cardStyle={{ marginLeft: `${levelMargin + 20}px` }}
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
  setEditCardModalOpen
};

const ConnectedGoalCard = connect(
  mapState,
  mapDispatch
)(GoalCard);

export default ConnectedGoalCard;
