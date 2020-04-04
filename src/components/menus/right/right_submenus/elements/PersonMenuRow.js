import React from 'react';
import { bool, func, object } from 'prop-types';

import UserAvatar from 'Src/components/shared/users/elements/UserAvatar';


const PersonMenuRow = ({ isSelected, onClick, person }) => {

  return (
    <div className='right-submenu_item option' key={ person.id }>
      <a className={`right-submenu_item no-border ${ isSelected && 'active bold'}`}  onClick={ onClick }>
        <UserAvatar user={ person } />
        <span className='ml5'>{person.attributes.name}</span>
      </a>
    </div>
  )

}

PersonMenuRow.propTypes = {
  isSelected: bool,
  onClick: func.isRequired,
  person: object.isRequired,
}


export default PersonMenuRow;
