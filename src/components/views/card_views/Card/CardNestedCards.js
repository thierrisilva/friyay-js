import moment from 'moment';
import React, { Component, Fragment } from 'react';
import { func, object } from 'prop-types';
import { connect } from 'react-redux';

import Ability from 'Lib/ability';
import CardActionsDropdown from 'Components/shared/cards/elements/CardActionsDropdown';
import CardTitleLink from 'Components/shared/cards/elements/CardTitleLink';
import IconButton from 'Components/shared/buttons/IconButton';
import OptionsDropdownButton from 'Components/shared/buttons/OptionsDropdownButton';
import { updateCard as updateCardAction } from 'Src/newRedux/database/cards/thunks';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { failure } from 'Utils/toast';

const DEFAULT_CARD = {
  attributes: {},
  relationships: { nested_tips: { data: [] } }
};
const DISPLAY_TYPES = {
  list: { key: 'list', optionText: 'Show as list' },
  todo: { key: 'todo', optionText: 'Show as todo-list' }
};
const DISPLAY_TYPES_KEY = 'nested_cards_display_types';
const LEVEL_PADDING_STEP = 20;

function getDisplayTypes() {
  const displayTypesString = localStorage.getItem(DISPLAY_TYPES_KEY) || '{}';
  const displayTypesJSON = JSON.parse(displayTypesString);

  return displayTypesJSON;
}

function getDisplayTypeForCard(cardId) {
  const displayTypes = getDisplayTypes();

  return displayTypes[cardId];
}

function setDisplayTypeForCard(cardId, displayType) {
  const displayTypesJSON = { ...getDisplayTypes(), [cardId]: displayType };
  const displayTypesString = JSON.stringify(displayTypesJSON);

  localStorage.setItem(DISPLAY_TYPES_KEY, displayTypesString);
}

class CardNestedCards extends Component {
  static defaultProps = { card: DEFAULT_CARD };

  static propTypes = {
    allCardsHash: object.isRequired,
    card: object.isRequired,
    updateCard: func.isRequired
  };

  state = { displayType: DISPLAY_TYPES.list.key };

  componentDidMount() {
    const cardId = this.props.card.id;
    const displayType = getDisplayTypeForCard(cardId);

    this.setState({ displayType });
  }

  handleCardComplete(card) {
    if (Ability.can('update', 'self', card)) {
      const completed_percentage =
        card.attributes.completed_percentage == 100 ? 0 : 100;

      const completion_date = card.attributes.completion_date
        ? null
        : moment().toISOString();

      this.props.updateCard({
        id: card.id,
        attributes: { completed_percentage, completion_date }
      });
    } else {
      failure("You don't have permission to complete that card!");
    }
  }

  handleDisplayTypeChange(displayType) {
    const cardId = this.props.card.id;

    this.setState({ displayType });
    setDisplayTypeForCard(cardId, displayType);
  }

  render() {
    const nestedCards =
      (this.props.card.relationships.nested_tips || {}).data || [];
    const hasNestedCards = !!nestedCards.length;
    const displayTypeKeys = Object.keys(DISPLAY_TYPES);

    return (
      hasNestedCards && (
        <div className="card-nested-cards">
          <OptionsDropdownButton className="card-nested-cards__dropdown">
            {displayTypeKeys.map(key => (
              <span
                className="dropdown-option-item"
                key={key}
                onClick={() => this.handleDisplayTypeChange(key)}
              >
                {DISPLAY_TYPES[key].optionText}
              </span>
            ))}
          </OptionsDropdownButton>
          {nestedCards.map(cardId => this.renderNestedCard(cardId, 0))}
        </div>
      )
    );
  }

  renderNestedCard = (cardId, level) => {
    const card = this.props.allCardsHash[cardId] || DEFAULT_CARD;
    const nestedCards = card.relationships.nested_tips.data;

    const hasNestedCards = !!nestedCards.length;
    const isCompleted = card.attributes.completed_percentage == 100;
    const levelPadding = level * LEVEL_PADDING_STEP;
    const style = { paddingLeft: `${levelPadding}px` };

    return (
      <Fragment key={cardId}>
        <div className="card-nested-cards__card" style={style}>
          {this.state.displayType === DISPLAY_TYPES.todo.key && (
            <IconButton
              fontAwesome
              icon={isCompleted ? 'check-square' : 'square'}
              onClick={() => this.handleCardComplete(card)}
            />
          )}
          <CardTitleLink card={card} />
          <div className="card-nested-cards__card-options">
            <CardActionsDropdown card={card} onAddCard={() => {}} />
          </div>
        </div>
        {hasNestedCards &&
          nestedCards.map(nestedCardId =>
            this.renderNestedCard(nestedCardId, level + 1)
          )}
      </Fragment>
    );
  };
}

function mapState(state) {
  const sm = stateMappings(state);

  return { allCardsHash: sm.cards };
}

const mapDispatch = { updateCard: updateCardAction };

export default connect(
  mapState,
  mapDispatch
)(CardNestedCards);
