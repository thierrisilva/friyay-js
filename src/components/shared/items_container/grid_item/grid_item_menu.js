/* global vex */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ability from '../../../../lib/ability';
import tiphive from '../../../../lib/tiphive';
import { SCREEN } from 'Enums';
const options = ['Plan', 'Share', 'Organize', 'Edit', 'Delete', 'Archive'];

class GridItemMenu extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    switchScreen: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    archiveItem: PropTypes.func.isRequired,
    handleOptionSelect: PropTypes.func.isRequired,
  };

  handleMenuCloseClick = e => {
    e.preventDefault();
    this.props.switchScreen(SCREEN.ITEM, null);
  };

  handleLabelsClick = e => {
    e.preventDefault();
    this.props.switchScreen(SCREEN.LABEL_LISTING, null);
  };

  handleItemTrashClick = id => {
    vex.dialog.confirm({
      message: 'Are you sure you want to delete this item?',
      callback: value => value && this.props.removeItem(id)
    });
  };

  handleItemArchiveClick = id =>
    vex.dialog.confirm({
      unsafeMessage: `
      Are you sure you want to Archive this Card?
      <br /><br />
      You can use the label filters in the Action Bar to your right to view archived Cards.
    `,
      callback: value => value && this.props.archiveItem(id)
    });

  handleOptionsClick = action => {
    const { props: { item: { id }, handleOptionSelect, switchScreen } } = this;

    if (action === 'Delete') {
      this.handleItemTrashClick(id);
    } else if (action === 'Archive') {
      this.handleItemArchiveClick(id);
    } else {
      handleOptionSelect(action);
    }

    switchScreen('item', null);
  };

  render() {
    const { props: { item } } = this;
    const isOptionEnable = Ability.can('update', 'self', item);

    return (
      <div className="grid-item-menu">
        <div className="list-group list-options">
          <div className="list-group-item grid-item-menu-header">
            Options
            <div>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={this.handleMenuCloseClick}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
          {!tiphive.userIsGuest() && (
            <a
              className="list-group-item"
              href="javascript:void(0)"
              onClick={this.handleLabelsClick}
            >
              Labels
            </a>
          )}
          {isOptionEnable &&
            options.map(option => (
              <a
                key={option}
                className="list-group-item"
                href="javascript:void(0)"
                onClick={() => this.handleOptionsClick(option)}
              >
                {option}
              </a>
            ))}
        </div>
      </div>
    );
  }
}

export default GridItemMenu;
