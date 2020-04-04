import React, { Component } from 'react';
import { object } from 'prop-types';

import Icon from 'Components/shared/Icon';

const CardResourceRequired = ({ card: { attributes: { resource_required } }}) =>  (
  <div className='card-resource-required'>
    <Icon icon='build' additionalClasses='small card-resource-required_icon' />
    <span className='card-resource-required_value'>
      {resource_required || '??'} hrs
    </span>
  </div>
)


CardResourceRequired.propTypes = {
  card: object.isRequired,
};


export default CardResourceRequired;
