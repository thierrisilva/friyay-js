import {
  ADD_LABEL_FILTER,
  REMOVE_LABEL_FILTER,
  REMOVE_ALL_LABEL_FILTER 
} from 'AppConstants';

export const addLabelFilter = id => dispatch =>
  dispatch({ type: ADD_LABEL_FILTER, payload: id });

export const removeLabelFilter = id => dispatch =>
  dispatch({ type: REMOVE_LABEL_FILTER, payload: id });

export const removeAllFilters = () => dispatch =>
  dispatch({ type: REMOVE_ALL_LABEL_FILTER });
