import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { stateMappings } from 'Src/newRedux/stateMappings';

import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';
import IconButton from 'Components/shared/buttons/IconButton';
import Icon from 'Components/shared/Icon';
import RightCardTopicOrdersMenu from './orders/RightCardTopicOrdersMenu';
import RightLabelOrdersMenu from './orders/RightLabelOrdersMenu';
import RightPeopleOrdersMenu from './orders/RightPeopleOrdersMenu';

const orders = ['Cards & yays', 'Labels', 'People'];

const RightOrdersMenu = ({ displaySubmenu, setOpenMenu }) => (
  <div className="right-submenu">
    <div className="right-submenu_header">
      <IconButton
        fontAwesome
        icon="caret-left"
        onClick={() => setOpenMenu(true)}
      />
      <span className="ml5">Orders</span>
    </div>
    {orders.map(filter => (
      <a
        className="right-submenu_item option"
        key={filter}
        onClick={() => setOpenMenu(`${displaySubmenu}_${filter}`)}
      >
        <span>{filter}</span>
        <Icon fontAwesome icon="caret-right" />
      </a>
    ))}
    <div
      className={`${
        typeof displaySubmenu == 'string' && displaySubmenu.includes('Orders_')
          ? 'right-submenu_option-container presented'
          : 'right-submenu_option-container'
      }`}
    >
      {displaySubmenu == 'Orders_Cards & yays' && <RightCardTopicOrdersMenu />}
      {displaySubmenu == 'Orders_Labels' && <RightLabelOrdersMenu />}
      {displaySubmenu == 'Orders_People' && <RightPeopleOrdersMenu />}
    </div>
  </div>
);

RightOrdersMenu.propTypes = {
  displaySubmenu: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
    .isRequired,
  setOpenMenu: PropTypes.func.isRequired
};

const mapState = state => {
  const sm = stateMappings(state);
  return { displaySubmenu: sm.menus.displayRightSubMenuForMenu };
};

const mapDispatch = { setOpenMenu: setRightMenuOpenForMenu };

export default connect(
  mapState,
  mapDispatch
)(RightOrdersMenu);
