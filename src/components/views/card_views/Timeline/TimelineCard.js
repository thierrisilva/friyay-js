import classNames from 'classnames';
import React, { Component, Fragment } from 'react';
import get from 'lodash/get';
import { any, bool, func, number, object, string } from 'prop-types';
import { connect } from 'react-redux';

import AddCardCard from 'Components/shared/cards/AddCardCard';
import CardActionsDropdown from 'Components/shared/cards/elements/CardActionsDropdown';
import CardAssigneeLabel from 'Components/shared/cards/elements/CardAssigneeLabel';
import CardDueDateLabel from 'Components/shared/cards/elements/CardDueDateLabel';
import CardTitleLink from 'Components/shared/cards/elements/CardTitleLink';
import CardWorkEstimationLabel from 'Components/shared/cards/elements/CardWorkEstimationLabel';
import CompletionSlider from 'Components/shared/CompletionSlider';
import GenericDragContainer from 'Components/shared/drag_and_drop/GenericDragContainer';
import GenericDropZone from 'Components/shared/drag_and_drop/GenericDropZone';
import IconButton from 'Components/shared/buttons/IconButton';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import { stateMappings } from 'Src/newRedux/stateMappings';
import GenericCard from 'Components/views/card_views/GenericCard';
import {
  nestCardUnderCard as nestCardUnderCardAction,
  updateCard
} from 'Src/newRedux/database/cards/thunks';

class TimelineCard extends GenericCard {
  static defaultProps = { level: 0, style: { marginLeft: '0px' } };

  static propTypes = {
    allCardsHash: object.isRequired,
    card: object,
    className: string,
    compactView: bool,
    level: number,
    style: any,
    topicId: any,
    onDropOverCard: func
  };

  state = {
    showNestedCards: !!get(
      this.props.card,
      'relationships.nested_tips.data.length'
    ),
    showNewCardInput: false
  };

  handleNewCardInputButtonClick = () => {
    this.setState({
      showNestedCards: true,
      showNewCardInput: !this.state.showNewCardInput
    });
  };

  render() {
    const card = this.props.card;
    const {
      attributes,
      relationships: {
        nested_tips,
        topics: {
          data: [defaultTopicId]
        }
      },
      topicId
    } = card;

    const controlClassNames = classNames(
      this.props.className,
      'timeline-card',
      {
        'timeline-card--compact': this.props.compactView,
        'show-caret': !this.state.showNestedCards
      }
    );
    const levelMargin = this.props.level * 20;

    return (
      <Fragment>
        <div
          className={controlClassNames}
          style={{
            ...this.props.style,
            marginLeft: `calc(${
              this.props.style.marginLeft
            } + ${levelMargin}px)`
          }}
        >
          <GenericDropZone
            dropClassName="timeline-card__wrapper"
            itemType={dragItemTypes.CARD}
            onDrop={this.props.onDropOverCard}
          >
            {!this.props.compactView && (
              <GenericDragContainer
                dragClassName="timeline-card__border"
                draggedItemProps={{
                  type: 'start',
                  origin: { topicId: topicId }
                }}
                dragPreview={
                  <div className="timeline-card-date-drag timeline-card-date-drag--start">
                    Change start date
                  </div>
                }
                item={this.props.card}
                itemType={dragItemTypes.CARD}
                onDropElsewhere={() => {}}
              />
            )}
            <GenericDragContainer
              dragClassName="timeline-card__content"
              draggedItemProps={{ type: 'card', origin: { topicId: topicId } }}
              dragPreview={
                <ConnectedTimelineCard
                  card={this.props.card}
                  className="timeline-card-drag-preview"
                  compactView
                />
              }
              item={this.props.card}
              itemType={dragItemTypes.CARD}
              onDropElsewhere={() => {}}
            >
              <div className="timeline-card__main">
                <div className="timeline-card__title-wrapper">
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
                        additionalClasses="timeline-card__nested-cards-caret dark-grey-icon-button"
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
                    additionalClasses="timeline-card__nested-cards-add"
                    icon="add"
                    onClick={this.handleNewCardInputButtonClick}
                  />
                </div>
                <CardActionsDropdown
                  card={this.props.card}
                  onAddCard={this.handleNewCardInputButtonClick}
                />
              </div>
              {!this.props.compactView && (
                <div className="timeline-card__extra">
                  <CompletionSlider
                    className="timeline-card__completion"
                    card={this.props.card}
                    tinyView
                  />
                  {attributes.creator && (
                    <UserAvatar size={24} user={attributes.creator} />
                  )}
                  <CardAssigneeLabel
                    card={this.props.card}
                    className="timeline-card__plan-label"
                    showTooltip
                  />
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
              )}
            </GenericDragContainer>
            {!this.props.compactView && (
              <GenericDragContainer
                dragClassName="timeline-card__border"
                draggedItemProps={{ type: 'due', origin: { topicId: topicId } }}
                dragPreview={
                  <div className="timeline-card-date-drag timeline-card-date-drag--due">
                    Change due date
                  </div>
                }
                item={this.props.card}
                itemType={dragItemTypes.CARD}
                onDropElsewhere={() => {}}
              />
            )}
          </GenericDropZone>
        </div>
        {this.state.showNewCardInput && (
          <AddCardCard
            cardStyle={{
              ...this.props.style,
              marginBottom: '10px',
              marginLeft: `calc(${
                this.props.style.marginLeft
              } + ${levelMargin}px)`,
              padding: '5px 10px 0'
            }}
            inInputMode
            newCardRelationships={{ follows_tip: { data: this.props.card.id } }}
            topicId={this.props.topicId}
            onDismiss={this.handleNewCardInputButtonClick}
          />
        )}
        {this.state.showNestedCards &&
          nested_tips.data
            .filter(id => !!this.props.allCardsHash[id])
            .map(id => (
              <ConnectedTimelineCard
                card={this.props.allCardsHash[id]}
                className={this.props.className}
                key={id}
                level={this.props.level + 1}
                style={this.props.style}
                topicId={this.props.topicId || defaultTopicId}
                onDropOverCard={this.props.onDropOverCard}
              />
            ))}
      </Fragment>
    );
  }
}

function mapState(state) {
  const sm = stateMappings(state);

  return { allCardsHash: sm.cards };
}

const mapDispatch = { nestCardUnderCard: nestCardUnderCardAction };

const ConnectedTimelineCard = connect(
  mapState,
  mapDispatch
)(TimelineCard);

export default ConnectedTimelineCard;
