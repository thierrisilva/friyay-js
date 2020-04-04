/* global $crisp, appEnv */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';
import IconButton from 'Components/shared/buttons/IconButton';

class QuickRightBarActions extends Component {
  handleMenuButtonClick = () => {
    const { displaySubmenu, setRightMenuOpenForMenu } = this.props;
    setRightMenuOpenForMenu(!displaySubmenu);
  };

  render() {
    const {
      displaySubmenu,
      setRightMenuOpenForMenu,
      tooltipOptions = { place: 'bottom' },
      color
    } = this.props;

    return (
      <div className="quick-rightbar-actions">
        <IconButton
          additionalClasses={
            'quick-right-action-bar_button' +
            (displaySubmenu == 'Views' ? 'active' : '')
          }
          color={color || '#56CCF2'}
          icon="view_carousel"
          tooltip="Views"
          onClick={() =>
            setRightMenuOpenForMenu(displaySubmenu == 'Views' ? null : 'Views')
          }
          tooltipOptions={tooltipOptions}
        />
        <IconButton
          additionalClasses={
            'quick-right-action-bar_button' +
            (typeof displaySubmenu === 'string' &&
            displaySubmenu.includes('Filters')
              ? 'active'
              : '')
          }
          color={color || '#F2C94C'}
          icon="filter_list"
          tooltip="Filters"
          onClick={() =>
            setRightMenuOpenForMenu(
              typeof displaySubmenu === 'string' &&
                displaySubmenu.includes('Filters')
                ? null
                : 'Filters'
            )
          }
          tooltipOptions={tooltipOptions}
        />
        <IconButton
          additionalClasses={
            'icon-order-class quick-right-action-bar_button' +
            (typeof displaySubmenu === 'string' &&
            displaySubmenu.includes('Orders')
              ? 'active'
              : '')
          }
          color={color || '#B865A8'}
          icon="swap_vert"
          tooltip="Orders"
          onClick={() =>
            setRightMenuOpenForMenu(
              typeof displaySubmenu === 'string' &&
                displaySubmenu.includes('Orders')
                ? null
                : 'Orders'
            )
          }
          tooltipOptions={tooltipOptions}
        />
      </div>
    );
  }
}

const mapState = (state, props) => ({
  displaySubmenu: state._newReduxTree.ui.menus.displayRightSubMenuForMenu
});

const mapDispatch = {
  setRightMenuOpenForMenu
};

export default connect(
  mapState,
  mapDispatch
)(QuickRightBarActions);
