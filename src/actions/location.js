import { LOCATION_CHANGE } from 'AppConstants';

export const updateLocation = ({ dispatch }) => 
  nextLocation => dispatch({
    type: LOCATION_CHANGE,
    payload: nextLocation
  });

export const setInitialLocation = location => dispatch => 
  dispatch({
    type: LOCATION_CHANGE,
    payload: location
  });