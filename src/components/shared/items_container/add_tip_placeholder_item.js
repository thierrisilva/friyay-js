import React from 'react';
import PropTypes from 'prop-types';
import tiphive from '../../../lib/tiphive';
import classnames from 'classnames';
import { VIEWS_ENUM } from 'Enums';

const AddTipPlaceholderItem = ({ handleNewTipClick, tipViewMode }) => {
  if (tiphive.isSupportDomain()) {
    return null;
  }

  const itemClass = classnames({
    panel: true,
    'panel-default': true,
    'list-item': tipViewMode === VIEWS_ENUM.LIST,
    'small-grid-item': tipViewMode === VIEWS_ENUM.SMALL_GRID,
    'grid-item': tipViewMode === VIEWS_ENUM.GRID,
    placeholder: true,
    'add-tip-placeholder': true
  });

  return (
    <div
      className={itemClass}
      id="add-item-placeholder"
      key="add-item-placeholder"
      onClick={handleNewTipClick}
    >
      <a className="btn btn-link btn-new-plus">
        + Add New Card
      </a>
    </div>
  );
};

AddTipPlaceholderItem.propTypes = {
  handleNewTipClick: PropTypes.func.isRequired,
  tipViewMode: PropTypes.number.isRequired
};

export default AddTipPlaceholderItem;
