import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import { success, failure } from 'Utils/toast';

import Ability from 'Lib/ability';
import OptionsDropdownButton from 'Components/shared/buttons/OptionsDropdownButton';

const options = [
  'Start',
  'Complete',
  'Plan',
  'Label',
  'Share',
  'Organize',
  'Edit',
  'Delete',
  'Archive',
  'Add card',
  'Upload file'
];

import {
  archiveCard,
  removeCard,
  updateCard
} from 'Src/newRedux/database/cards/thunks';
import { setEditCardModalOpen } from 'Src/newRedux/interface/modals/actions';
import { withLastLocation } from 'react-router-last-location';

class CardActionsDropdown extends Component {
  handleCompleteCard = () => {
    const { card, updateCard } = this.props;
    const attributes = {
      completion_date: moment().toISOString(),
      completed_percentage: 100
    };
    updateCard({ id: card.id, attributes });
    success('Card Completed!');
  };

  handleDeleteCard = () => {
    const { card, removeCard, lastLocation } = this.props;
    removeCard(card.id, lastLocation);
  };

  handleArchiveCard = () => {
    const { archiveCard, card, lastLocation } = this.props;
    archiveCard(card, lastLocation);
  };

  handleStartCard = () => {
    const { card, updateCard } = this.props;
    const attributes = {
      start_date: moment().toISOString()
    };
    updateCard({ id: card.id, attributes });
    success('Card Started');
  };

  handleClick = action => {
    const {
      props: { card, onAddCard, setEditCardModalOpen }
    } = this;
    if (!card) {
      return false;
    }

    switch (action) {
      case 'Add card':
        onAddCard();
        break;
      case 'Archive':
        this.handleArchiveCard();
        break;
      case 'Complete':
        this.handleCompleteCard();
        break;
      case 'Delete':
        this.handleDeleteCard();
        break;
      case 'Start':
        this.handleStartCard();
        break;
      case 'Upload file':
        setEditCardModalOpen({
          cardId: card.id,
          tab: 'Edit',
          openFileUploader: true
        });
        break;
      default:
        setEditCardModalOpen({ cardId: card.id, tab: action });
        break;
    }
  };

  render() {
    const { card, children, color } = this.props;

    return Ability.can('update', 'self', card) ? (
      <OptionsDropdownButton color={color}>
        {options.map(option => (
          <a
            className="dropdown-option-item"
            key={option}
            onClick={() => this.handleClick(option)}
          >
            {option}
          </a>
        ))}
        {children}
      </OptionsDropdownButton>
    ) : null;
  }
}

CardActionsDropdown.propTypes = {
  card: PropTypes.object.isRequired,
  setEditCardModalOpen: PropTypes.func.isRequired,
  removeCard: PropTypes.func.isRequired,
  archiveCard: PropTypes.func.isRequired
};

const mapDispatch = {
  archiveCard,
  removeCard,
  setEditCardModalOpen,
  updateCard
};

export default connect(
  undefined,
  mapDispatch
)(withLastLocation(CardActionsDropdown));
