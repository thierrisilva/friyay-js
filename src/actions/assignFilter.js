import { SET_ASSIGN_FILTER } from 'AppConstants';

export function setAssignFilter(userId) {
  return {
    type: SET_ASSIGN_FILTER,
    payload: userId
  };
}

export function removeAssignFilter() {
  return {
    type: SET_ASSIGN_FILTER,
    payload: null
  };
}
