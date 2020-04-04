import analytics from 'Lib/analytics';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { batchActions } from 'redux-batch-enhancer';
import {
  setAssignedFilters,
  setCardFilters,
  setCreatorFilters,
  setIncludeArchivedFilter,
  setLabelFilters,
  setPeopleFilters,
  setTopicFilters,
  setIncludeSubtopicCardsFilter,
  setIncludeNestedCardsFilter,
  setIncludeCompletedCardsFilter,
  setIncludeUnCompletedCardsFilter,
  setIncludeUnCompletedSortedCardsFilter,
  setPriorityLevelFilters
} from './actions';
import { getArchivedLabelId, toggleItemInclusionInArray } from 'Lib/utilities';
import { updateUserUiSettings } from 'Src/newRedux/database/user/thunks';
import { cardFilterForView } from 'Lib/config/filters/cards';
import { topicFilters } from 'Lib/config/filters/topics';

export const addLabelToLabelFilter = labelId => async (dispatch, getState) => {
  analytics.track('Cards Filter Applied', { Filter: 'Label' });
  const labelFilters = [
    ...getState()._newReduxTree.filters.labelFilter,
    labelId
  ];
  dispatch(setLabelFilters(labelFilters));
};

export const removeLabelFromLabelFilter = labelId => async (
  dispatch,
  getState
) => {
  const labelFilters = getState()._newReduxTree.filters.labelFilters.filter(
    id => id != labelId
  );
  dispatch(setLabelFilters(labelFilters));
};

export const updateLabelFilters = labelIds => async (dispatch, getState) => {
  analytics.track('Cards Filter Applied', { Filter: 'Label' });
  const archivedLabelId = getArchivedLabelId(getState());
  const currentLabelFilters = getState()._newReduxTree.filters.labelFilters;

  if (
    !currentLabelFilters.includes(archivedLabelId) &&
    labelIds.includes(archivedLabelId)
  ) {
    dispatch(setIncludeArchivedFilter(true));
  }
  if (
    currentLabelFilters.includes(archivedLabelId) &&
    !labelIds.includes(archivedLabelId)
  ) {
    dispatch(setIncludeArchivedFilter(false));
  }
  dispatch(setLabelFilters(labelIds));
};

const getNewPersonFilter = (filterName, personId, getState) => {
  const sm = stateMappings(getState());
  const ctrlKeyDown = sm.utilities.ctrlKeyDown;
  const currentFilters = sm.filters[filterName];
  const newFilters = ctrlKeyDown
    ? toggleItemInclusionInArray(personId, currentFilters)
    : currentFilters.includes(personId)
    ? []
    : [personId];
  return newFilters;
};

export const toggleAssignedFilter = personId => (dispatch, getState) => {
  analytics.track('Cards Filter Applied', { Filter: 'Assigned To' });
  dispatch(
    setAssignedFilters(
      getNewPersonFilter('assignedFilters', personId, getState)
    )
  );
};

export const toggleCreatorFilter = personId => (dispatch, getState) => {
  analytics.track('Cards Filter Applied', { Filter: 'Created By' });
  dispatch(
    setCreatorFilters(getNewPersonFilter('creatorFilters', personId, getState))
  );
};

const getCurrentFilterValue = (filterName, getState) =>
  stateMappings(getState()).filters[filterName];

export const toggleIncludeArchivedFilter = () => (dispatch, getState) => {
  dispatch(
    setIncludeArchivedFilter(
      !getCurrentFilterValue('includeArchivedCards', getState)
    )
  );
};

export const toggleIncludeSubtopicCardsFilter = () => (dispatch, getState) => {
  dispatch(
    setIncludeSubtopicCardsFilter(
      !getCurrentFilterValue('includeSubtopicCards', getState)
    )
  );
};

export const toggleIncludeNestedCardsFilter = () => (dispatch, getState) => {
  dispatch(
    setIncludeNestedCardsFilter(
      !getCurrentFilterValue('includeNestedCards', getState)
    )
  );
};

export const toggleIncludeCompletedCardsFilter = () => (dispatch, getState) => {
  dispatch(
    setIncludeCompletedCardsFilter(
      !getCurrentFilterValue('includeCompletedCards', getState)
    )
  );
};

export const toggleIncludeUnCompletedCardsFilter = () => (
  dispatch,
  getState
) => {
  dispatch(
    setIncludeUnCompletedCardsFilter(
      !getCurrentFilterValue('includeUnCompletedCards', getState)
    )
  );
};

export const toggleIncludeUnCompletedSortedCardsFilter = () => (
  dispatch,
  getState
) => {
  dispatch(
    setIncludeUnCompletedSortedCardsFilter(
      !getCurrentFilterValue('includeUnCompletedSortedCards', getState)
    )
  );
};

export const togglePeopleFilter = (filter, forceApply) => (
  dispatch,
  getState
) => {
  analytics.track('People Filter Applied', { Filter: filter });
  let newPeopleFilters = [];

  if (forceApply || filter == 'ALL') {
    newPeopleFilters = [filter];
  } else {
    const state = getState();
    const ctrlKeyDown = state._newReduxTree.utilities.ctrlKeyDown;
    const currentPeopleFilters = state._newReduxTree.filters.peopleFilters;

    newPeopleFilters = ctrlKeyDown
      ? toggleItemInclusionInArray(filter, currentPeopleFilters)
      : [filter];
  }

  dispatch(setPeopleFilters(newPeopleFilters));
  dispatch(
    updateUserUiSettings({ newSettings: { left_menu_people_filter: filter } })
  );
};

export const toggleTopicFilter = (filter, forceApply) => (
  dispatch,
  getState
) => {
  analytics.track('Topic Filter Applied', { Filter: filter });
  let newTopicFilters = [];

  if (forceApply || filter == 'ALL') {
    newTopicFilters = [filter];
  } else {
    const state = getState();
    const ctrlKeyDown = state._newReduxTree.utilities.ctrlKeyDown;
    const currentTopicFilters = state._newReduxTree.filters.topicFilters;

    newTopicFilters = ctrlKeyDown
      ? currentTopicFilters.includes(filter)
        ? currentTopicFilters.filter(filt => filt != filter)
        : [...currentTopicFilters, filter]
      : [filter];
  }
  dispatch(setTopicFilters(newTopicFilters));
  dispatch(
    updateUserUiSettings({ newSettings: { left_menu_topics_filter: filter } })
  );
};

export const setDefaultFiltersForView = viewKey => (dispatch, getState) => {
  let config = cardFilterForView[viewKey];
  if (!config) {
    config = {
      includeNested: false,
      includeSubtopicCards: true,
      includeCompletedCards: true,
      includeUnCompletedCards: true
    };
  }

  dispatch(
    batchActions([
      setIncludeSubtopicCardsFilter(config.includeSubtopicCards),
      setIncludeNestedCardsFilter(config.includeNested),
      setIncludeCompletedCardsFilter(config.includeCompletedCards),
      setIncludeUnCompletedCardsFilter(config.includeUnCompletedCards)
    ])
  );
};
