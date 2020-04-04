import { ApiRequest, getToken, refreshInstance, ApiRequestWithoutToken } from 'Lib/ApiRequest';
import { success, failure } from 'Utils/toast';
import { changePerson } from 'Src/newRedux/database/people/actions';
import { changeUser } from 'Src/newRedux/database/user/actions';
import {
  GET_APP_USER_FAILURE,
  GET_APP_USER_REQUEST,
  UPDATE_APP_USER,
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  RESET_USER,
  LOGOUT_USER,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILURE,
  SET_FOLLOWING_USER,
  SET_UI_SETTINGS,
  FINISH_INTRO_TOUR,
  GET_APP_USER_SUCCESS
} from 'AppConstants';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import Auth from 'Lib/auth';
import { pathOr } from 'ramda';
const getProfileId = pathOr(null, [
  'relationships',
  'user_profile',
  'data',
  'id'
]);

export const finishTour = () => (dispatch, getState) => {
  const { appUser } = getState();
  const profileId = getProfileId(appUser.user);

  try {
    if (profileId === null) {
      return false;
    }

    ApiRequest.request({
      method: 'POST',
      url: `users/${appUser.id}/user_profile`,
      data: {
        id: profileId,
        user_id: appUser.id,
        data: {
          attributes: {
            user_attributes: {
              id: appUser.id
            }
          },
          ui_settings: {
            tour_introduction_finished: true
          }
        }
      }
    });
  } catch (error) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.error(error);
    }
  }

  try {
    localStorage.setItem('tour_introduction_finished', JSON.stringify(true));
  } catch (err) {
    console.error(err);
  }

  dispatch({ type: FINISH_INTRO_TOUR });
};

export const loginUser = ({ email, password }) => async dispatch => {
  dispatch({ type: LOGIN_USER_REQUEST });
  let isLogged = false;
  let user = null;

  try {
    const params = { user: { email, password } };
    const { data: { data } } = await ApiRequestWithoutToken.request({
      method: 'POST',
      url: 'sessions',
      data: params
    }).catch(({ response }) => {
      if (response === undefined) {
        throw new Error('Please check your internet connection');
      }

      const { data: { errors: { detail = [], title } } } = response;
      if (detail.length === 0) {
        throw new Error(`UNKNOWN_ERROR ${title}`);
      }

      throw new Error(`UNPROCESSABLE_ENTITY ${detail.join('::')}`);
    });

    user = data;

    Auth.setCookie('authToken', data.attributes.auth_token);
    Auth.setNotificationSettings(data);

    refreshInstance();

    const token = getToken();

    if (!token) {
      window.location.href = '/login';
    }

    const {
      data: { user_id = null, user_email = null, guest_auth_token = null }
    } = await ApiRequest.request({
      method: 'POST',
      url: 'decode_token',
      data: {
        token
      }
    });

    if (user_id !== null && user_email !== null) {
      isLogged = true;
      const {
        attributes: { ui_settings },
        relationships: {
          following_users
        }
      } = data;

      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: data
      });

      dispatch({
        type: SET_UI_SETTINGS,
        payload: ui_settings
      });

      dispatch({
        type: SET_FOLLOWING_USER,
        payload: following_users.data.map(({ id }) => id)
      });
    } else if (
      guest_auth_token !== null &&
      window.currentDomainName === 'support'
    ) {
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: data
      });

      if (!localStorage.getItem('guestAuthToken')) {
        localStorage.setItem('guestAuthToken', guest_auth_token);
        isLogged = false;
        setTimeout(() => {
          if (localStorage.redirectTo) {
            window.location.href = localStorage.redirectTo;
            delete localStorage.redirectTo;
          } else {
            window.location.href = '/';
          }
        }, 500);
      } else {
        localStorage.setItem('guestAuthToken', guest_auth_token);
      }
    }
  } catch ({ message }) {
    failure('Could not log in');

    if (message.includes('UNPROCESSABLE_ENTITY')) {
      dispatch({
        type: LOGIN_USER_FAILURE,
        payload: {
          details: message.replace('UNPROCESSABLE_ENTITY', '').trim().split('::')
        }
      });
    } else if (message.includes('UNKNOWN_ERROR')) {
      dispatch({
        type: LOGIN_USER_FAILURE,
        payload: {
          title: message.replace('UNKNOWN_ERROR', '').trim()
        }
      });
    }
  }

  return { isLogged, user };
};

