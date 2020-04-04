import actionTypes from './actionEnum';

export const setAssignedFilters = filters => ({
  type: actionTypes.setAssignedFilters,
  payload: filters
});

export const setIncludeArchivedFilter = filterVal => ({
  type: actionTypes.setIncludeArchivedFilter,
  payload: filterVal
});

export const setIncludeSubtopicCardsFilter = filterVal => ({
  type: actionTypes.setIncludeSubtopicCardsFilter,
  payload: filterVal
});

export const setIncludeNestedCardsFilter = filterVal => ({
  type: actionTypes.setIncludeNestedCardsFilter,
  payload: filterVal
});

export const setIncludeCompletedCardsFilter = filterVal => ({
  type: actionTypes.setIncludeCompletedCardsFilter,
  payload: filterVal
});

export const setIncludeUnCompletedCardsFilter = filterVal => ({
  type: actionTypes.setIncludeUnCompletedCardsFilter,
  payload: filterVal
});

export const setIncludeUnCompletedSortedCardsFilter = filterVal => ({
  type: actionTypes.setIncludeUnCompletedSortedCardsFilter,
  payload: filterVal
});

export const setCardFilters = filters => ({
  type: actionTypes.setCardFilters,
  payload: filters
});

export const setCompletedDateFilter = filterObjectWithStartAndEndDate => ({
  type: actionTypes.setCompletedDateFilter,
  payload: filterObjectWithStartAndEndDate
});

export const setCreatedDateFilter = filterObjectWithStartAndEndDate => ({
  type: actionTypes.setCreatedDateFilter,
  payload: filterObjectWithStartAndEndDate
});

export const setCreatorFilters = filters => ({
  type: actionTypes.setCreatorFilters,
  payload: filters
});

export const setDueDateFilter = filterObjectWithStartAndEndDate => ({
  type: actionTypes.setDueDateFilter,
  payload: filterObjectWithStartAndEndDate
});

export const setLabelFilters = filters => ({
  type: actionTypes.setLabelFilters,
  payload: filters
});

export const setPriorityLevelFilters = filters => ({
  type: actionTypes.setPriorityLevelFilters,
  payload: filters
});

export const setPeopleFilters = filters => ({
  type: actionTypes.setPeopleFilters,
  payload: filters
});

export const setStartDateFilter = filterObjectWithStartAndEndDate => ({
  type: actionTypes.setStartDateFilter,
  payload: filterObjectWithStartAndEndDate
});

export const setTopicFilters = filters => ({
  type: actionTypes.setTopicFilters,
  payload: filters
});
