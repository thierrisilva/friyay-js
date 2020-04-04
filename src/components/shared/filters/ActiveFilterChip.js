import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'Components/shared/buttons/IconButton';

const ActiveFilterChip = ({ filter, onRemove }) => (

  <div className='active-filter-chip'>
    <span className='active-filter-chip_name'>
      { filter.name }
    </span>
    <IconButton
      additionalClasses='active-filter-chip_remove-button'
      fontAwesome
      icon='times'
      onClick={ () => onRemove( filter.remove ) } />
  </div>
)

export default ActiveFilterChip;
