import React, { Component } from 'react';
import { connect } from 'react-redux';
import { array, func } from 'prop-types';

import { toggleCreatorFilter } from 'Src/newRedux/filters/thunks';
import { getPeopleArray } from 'Src/newRedux/database/people/selectors';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';

import Icon from 'Components/shared/Icon';
import PersonMenuRow from 'Components/menus/right/right_submenus/elements/PersonMenuRow';
import SubMenuHeader from 'Components/menus/right/right_submenus/elements/SubMenuHeader';


const RightFiltersCreatorMenu = ({ creatorFilters, people, setRightMenuOpenForMenu, toggleCreatorFilter }) => (

  <div className='right-submenu'>
    <SubMenuHeader rootMenu='Filters' title='Created-by Filter'  />
    <div className='right-submenu_content'>
      { people.map( person => (
        <PersonMenuRow
          key={ person.id }
          isSelected={ creatorFilters.includes( person.id ) }
          onClick={ () => toggleCreatorFilter( person.id ) }
          person={ person } />
      ))}
    </div>
  </div>
)

RightFiltersCreatorMenu.propTypes = {
  creatorFilters: array.isRequired,
  people: array.isRequired,
  setRightMenuOpenForMenu: func.isRequired,
  toggleCreatorFilter: func.isRequired,
}


const mapState = (state, props) => ({
  creatorFilters: state._newReduxTree.filters.creatorFilters,
  people: getPeopleArray( state ),
})

const mapDispatch = {
  toggleCreatorFilter,
  setRightMenuOpenForMenu
}

export default connect( mapState, mapDispatch )( RightFiltersCreatorMenu );
