import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { cardFilters } from 'Lib/config/filters/cards';
import { setCardFilters } from 'Src/newRedux/filters/actions';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';

import Icon from 'Components/shared/Icon';
import SubMenuHeader from 'Components/menus/right/right_submenus/elements/SubMenuHeader';

const filters = Object.values( cardFilters );

const RightFiltersStatusMenu = ({ cardFilter, changeView, setCardFilters, setRightMenuOpenForMenu }) => (

  <div className='right-submenu'>
    <SubMenuHeader rootMenu='Filters' title='Card Status Filters'  />
    <div className='right-submenu_content'>
      {filters.map(filter => (
        <a className={`right-submenu_item selector ${ cardFilter == filter.key && 'active' }`} key={ filter.key } onClick={ () => setCardFilters( filter.key ) }>
          <Icon
            fontAwesome={ filter.iconType == 'fontAwesome' }
            icon={ filter.icon } />
          <span className='ml5'>{filter.name}</span>
        </a>
      ))}
    </div>
  </div>
)


const mapState = (state, props) => ({
  cardFilter: state._newReduxTree.filters.cardFilter,
  displaySubmenu: state._newReduxTree.ui.menus.displayRightSubMenuForMenu
})

const mapDispatch = {
  setCardFilters,
  setRightMenuOpenForMenu
}

export default connect( mapState, mapDispatch )( RightFiltersStatusMenu );
