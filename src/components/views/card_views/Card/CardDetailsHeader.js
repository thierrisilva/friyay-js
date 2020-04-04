import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { withLastLocation } from 'react-router-last-location';
import Ability from 'Lib/ability';
import { removeCard, viewCard } from 'Src/newRedux/database/cards/thunks';
import { addCardToDock } from 'Src/newRedux/interface/dock/thunks';
import IconButton from 'Components/shared/buttons/IconButton';
import CardActionsDropdown from 'Components/shared/cards/elements/CardActionsDropdown';
import { GreyDots } from 'Src/components/shared/Dots';

class CardDetailsHeader extends PureComponent {
  handlePrintClick = () => window.print();

  render() {
    const {
      addCardToDock,
      card,
      inEditMode = false,
      onEditClick,
      onSaveClick,
      removeCard,
      showMinMax,
      viewCard,
      lastLocation,
      showIcons,
      handleShowHide,
      showDots
    } = this.props;

    if (!inEditMode && !showDots) {
      return null;
    }

    return (
      <div className="card-details-header relative">
        <div
          className={`card-details-header_buttons-container ${showDots &&
            'dots-layer-container'}`}
        >
          {showDots && <GreyDots />}
          {showMinMax && (
            <Fragment>
              <IconButton
                additionalIconClasses="medium grey-link"
                fontAwesome
                icon="minus"
                onClick={() => addCardToDock(card.id)}
              />
              <IconButton
                additionalIconClasses="medium grey-link"
                icon="launch"
                onClick={() => viewCard({ cardSlug: card.attributes.slug })}
              />
            </Fragment>
          )}
          {!inEditMode && Ability.can('update', 'self', card) && (
            <IconButton
              additionalIconClasses="medium grey-link"
              icon="edit"
              onClick={onEditClick}
            />
          )}
          {inEditMode && Ability.can('update', 'self', card) && (
            <IconButton
              additionalIconClasses="medium grey-link"
              icon="save"
              onClick={onSaveClick}
            />
          )}
          {Ability.can('destroy', 'self', card) && (
            <IconButton
              additionalIconClasses="medium grey-link"
              icon="delete"
              onClick={() => removeCard(card.id, lastLocation)}
            />
          )}
          <CardActionsDropdown card={card}>
            <a className="dropdown-option-item" onClick={this.handlePrintClick}>
              Print
            </a>
            <a className="dropdown-option-item" onClick={handleShowHide}>
              {showIcons ? 'Hide Icons' : 'ShowIcons'}
            </a>
          </CardActionsDropdown>
        </div>
      </div>
    );
  }
}

const mapDispatch = {
  addCardToDock,
  removeCard,
  viewCard
};

export default connect(
  null,
  mapDispatch
)(withLastLocation(CardDetailsHeader));
