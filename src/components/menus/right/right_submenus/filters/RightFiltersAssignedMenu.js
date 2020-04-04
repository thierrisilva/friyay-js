import React, { Component } from 'react';
import { connect } from 'react-redux';
import { array, func } from 'prop-types';

import { toggleAssignedFilter } from 'Src/newRedux/filters/thunks';
import { getPeopleArray } from 'Src/newRedux/database/people/selectors';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';

import Icon from 'Components/shared/Icon';
import PersonMenuRow from 'Components/menus/right/right_submenus/elements/PersonMenuRow';
import SubMenuHeader from 'Components/menus/right/right_submenus/elements/SubMenuHeader';

const RightFiltersAssignedMenu = ({ assignedFilters, people, setRightMenuOpenForMenu, toggleAssignedFilter }) => (

  <div className='right-submenu'>
    <SubMenuHeader rootMenu='Filters' title='Assigned-to Filter'  />
    <div className='right-submenu_content'>
      { people.map( person => (
        <PersonMenuRow
          key={ person.id }
          isSelected={ assignedFilters.includes( person.id ) }
          onClick={ () => toggleAssignedFilter( person.id ) }
          person={ person } />
      ))}
    </div>
  </div>
)

RightFiltersAssignedMenu.propTypes = {
  assignedFilters: array.isRequired,
  people: array.isRequired,
  setRightMenuOpenForMenu: func.isRequired,
  toggleAssignedFilter: func.isRequired,
}


const mapState = (state, props) => ({
  assignedFilters: state._newReduxTree.filters.assignedFilters,
  people: getPeopleArray( state ),
})

const mapDispatch = {
  toggleAssignedFilter,
  setRightMenuOpenForMenu
}

export default connect( mapState, mapDispatch )( RightFiltersAssignedMenu );
