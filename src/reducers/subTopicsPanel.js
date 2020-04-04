import { switchcaseF } from './utils';
import { TOGGLE_SUBTOPICS_PANEL } from 'AppConstants';

const initialState = { 
  isVisible: false 
};

const toggleSubTopicsPanel = (state, payload = null) => ({
  ...state, 
  isVisible: payload === null 
    ? !state.isVisible
    : payload
});

const subtopicsPanel = (state = initialState, { type, payload }) => 
  switchcaseF({
    [TOGGLE_SUBTOPICS_PANEL]: toggleSubTopicsPanel,
  })(state)(type)(state, payload);

export default subtopicsPanel;