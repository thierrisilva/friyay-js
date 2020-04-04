import React from 'react';
import { object } from 'prop-types';
import Tooltip from 'Components/shared/Tooltip';



const CardStatusIndicator = ({card}) => {
  const dueDate = card.attributes.due_date;
  const completedPercentage = card.attributes.completed_percentage;
  const startDate = card.attributes.start_date;
  const currentDate = new Date();

  if (startDate == null) {
    return(
      <span></span>
    );
  }

  if (completedPercentage == 100) {
    return(
      <span data-tip='Complete' className="material-icons green">
        check_circle
        {/* <Tooltip /> */}
      </span>
    );
  } else if (+dueDate < +currentDate) {
    return(
      <span data-tip='Overdue' className="material-icons red">
        schedule
        {/* <Tooltip /> */}
      </span>
    );
  } else if (+startDate > +currentDate) {
    return(
      <span data-tip='Not due' className="material-icons grey">
        schedule
        {/* <Tooltip /> */}
      </span>
    );
  } else if (completedPercentage == 0) {
    return(
      <span data-tip='Unstarted' className="material-icons orange">
        schedule
      </span>
    );
  } else {
    return(
      <span data-tip='On Track' className="material-icons blue">
        schedule
        {/* <Tooltip /> */}
      </span>
    );
  }
}


CardStatusIndicator.propTypes = {
  card: object.isRequired
}

export default CardStatusIndicator;
