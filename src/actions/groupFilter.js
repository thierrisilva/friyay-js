import { FILTER_GROUP_BY_SLUG, RESET_GROUP_FILTER } from 'AppConstants';

export const filterGroupBySlug = slug => dispatch => 
  dispatch({
    type: FILTER_GROUP_BY_SLUG,
    payload: slug
  });

export const resetGroupFilter = () => dispatch => 
  dispatch({ type: RESET_GROUP_FILTER });