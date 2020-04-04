import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';
import PropTypes from 'prop-types';
import MoreIcon from 'Components/shared/more_icon';
import OptionsDropdownButton from 'Components/shared/buttons/OptionsDropdownButton';

const KanbanLaneOptionsMenu = ({ label, onRemoveLane, setRightMenuOpenForMenu }) => {

  return (
    <OptionsDropdownButton >
      { label &&
        <a className='dropdown-row-item-std' onClick={ () => onRemoveLane( label.id ) }>
          Remove Lane
        </a>
      }
      <a className='dropdown-row-item-std' onClick={ () => setRightMenuOpenForMenu('Filters_Labels') }>
        Create Label
      </a>
    </OptionsDropdownButton>

  )
}


const mapDispatch = {
  setRightMenuOpenForMenu
};


export default connect( undefined, mapDispatch )(KanbanLaneOptionsMenu);
