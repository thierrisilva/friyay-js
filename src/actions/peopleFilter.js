import { FILTER_USER_BY_ID, RESET_USER_FILTER } from 'AppConstants';

export const filterUserById = id => dispatch =>
  dispatch({
    type: FILTER_USER_BY_ID,
    payload: id
  });

export const resetUser = () => dispatch =>
  dispatch({
    type: RESET_USER_FILTER
  });
