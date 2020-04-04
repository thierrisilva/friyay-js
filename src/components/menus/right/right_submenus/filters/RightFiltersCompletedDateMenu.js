import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setCompletedDateFilter } from 'Src/newRedux/filters/actions';
import FilterDateElement from 'Components/menus/right/right_submenus/elements/FilterDateElement';
import SubMenuHeader from 'Components/menus/right/right_submenus/elements/SubMenuHeader';


const RightFiltersCompletedDateMenu = ({ completedDateFilter, setCompletedDateFilter }) => {

  return (
    <div className='right-submenu'>
      <SubMenuHeader rootMenu='Filters' title='Completed Date Filter'  />
      <div className='right-submenu_content'>
        <FilterDateElement filter={ completedDateFilter } onSetFilter={ setCompletedDateFilter } />
      </div>
    </div>
  )
}


const mapState = (state, props) => ({
  completedDateFilter: state._newReduxTree.filters.completedDateFilter
})

const mapDispatch = {
  setCompletedDateFilter
}

export default connect( mapState, mapDispatch )( RightFiltersCompletedDateMenu );
