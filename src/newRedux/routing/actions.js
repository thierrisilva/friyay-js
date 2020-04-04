import actionTypes from './actionEnum';


export const setRouterHistory = ( history ) => ({
  type: actionTypes.setHistory,
  payload: history
});
