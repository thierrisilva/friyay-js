import React, { Component } from 'react';
import { connect } from 'react-redux';
import { func, string, object } from 'prop-types';
import Dotdotdot from 'react-dotdotdot';
import cx from 'classnames';
import FormInput from 'Components/shared/forms/FormInput';
import { updateSelectedCard } from 'Src/newRedux/database/user/thunks';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { updateCard, viewCard } from 'Src/newRedux/database/cards/thunks';

class CardTitleLink extends Component {
  static propTypes = {
    size: string,
    card: object.isRequired,
    viewCard: func.isRequired,
    updateCard: func.isRequired
  };

  state = {
    cardTitle: this.props.card.attributes.title,
    inEditMode: false,
    timeoutID: null
  };

  handleViewCard = () => {
    const {
      card,
      onClick,
      viewCard,
      cardsSplitScreen,
      updateSelectedCard
    } = this.props;

    const slug = card.attributes.slug;

    if (onClick) {
      onClick();
    } else if (cardsSplitScreen) {
      updateSelectedCard(slug);
    } else {
      viewCard({ cardSlug: slug });
    }
  };

  handleTitleChange = cardTitle => {
    this.setState({ cardTitle });
  };

  handleTimeoutIDChange = timeoutID => {
    this.setState({ timeoutID });
  };

  handleSaveTitleChange = () => {
    this.handleToggleEditMode();
    const { card, updateCard } = this.props;
    const attributes = {
      title: this.state.cardTitle
    };
    updateCard({ id: card.id, attributes });
  };

  handleKeyDown = e => {
    if (e.key == 'Escape' || e.keyCode == 27) {
      this.setState({ inEditMode: false });
    }
  };

  handleToggleEditMode = () => {
    const inEditMode = this.state.inEditMode;
    this.setState({ inEditMode: !inEditMode });
    inEditMode
      ? window.removeEventListener('keydown', this.handleKeyDown, true)
      : window.addEventListener('keydown', this.handleKeyDown, true);
  };

  getClickHandler = () => {
    const { timeoutID } = this.state;
    const delay = 250;
    if (!timeoutID) {
      this.handleTimeoutIDChange(
        window.setTimeout(() => {
          this.handleViewCard();
          this.handleTimeoutIDChange(null);
        }, delay)
      );
    } else {
      this.handleTimeoutIDChange(window.clearTimeout(timeoutID));
      this.handleToggleEditMode();
    }
  };

  render() {
    const {
      card,
      additionalClasses,
      maxLines = 1,
      size = '',
      truncate
    } = this.props;

    const slug = card.attributes.slug;
    const cardTitle = card.attributes.title;
    const { inEditMode } = this.state;
    return (
      <div>
        {inEditMode || this.props.inEditMode ? (
          <FormInput
            defaultValue={cardTitle}
            onChange={this.handleTitleChange}
            onSubmit={this.handleSaveTitleChange}
          />
        ) : (
          <a
            className={cx(
              'card-title',
              size,
              additionalClasses,
              `c${slug ? slug.substring(0, slug.indexOf('-')) : ''}`
            )}
            onClick={this.getClickHandler}
          >
            {truncate ? (
              <Dotdotdot clamp={maxLines} className="card-title">
                {cardTitle}
              </Dotdotdot>
            ) : (
              cardTitle
            )}
          </a>
        )}
      </div>
    );
  }
}

const mapState = state => {
  const { menus } = stateMappings(state);
  const cardsSplitScreen = menus.cardsSplitScreen;

  return { cardsSplitScreen };
};

const mapDispatch = {
  viewCard,
  updateCard,
  updateSelectedCard
};

export default connect(
  mapState,
  mapDispatch
)(CardTitleLink);
