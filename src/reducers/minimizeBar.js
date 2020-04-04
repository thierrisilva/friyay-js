import { switchcaseF } from './utils';
import {
  MINIMIZE_TIP,
  RESTORE_TIP,
  TOGGLE_MINIMIZE_BAR,
  SET_UI_SETTINGS
} from 'AppConstants';
import {
  ifElse,
  always,
  not,
  compose,
  isNil,
  propEq,
  lensProp,
  view,
  find
} from 'ramda';
const notNil = compose(not, isNil);
const getMinimized =
  compose(
    ifElse(notNil, view(lensProp('value')), always(null)),
    find(propEq('key', 'minimize_dock'))
  );

const minimized = JSON.parse(localStorage.getItem('MinimizeDock'));

// Migrate old minimized tips content
// TODO: move this into app start
if (minimized !== null) {
  localStorage.setItem('minimize_dock', JSON.stringify(minimized));
  localStorage.removeItem('minimizeDock');
}

const initialState = {
  collection: minimized || [],
  show: false
};

const setUiSettings = (state, payload) => ({
  ...state,
  collection: getMinimized(payload)
});
const minimizeItem = (state, payload) => ({
  ...state,
  collection: payload,
  show: true
});
const restoreItem = (state, payload) => ({
  ...state,
  collection: payload
});
const toggleBar = state => ({
  ...state,
  show: !state.show
});

const minimizeBar = (state = initialState, { type, payload }) =>
  switchcaseF({
    [MINIMIZE_TIP]: minimizeItem,
    [RESTORE_TIP]: restoreItem,
    [TOGGLE_MINIMIZE_BAR]: toggleBar,
    [SET_UI_SETTINGS]: setUiSettings
  })(state)(type)(state, payload);

export default minimizeBar;