export const registerUser = ({ firstName, lastName, email, password, confirmPassword, invitationToken }) => async dispatch => {

  dispatch({ type: REGISTER_USER_REQUEST });

  let isRegistered = false;
  let isLogged = false;
  let user = null;

  try {
    if (!isEqual(password, confirmPassword)) {
      throw { detail:[ "Passwords don't match" ]};
    }

    if (isEmpty(password) || isEmpty(confirmPassword)) {
      throw { detail:[ 'Password missing!' ]};
    }

    const params = {
      invitation_token: invitationToken,
      user: {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        password_confirmation: confirmPassword
      }
    };

    const { data: { data } } = await ApiRequest.request({
      method: 'POST',
      url: 'registrations',
      data: params
    }).catch(({ response }) => {

      if (response === undefined) {
        throw { title: 'Please check your internet connection'};
      }
      const { data: { errors: error }} = response;
      throw error;
    });

    isRegistered = true;
    user = data;

    Auth.setCookie('authToken', data.attributes.auth_token);
    Auth.setNotificationSettings(data);

    refreshInstance();

    const token = getToken();

    if (!token) {
      window.location.href = '/login';
    }

    const {
      data: { user_id = null, user_email = null, guest_auth_token = null }
    } = await ApiRequest.request({
      method: 'POST',
      url: 'decode_token',
      data: { token }
    });

    if (user_id !== null && user_email !== null) {
      Auth.setCookie('userId', user_id);
      Auth.setCookie('userEmail', user_email);

      isLogged = true;

      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: data
      });
    } else if (
      guest_auth_token !== null &&
      window.currentDomainName === 'support'
    ) {
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: data
      });

      if (!localStorage.getItem('guestAuthToken')) {
        localStorage.setItem('guestAuthToken', guest_auth_token);
        isLogged = false;
        setTimeout(() => {
          if (localStorage.redirectTo) {
            window.location.href = localStorage.redirectTo;
            delete localStorage.redirectTo;
          } else {
            window.location.href = '/';
          }
        }, 500);
      } else {
        localStorage.setItem('guestAuthToken', guest_auth_token);
      }
    }
  } catch ( error ) {
    failure(`Could not ${isRegistered ? 'log in' : 'register account'}`);
    return { error };
  }

  return { isLogged, user };
};

export const processToken = () => async dispatch => {
  let isLogged = false;

  try {
    const token = getToken();

    if (!token) {
      window.location.href = '/login';
    }

    const {
      data: { user_id = null, user_email = null, guest_auth_token = null }
    } = await ApiRequest.request({
      method: 'POST',
      url: 'decode_token',
      data: { token }
    });

    if (user_id !== null && user_email !== null) {
      Auth.setCookie('userId', user_id);
      Auth.setCookie('userEmail', user_email);

      isLogged = true;

      if (localStorage.getItem('user_id') === null) {
        const { data: { data } } = await ApiRequest.request({ url: 'me' });

        dispatch({ type: GET_APP_USER_SUCCESS, payload: data });
        dispatch({
          type: SET_UI_SETTINGS,
          payload: data.relationships.user_profile.data.ui_settings
        });
        dispatch({
          type: SET_FOLLOWING_USER,
          payload: data.relationships.following_users.data.map(user => user.id)
        });
      }
    } else if (
      guest_auth_token !== null &&
      window.currentDomainName === 'support'
    ) {
      if (localStorage.getItem('user_id') === null) {
        const { data: { data } } = await ApiRequest.request({ url: 'me' });

        dispatch({ type: GET_APP_USER_SUCCESS, payload: data });
        dispatch({
          type: SET_UI_SETTINGS,
          payload: data.relationships.user_profile.data.ui_settings
        });
        dispatch({
          type: SET_FOLLOWING_USER,
          payload: data.relationships.following_users.data.map(user => user.id)
        });
      }

      if (!localStorage.getItem('guestAuthToken')) {
        localStorage.setItem('guestAuthToken', guest_auth_token);
        isLogged = false;
        setTimeout(() => {
          if (localStorage.redirectTo) {
            window.location.href = localStorage.redirectTo;
            delete localStorage.redirectTo;
          } else {
            window.location.href = '/';
          }
        }, 500);
      } else {
        localStorage.setItem('guestAuthToken', guest_auth_token);
      }
    }
  } catch (err) {
    console.error(err);
  }

  return isLogged;
};

