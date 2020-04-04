import { switchcaseF } from './utils';
import { not } from 'ramda';
import { TOGGLE_LABELS_PANEL } from 'AppConstants';

const initialState = { isVisible: false };
const togglePanel = state => ({ ...state, isVisible: not(state.isVisible) });

const labelsPanel = (state = initialState, { type }) => 
  switchcaseF({
    [TOGGLE_LABELS_PANEL]: togglePanel,
  })(state)(type)(state);

export default labelsPanel;