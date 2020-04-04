import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import get from 'lodash/get';
import { bool, number, object, string } from 'prop-types';
import AddCardCard from 'Components/shared/cards/AddCardCard';
import CardActionsDropdown from 'Components/shared/cards/elements/CardActionsDropdown';
import CardDueDateLabel from 'Components/shared/cards/elements/CardDueDateLabel';
import CardTitleLink from 'Components/shared/cards/elements/CardTitleLink';
import CardWorkEstimationLabel from 'Components/shared/cards/elements/CardWorkEstimationLabel';
import CompletionSlider from 'Components/shared/CompletionSlider';
import IconButton from 'Components/shared/buttons/IconButton';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import { stateMappings } from 'Src/newRedux/stateMappings';

class CalendarCard extends Component {
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
    showNestedCards: !!get(
      this.props.card,
      'relationships.nested_tips.data.length'
    ),
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
      attributes,
      relationships: {
        nested_tips,
        tip_assignments,
        topics: {
          data: [defaultTopicId]
        }
      }
    } = this.props.card;

    const levelMargin = this.props.level * 20;

    const className = classNames(this.props.className, 'calendar-card', {
      'calendar-card--compact': this.props.compactView,
      'show-caret': !this.state.showNestedCards
    });

    return (
      <Fragment>
        <div className={className} style={{ marginLeft: `${levelMargin}px` }}>
          <div className="calendar-card__wrapper">
            <div className="calendar-card__content">
              <div className="calendar-card__main">
                <div className="calendar-card__title-wrapper">
                  {nested_tips.data.length > 0 && (
                    <IconButton
                      additionalClasses="calendar-card__nested-cards-caret"
                      fontAwesome
                      icon={
                        this.state.showNestedCards
                          ? 'caret-down'
                          : 'caret-right'
                      }
                      onClick={this.handleNestedCardsCaretClick}
                    />
                  )}
                  <CardTitleLink card={this.props.card} />
                  <IconButton
                    additionalClasses="calendar-card__nested-cards-add"
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
                <div className="calendar-card__extra">
                  <CompletionSlider
                    className="calendar-card__completion"
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
                    className="calendar-card__plan-label"
                    showTooltip
                  />
                  <CardDueDateLabel
                    card={this.props.card}
                    className="calendar-card__plan-label"
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
              <ConnectedCalendarCard
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

const ConnectedCalendarCard = connect(mapState)(CalendarCard);

export default ConnectedCalendarCard;
