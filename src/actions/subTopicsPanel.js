import { TOGGLE_SUBTOPICS_PANEL } from 'AppConstants';

export const toggleSubTopicsPanel = isVisible => async dispatch => 
  dispatch({
    type: TOGGLE_SUBTOPICS_PANEL,
    payload: isVisible
  });
