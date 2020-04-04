import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setStartDateFilter } from 'Src/newRedux/filters/actions';
import FilterDateElement from 'Components/menus/right/right_submenus/elements/FilterDateElement';
import SubMenuHeader from 'Components/menus/right/right_submenus/elements/SubMenuHeader';


const RightFiltersStartDateMenu = ({ startDateFilter, setStartDateFilter }) => {

  return (
    <div className='right-submenu'>
      <SubMenuHeader rootMenu='Filters' title='Start Date Filter'  />
      <div className='right-submenu_content'>
        <FilterDateElement filter={ startDateFilter } onSetFilter={ setStartDateFilter } />
      </div>
    </div>
  )
}


const mapState = (state, props) => ({
  startDateFilter: state._newReduxTree.filters.startDateFilter
})

const mapDispatch = {
  setStartDateFilter
}

export default connect( mapState, mapDispatch )( RightFiltersStartDateMenu );
