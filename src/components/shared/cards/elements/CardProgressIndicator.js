import React from 'react';
import { object, string } from 'prop-types';


const CardProgressIndicator = ({ additionalClassNames = '', card: { attributes: { completed_percentage } } }) => {

  return (
    <div data-tip={`${completed_percentage}% complete`} className={`card-progress-indicator ${ additionalClassNames }`}>
      <div className='card-progress-indicator_progress-bar' style={{ width: `${completed_percentage}%` }}></div>
    </div>
  )
}


CardProgressIndicator.propTypes = {
  additionalClassNames: string,
  card: object
};

export default CardProgressIndicator;
