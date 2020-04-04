import { LOCATION_CHANGE, LOGOUT_USER } from 'AppConstants';
import { switchcaseF } from './utils';
import { isEmpty, identity, ifElse, always, compose, lensIndex, split, view } from 'ramda';
const valueOrTips = ifElse(isEmpty, always('tips'), identity);
const getModuleName = compose(valueOrTips, view(lensIndex(1)), split('/'));

const initialState = {
  current: null,
  last: null,
  currentModule: null,
  lastModule: null
};
const updateLocation = (state, payload) => {
  const routeModule = getModuleName(payload.pathname);
  
  return {
    ...state,
    current: payload,
    last: state.current,
    currentModule: state.currentModule === routeModule 
      ? state.currentModule 
      : routeModule,
    lastModule: state.currentModule === routeModule 
      ? state.lastModule
      : state.currentModule
  };
};
const reset = () => initialState;

const location = (state = initialState, { type, payload }) =>
  switchcaseF({
    [LOCATION_CHANGE]: updateLocation,
    [LOGOUT_USER]: reset
  })(state)(type)(state, payload);

export default location;
