import React, { Component } from 'react';
import { array, func, string } from 'prop-types';
import Ability from 'Lib/ability';
import tiphive from 'Lib/tiphive';

import { ButtonMenuOpenDismiss, IconButton } from 'Components/shared/buttons/index';


const GroupMenuContent = ({ groups, onAddGroup, onDismissMenu, onEditGroup, onSelectGroup, selectedGroupId }) => {

  const canAdd = !tiphive.userIsGuest() || Ability.can('create', 'groups', window.currentDomain);

  return (
    <div className='left-menu-group-content' id="group-menu-content">
      <div className='left-menu-group-content_element'>
        <a className='grey-link yellow-hover' onClick={onDismissMenu}>
          Teams
        </a>
        <ButtonMenuOpenDismiss isOpen={true} onClick={onDismissMenu} />
      </div>

      { groups.map(group => (
        <div className='left-menu-group-content_element' key={ `group-select-${group.id}` }>
          <a className='grey-link yellow-hover' onClick={ () => onSelectGroup(group) }>
            { group.attributes.title }
          </a>
          <IconButton
            additionalIconClasses='small'
            icon='settings'
            onClick={ () => onEditGroup( group ) }
          />
        </div>
      ))}

      {canAdd &&
        <div className='left-menu-group-content_element'>
          <a className='grey-link yellow-hover' onClick={onAddGroup}>
            Add Team
          </a>
        </div>
      }
    </div>
  );
}


GroupMenuContent.propTypes = {
  groups: array,
  onAddGroup: func,
  onDismissMenu: func,
  onEditGroup: func,
  onSelectGroup: func,
  selectedGroupId: string
};

export default GroupMenuContent;
