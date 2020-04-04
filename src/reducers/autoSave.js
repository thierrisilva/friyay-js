import { switchcaseF } from './utils';
import {
  SET_AUTO_SAVE_CONTENT,
  CLEAR_AUTO_SAVE_CONTENT
} from 'AppConstants';
import { ifElse, isNil, always, compose, not } from 'ramda';

const notNil = compose(not, isNil);
const getParsed = compose(JSON.parse, key => localStorage.getItem(key));
const getValueOrEmptyObject = ifElse(compose(notNil, getParsed), getParsed, always({}));

const initialState = { 
  mainTip: getValueOrEmptyObject('auto_save_content')
};
const setMainTipContent = (state, payload) => ({ 
  ...state,
  mainTip: payload
});
const clearMainTipContent = state => ({
  ...state,
  mainTip: {}
});

const autoSave = (state = initialState, { type, payload }) =>
  switchcaseF({
    [SET_AUTO_SAVE_CONTENT]: setMainTipContent,
    [CLEAR_AUTO_SAVE_CONTENT]: clearMainTipContent,
  })(state)(type)(state, payload);

export default autoSave;
