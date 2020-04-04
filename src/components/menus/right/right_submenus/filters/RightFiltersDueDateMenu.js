import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setDueDateFilter } from 'Src/newRedux/filters/actions';
import FilterDateElement from 'Components/menus/right/right_submenus/elements/FilterDateElement';
import SubMenuHeader from 'Components/menus/right/right_submenus/elements/SubMenuHeader';


const RightFiltersDueDateMenu = ({ dueDateFilter, setDueDateFilter }) => {

  return (
    <div className='right-submenu'>
      <SubMenuHeader rootMenu='Filters' title='Due Date Filter'  />
      <div className='right-submenu_content'>
        <FilterDateElement filter={ dueDateFilter } onSetFilter={ setDueDateFilter } />
      </div>
    </div>
  )
}


const mapState = (state, props) => ({
  dueDateFilter: state._newReduxTree.filters.dueDateFilter
})

const mapDispatch = {
  setDueDateFilter
}

export default connect( mapState, mapDispatch )( RightFiltersDueDateMenu );
