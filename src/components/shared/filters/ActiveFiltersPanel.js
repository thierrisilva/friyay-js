import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { createSelector } from 'reselect';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { cardFilters } from 'Lib/config/filters/cards';
import { actionDispatcher } from 'Src/newRedux/utils';
import {
  setCardFilters,
  setCompletedDateFilter,
  setCreatedDateFilter,
  setDueDateFilter,
  setStartDateFilter,
  setPriorityLevelFilters
} from 'Src/newRedux/filters/actions';
import {
  removeLabelFromLabelFilter,
  toggleAssignedFilter,
  toggleCreatorFilter
} from 'Src/newRedux/filters/thunks';

import ActiveFilterChip from './ActiveFilterChip';

const convertFilterToBetweenDateString = filter =>
  ` ${moment(filter.startDate).format('DD MMM')} - ${moment(
    filter.endDate
  ).format('DD MMM')}`;
const emptyDateFilter = {
  startDate: null,
  endDate: null
};

const ActiveFiltersPanel = ({ actionDispatcher, activeFilters }) => {
  const handleRemoveFilter = removeFunc => {
    actionDispatcher(removeFunc());
  };

  return (
    <div className="active-filters-panel">
      {activeFilters.map(filter => (
        <ActiveFilterChip
          filter={filter}
          key={filter.name}
          onRemove={handleRemoveFilter}
        />
      ))}
    </div>
  );
};

const filterMap = createSelector(
  state => stateMappings(state).filters.assignedFilters,
  state => stateMappings(state).filters.cardFilter,
  state => stateMappings(state).filters.completedDateFilter,
  state => stateMappings(state).filters.createdDateFilter,
  state => stateMappings(state).filters.creatorFilters,
  state => stateMappings(state).filters.dueDateFilter,
  state => stateMappings(state).filters.labelFilters,
  state => stateMappings(state).filters.startDateFilter,
  state => stateMappings(state).filters.priorityFilters,
  state => stateMappings(state).labels,
  state => stateMappings(state).people,
  (
    assignedFilters,
    cardFilter,
    completedDateFilter,
    createdDateFilter,
    creatorFilters,
    dueDateFilter,
    labelFilters,
    startDateFilter,
    priorityFilters,
    labels,
    people
  ) => {
    const filterMap = [];
    assignedFilters.forEach(personId => {
      filterMap.push({
        name:
          'Assigned to ' +
          get(people, `${personId}.attributes.name`, 'Unknown'),
        remove: () => toggleAssignedFilter(personId)
      });
    });
    if (cardFilter != cardFilters.ALL.key) {
      filterMap.push({
        name: cardFilters[cardFilter].name,
        remove: () => setCardFilters(cardFilters.ALL.key)
      });
    }
    if (completedDateFilter.startDate) {
      filterMap.push({
        name:
          'Completed' + convertFilterToBetweenDateString(completedDateFilter),
        remove: () => setCompletedDateFilter(emptyDateFilter)
      });
    }
    if (createdDateFilter.startDate) {
      filterMap.push({
        name: 'Created' + convertFilterToBetweenDateString(createdDateFilter),
        remove: () => setCreatedDateFilter(emptyDateFilter)
      });
    }
    creatorFilters.forEach(personId => {
      filterMap.push({
        name:
          'Created by ' + get(people, `${personId}.attributes.name`, 'Unknown'),
        remove: () => toggleCreatorFilter(personId)
      });
    });
    if (dueDateFilter.startDate) {
      filterMap.push({
        name: 'Due' + convertFilterToBetweenDateString(dueDateFilter),
        remove: () => setDueDateFilter(emptyDateFilter)
      });
    }
    labelFilters.forEach(labelId => {
      filterMap.push({
        name: labels[labelId].attributes.name,
        remove: () => removeLabelFromLabelFilter(labelId)
      });
    });
    priorityFilters.forEach(level => {
      filterMap.push({
        name: 'Priority level ' + level,
        remove: () =>
          setPriorityLevelFilters(
            priorityFilters.filter(filter => {
              return filter !== level;
            })
          )
      });
    });
    if (startDateFilter.startDate) {
      filterMap.push({
        name: 'Started' + convertFilterToBetweenDateString(startDateFilter),
        remove: () => setStartDateFilter(emptyDateFilter)
      });
    }
    return filterMap;
  }
);

const mapState = (state, props) => {
  const sm = stateMappings(state);
  return {
    activeFilters: filterMap(state),
    cardFilter: sm.filters.cardFilter,
    labelFilter: sm.filters.labelFilter,
    peopleFilter: sm.filters.peopleFilter
  };
};

const mapDispatch = {
  actionDispatcher
};

export default connect(
  mapState,
  mapDispatch
)(ActiveFiltersPanel);
