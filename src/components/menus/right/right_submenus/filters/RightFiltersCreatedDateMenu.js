import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setCreatedDateFilter } from 'Src/newRedux/filters/actions';
import FilterDateElement from 'Components/menus/right/right_submenus/elements/FilterDateElement';
import SubMenuHeader from 'Components/menus/right/right_submenus/elements/SubMenuHeader';


const RightFiltersCreatedDateMenu = ({ createdDateFilter, setCreatedDateFilter }) => {

  return (
    <div className='right-submenu'>
      <SubMenuHeader rootMenu='Filters' title='Created Date Filter'  />
      <div className='right-submenu_content'>
        <FilterDateElement filter={ createdDateFilter } onSetFilter={ setCreatedDateFilter } />
      </div>
    </div>
  )
}


const mapState = (state, props) => ({
  createdDateFilter: state._newReduxTree.filters.createdDateFilter
})

const mapDispatch = {
  setCreatedDateFilter
}

export default connect( mapState, mapDispatch )( RightFiltersCreatedDateMenu );
