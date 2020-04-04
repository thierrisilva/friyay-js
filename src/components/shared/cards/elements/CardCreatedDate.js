import React from 'react';
import moment from 'moment';

const CardCreatedDate = ({ date }) => (

  <div className="card-created-date">
    { moment( date ).format( 'DD MMM YY' ) }
  </div>
)


export default CardCreatedDate;
