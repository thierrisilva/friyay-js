import classNames from 'classnames';
import React, { Component, Fragment } from 'react';
import get from 'lodash/get';
import { bool, number, object, string } from 'prop-types';
import { connect } from 'react-redux';

import AddCardCard from 'Components/shared/cards/AddCardCard';
import CardActionsDropdown from 'Components/shared/cards/elements/CardActionsDropdown';
import CardDueDateLabel from 'Components/shared/cards/elements/CardDueDateLabel';
import CardTitleLink from 'Components/shared/cards/elements/CardTitleLink';
import CardWorkEstimationLabel from 'Components/shared/cards/elements/CardWorkEstimationLabel';
import CompletionSlider from 'Components/shared/CompletionSlider';
import IconButton from 'Components/shared/buttons/IconButton';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import { stateMappings } from 'Src/newRedux/stateMappings';
import GenericDropZone from 'Src/components/shared/drag_and_drop/GenericDropZone.js';
import GenericCard from 'Components/views/card_views/GenericCard';
import { dragItemTypes } from 'Components/shared/drag_and_drop/_index';
import { nestCardUnderCard as nestCardUnderCardAction } from 'Src/newRedux/database/cards/thunks';

class StatusTableCard extends GenericCard {
  static defaultProps = { level: 0 };

  static propTypes = {
    allCardsHash: object.isRequired,
    card: object,
    className: string,
    compactView: bool,
    level: number,
    topicId: string
  };

  state = {
    showNestedCards: false,
    showNewCardInput: false
  };

  handleNewCardInputButtonClick = () => {
    this.setState({
      showNestedCards: true,
      showNewCardInput: !this.state.showNewCardInput
    });
  };

  render() {
    const {
      attributes,
      relationships: {
        nested_tips,
        tip_assignments,
        topics: {
          data: [defaultTopicId]
        }
      }
    } = this.props.card;

    const className = classNames(this.props.className, 'timeline-card', {
      'timeline-card--compact': this.props.compactView,
      'show-caret': !this.state.showNestedCards
    });
    const levelMargin = this.props.level * 20;

    return (
      <Fragment>
        <div className={className} style={{ marginLeft: `${levelMargin}px` }}>
          <div className="timeline-card__wrapper">
            <div className="timeline-card__content">
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
                        additionalClasses="planning-card__nested-cards-caret dark-grey-icon-button"
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
                  <CardTitleLink card={this.props.card} />
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
                  {tip_assignments.data[0] && (
                    <UserAvatar size={24} userId={tip_assignments.data[0]} />
                  )}
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
            </div>
          </div>
        </div>
        {this.state.showNewCardInput && (
          <AddCardCard
            cardStyle={{
              marginBottom: '10px',
              marginLeft: `${levelMargin + 20}px`
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
              <ConnectedStatusTableCard
                card={this.props.allCardsHash[id]}
                className={this.props.className}
                key={id}
                level={this.props.level + 1}
                topicId={this.props.topicId || defaultTopicId}
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

const ConnectedStatusTableCard = connect(
  mapState,
  mapDispatch
)(StatusTableCard);

export default ConnectedStatusTableCard;
