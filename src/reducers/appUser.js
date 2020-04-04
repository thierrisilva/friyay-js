import { switchcaseF } from './utils';
import { 
  GET_APP_USER_REQUEST,
  GET_APP_USER_FAILURE,
  GET_APP_USER_SUCCESS, 
  UPDATE_APP_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  LOGIN_USER_REQUEST,
  RESET_USER,
  LOGOUT_USER,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILURE,
  SET_UI_SETTINGS,
  FINISH_INTRO_TOUR
} from 'AppConstants';
import isEqual from 'lodash/isEqual';
import Auth from 'Lib/auth';
import {
  ifElse,
  not,
  compose,
  isNil,
  propEq,
  lensProp,
  view,
  find,
  T,
  length, 
  split, 
  gt, 
  always, 
  lensIndex, 
  __,
  propOr
} from 'ramda';

const notNil = compose(not, isNil);
const getDomain = ifElse(
  compose(gt(__, 2), length, split('.')),
  compose(view(lensIndex(0)), split('.')),
  always('')
);
const domain = getDomain(window.location.hostname);
const titleOrNull = propOr(null, 'title');
const detailsOrEmpty = propOr([], 'details');

const getUiIntro =
  compose(
    ifElse(notNil, view(lensProp('value')), T),
    find(propEq('key', 'tour_introduction_finished'))
  );
const cookieUserId = Auth.getCookie('userId');
const cookieUserEmail = Auth.getCookie('userEmail');

if (localStorage.getItem('user_id') === null && cookieUserId !== undefined) {
  localStorage.setItem('user_id', cookieUserId);
}

if (localStorage.getItem('user_name') === null && cookieUserEmail !== undefined) {
  localStorage.setItem('user_name', cookieUserEmail);
  localStorage.setItem('user_email', cookieUserEmail);
}

const initialState = { 
  isLoading: null,
  id: localStorage.getItem('user_id'),
  email: localStorage.getItem('user_email'),
  username: localStorage.getItem('user_username'),
  name: localStorage.getItem('user_name'),
  firstName: localStorage.getItem('user_first_name'),
  lastName: localStorage.getItem('user_last_name'),
  avatar: localStorage.getItem('user_avatar'),
  user: null,
  error: {
    title: null,
    details: []
  },
  introTourFinished: true
};

const setUiSettings = (state, payload) => ({
  ...state,
  introTourFinished: domain !== 'support' ? getUiIntro(payload) : true
});
const finishTour = state => ({
  ...state,
  introTourFinished: true
});
const setLoading = state => ({ ...state, isLoading: true });
const setError = (state, payload) => ({ 
  ...state, 
  isLoading: false,
  error: {
    title: titleOrNull(payload),
    details: detailsOrEmpty(payload)
  } 
});
const setUser = (state, payload) => {
  const {
    id,
    attributes: {
      email,
      username,
      first_name,
      last_name,
    },
    relationships: {
      user_profile
    }
  } = payload;

  const name = `${first_name} ${last_name}`;
  const avatar = user_profile ? user_profile.data.avatar_url : null;

  if (!isEqual(state.id, id)) localStorage.setItem('user_id', id);
  if (!isEqual(state.email, email)) localStorage.setItem('user_email', email);
  if (!isEqual(state.username, username)) localStorage.setItem('user_username', username);
  if (!isEqual(state.name, name)) localStorage.setItem('user_name', name);
  if (!isEqual(state.avatar, avatar)) localStorage.setItem('user_avatar', avatar);
  if (!isEqual(state.firstName, first_name)) localStorage.setItem('user_first_name', first_name);
  if (!isEqual(state.lastName, last_name)) localStorage.setItem('user_last_name', last_name);

  return {
    ...state,
    isLoading: false,
    user: payload,
    id,
    email,
    username,
    name,
    avatar,
    firstName: first_name,
    lastName: last_name,
    error: {
      title: null,
      details: []
    }
  };
};
const sweepUser = (state, payload = null) => {
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_username');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_avatar');
  localStorage.removeItem('user_first_name');
  localStorage.removeItem('user_last_name');
  localStorage.removeItem('tiphiveAutosave');
  localStorage.removeItem('TopicViewFilter');

  return {
    ...state,
    isLoading: false,
    user: null,
    id: null,
    email: null,
    username: null,
    name: null,
    avatar: null,
    firstName: null,
    lastName: null,
    error: {
      title: titleOrNull(payload),
      details: detailsOrEmpty(payload)
    }
  };
};

const appUser = (state = initialState, { type, payload }) => 
  switchcaseF({
    [LOGIN_USER_REQUEST]: setLoading,
    [REGISTER_USER_REQUEST]: setLoading,
    [LOGIN_USER_FAILURE]: sweepUser,
    [REGISTER_USER_FAILURE]: sweepUser,
    [LOGIN_USER_SUCCESS]: setUser,
    [REGISTER_USER_SUCCESS]: setUser,
    [GET_APP_USER_FAILURE]: setError,
    [GET_APP_USER_REQUEST]: setLoading,
    [GET_APP_USER_SUCCESS]: setUser,
    [UPDATE_APP_USER]: setUser,
    [RESET_USER]: sweepUser,
    [LOGOUT_USER]: sweepUser,
    [SET_UI_SETTINGS]: setUiSettings,
    [FINISH_INTRO_TOUR]: finishTour
  })(state)(type)(state, payload);

export default appUser;