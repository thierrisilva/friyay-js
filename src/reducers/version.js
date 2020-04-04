import { switchcaseF } from './utils';
import { UPDATE_APP_VERSION } from 'AppConstants';
const initialState = localStorage.getItem('currentVersion');
const updateVersion = (state, payload) => {
  try {
    localStorage.setItem('currentVersion', payload);
  } catch (err) {
    console.error(err);
  }

  return payload;
};

const version = (state = initialState, { type, payload }) =>
  switchcaseF({
    [UPDATE_APP_VERSION]: updateVersion
  })(state)(type)(state, payload);

export default version;
