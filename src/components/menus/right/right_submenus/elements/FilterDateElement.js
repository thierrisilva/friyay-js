import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import moment from 'moment';

import DateRangePicker from 'Components/shared/dates/DateRangePicker';
import IconButton from 'Components/shared/buttons/IconButton';
import Icon from 'Components/shared/Icon';

const FilterDateElement = ({ filter, onSetFilter, ctrlKeyDown }) => {
  const handleSelectRange = ({ endDate, startDate }) => {
    const filterStart = startDate
      ? ctrlKeyDown
        ? moment(startDate).startOf('week')
        : moment(startDate).startOf('day')
      : null;

    const filterEnd = ctrlKeyDown ? moment(endDate).endOf('week') : endDate;

    onSetFilter({ startDate: filterStart, endDate: filterEnd });
  };

  return (
    <div className="filter-date_container">
      <DateRangePicker
        startDate={filter.startDate || moment()}
        endDate={filter.endDate || moment()}
        onSelect={handleSelectRange}
      />
      <span className="filter-date_filter-header">Active Filter</span>
      <span
        className={`filter-date_filter ${filter.startDate && 'has-filter'}`}
      >
        {filter.startDate
          ? `${moment(filter.startDate).format('DD MMM')} - ${moment(
              filter.endDate
            ).format('DD MMM')}`
          : 'None'}
        {filter.startDate && (
          <IconButton
            additionalClasses="small dark-grey-link"
            fontAwesome
            icon="times"
            onClick={() =>
              handleSelectRange({ startDate: null, endDate: null })
            }
          />
        )}
      </span>
      <span className="filter-date_tip">
        <b>Tip: </b> Hold down the SHIFT key to select a week with one click
      </span>
    </div>
  );
};

const mapState = (state, props) => ({
  ctrlKeyDown: state._newReduxTree.utilities.ctrlKeyDown
});

export default connect(mapState)(FilterDateElement);
