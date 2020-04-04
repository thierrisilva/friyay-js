import classNames from 'classnames';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class ProgressBar extends Component {
  static propTypes = {
    className: PropTypes.string,
    cards: PropTypes.array,
    dates: PropTypes.array
  };

  render() {
    const controlClassName = classNames(this.props.className, 'progress-bar');

    const startDate = moment(this.props.dates[0]);
    const endDate = moment(this.props.dates[1]);
    const daysInRange = endDate.diff(startDate, 'days');
    const weekendsInRange = Math.floor((startDate.day() + daysInRange) / 7) * 2;
    const assignedUsers = Object.keys(
      groupBy(
        this.props.cards,
        card => card.relationships.tip_assignments.data[0].assignment_id
      )
    );

    const totalHours = (daysInRange - weekendsInRange) * 40 * assignedUsers;

    const assignedHours = this.props.cards.reduce(
      (sum, card) => sum + card.attributes.resource_required,
      0
    );

    const completedHours = this.props.cards.reduce(
      (sum, { attributes: { resource_required, completion_percentage } }) =>
        sum + resource_required * completion_percentage / 100,
      0
    );

    return (
      <div className={controlClassName}>
        <div
          className="progress-bar__status--assigned"
          style={{ width: `${100 * assignedHours / totalHours}%` }}
        />
        <div
          className="progress-bar__status--completed"
          style={{ width: `${100 * completedHours / totalHours}%` }}
        />
      </div>
    );
  }
}

export default ProgressBar;