export const updateUser = ({
  id,
  avatar,
  firstName,
  lastName,
  email,
  currentPassword,
  newPassword,
  confirmPassword,
  resourceCapacity
}) => async dispatch => {
  dispatch({ type: GET_APP_USER_REQUEST });

  try {
    if (!isEqual(newPassword, confirmPassword)) {
      throw new Error('PASSWORD_MISMATCH');
    }

    if (!isEmpty(newPassword) && isEmpty(currentPassword)) {
      throw new Error('PASSWORD_MISSING');
    }

    const params = {
      data: {
        attributes: {
          resource_capacity: resourceCapacity,
          user_attributes: {
            id,
            first_name: firstName,
            last_name: lastName,
            email,
            password: newPassword,
            password_confirmation: confirmPassword,
            current_password: currentPassword
          }
        }
      }
    };

    const { data: { data } } = await ApiRequest.request({
      method: 'POST',
      url: `users/${id}/user_profile`,
      data: params
    });

    dispatch({
      type: UPDATE_APP_USER,
      payload: data
    });

    const changeData = {
      id,
      attributes: {
        avatar_url: get(data, 'relationships.user_profile.data.avatar_url', avatar),
        email: get(data, 'attributes.email', email),
        first_name: get(data, 'attributes.first_name', firstName),
        last_name: get(data, 'attributes.last_name', lastName),
        name: get(data, 'attributes.name'),
        resource_capacity: get(data, 'relationships.user_profile.data.resource_capacity', resourceCapacity)
      }
    };

    dispatch(changeUser(changeData));
    dispatch(changePerson(changeData));
  } catch (error) {
    if (error.message === 'PASSWORD_MISMATCH') {
      failure('Passwords don\'t match');
    } else if (error.message === 'PASSWORD_MISSING') {
      failure('Current password not set');
    } else {
      failure('Could not update profile');
      dispatch({
        type: GET_APP_USER_FAILURE,
        payload: {
          title: error
        }
      });
    }
  }
};

export const updateSettings = ({ id, setting, value }) => async dispatch => {
  dispatch({ type: GET_APP_USER_REQUEST });

  try {
    const params = {
      data: {
        attributes: {
          user_attributes: {
            id
          }
        },
        email_notifications: {
          [setting]: value
        }
      }
    };

    await ApiRequest.request({
      method: 'POST',
      url: `users/${id}/user_profile`,
      data: params
    });

    success('Notification setting updated');
    localStorage.setItem(setting, value);
  } catch (error) {
    failure('Could not update notification setting');
  }
};

export const resetUser = () => dispatch =>
  dispatch({ type: RESET_USER });


export const logoutUser = () => async dispatch => {
  await ApiRequest.request({
    method: 'DELETE',
    url: 'sessions'
  });

  Auth.sweepUserData();

  dispatch({ type: LOGOUT_USER });
};
