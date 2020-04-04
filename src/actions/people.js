import { CancelToken } from 'axios';
import { ApiRequest } from '../lib/ApiRequest';
import { merge } from 'ramda';
import getUrlParams from '../utils/getUrlParams';
import { failure } from 'Utils/toast';
import uniqueId from 'lodash/uniqueId';

import {
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_FAILURE,
  FOLLOW_USER,
  UNFOLLOW_USER,
  FOLLOW_USER_FAILURE,
  UNFOLLOW_USER_FAILURE,
  GET_USER_BY_ID_REQUEST,
  GET_USER_BY_ID_SUCCESS,
  GET_USER_BY_ID_FAILURE,
  LEFT_MENU_FOLLOW_USER,
  LEFT_MENU_FOLLOW_USER_FAILURE,
  LEFT_MENU_UNFOLLOW_USER,
  LEFT_MENU_UNFOLLOW_USER_FAILURE
} from 'AppConstants';
import { MENU_FILTER as FILTER } from 'Enums';

let getPeopleCancel = null;
let peopleCancelId = null;
let getUserByIdCancel = null;
let userByIdCancelId = null;

const defaultOptions = merge({
  with_details: true,
  filter: {
    users: FILTER.ALL,
    is_active: true
  },
  page: {
    number: 1,
    size: 25
  }
});

export const getPeople = options => async dispatch => {
  if (getPeopleCancel !== null) {
    getPeopleCancel(`CANCEL_REQUEST ${peopleCancelId}`);
    getPeopleCancel = null;
    peopleCancelId = null;
  }

  dispatch({ type: GET_USERS_REQUEST });

  let currentPage = 1;
  let totalPages = 1;
  let totalCount = 0;

  try {
    const { data: { data, meta } } = await ApiRequest.request({
      url: `users?${getUrlParams(defaultOptions(options))}`,
      cancelToken: new CancelToken(function executor(c) {
        getPeopleCancel = c;
        peopleCancelId = uniqueId();
      })
    }).catch(err => {
      // TODO: Detail full error if comes from server
      if (err.message.includes('CANCEL_REQUEST')) {
        throw new Error('CANCEL_REQUEST');
      }
    });

    if (meta) {
      currentPage = meta.current_page;
      totalPages = meta.total_pages;
      totalCount = meta.total_count;
    }

    dispatch({
      type: GET_USERS_SUCCESS,
      payload: {
        people: data,
        currentPage,
        totalPages,
        totalCount
      }
    });
  } catch (error) {
    if (error.message !== 'CANCEL_REQUEST') {
      console.error(error);

      dispatch({
        type: GET_USERS_FAILURE,
        payload: error
      });

      failure('Unable to load users');
    }
  } finally {
    getPeopleCancel = null;
  }

  return true;
};

export const getUserById = id => async dispatch => {
  if (getUserByIdCancel !== null) {
    getUserByIdCancel(`CANCEL_REQUEST ${userByIdCancelId}`);
    getUserByIdCancel = null;
    userByIdCancelId = null;
  }

  dispatch({ type: GET_USER_BY_ID_REQUEST });

  let user = null;

  try {
    const { data: { data } } = await ApiRequest.request({
      url: `users/${id}`,
      cancelToken: new CancelToken(function executor(c) {
        getUserByIdCancel = c;
        userByIdCancelId = uniqueId();
      })
    }).catch(err => {
      // TODO: Detail full error if comes from server
      if (err.message.includes('CANCEL_REQUEST')) {
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
          console.group('CANCEL REQUEST');
          console.info('Request id', userByIdCancelId);
          console.info(
            'Request url',
            `users/${id}`
          );
          console.groupEnd('CANCEL REQUEST');
        }

        throw new Error('CANCEL_REQUEST');
      }

      if (err.response.status === 422) {
        throw new Error('UNPROCESSABLE_ENTITY');
      }
    });

    user = data;

    dispatch({
      type: GET_USER_BY_ID_SUCCESS,
      payload: data
    });
  } catch (error) {
    if (error.message !== 'CANCEL_REQUEST') {
      console.error(error);

      dispatch({
        type: GET_USER_BY_ID_FAILURE,
        payload: [error.message]
      });
  
      failure('Unable to load user');  
    }
  } finally {
    getUserByIdCancel = null;
    userByIdCancelId = null;
  }

  return user;
};

export const followUser = user => async dispatch => {
  try {
    dispatch({
      type: FOLLOW_USER,
      payload: user
    });

    dispatch({
      type: LEFT_MENU_FOLLOW_USER,
      payload: user
    });

    await ApiRequest.request({
      method: 'POST',
      url: `users/${user.id}/follow`
    });
  } catch (error) {
    dispatch({
      type: FOLLOW_USER_FAILURE,
      payload: user
    });

    dispatch({
      type: LEFT_MENU_FOLLOW_USER_FAILURE,
      payload: user
    });

    failure('Unable to follow user');
  }

  return true;
};

export const unfollowUser = user => async dispatch => {
  try {
    dispatch({
      type: UNFOLLOW_USER,
      payload: user.id
    });

    dispatch({
      type: LEFT_MENU_UNFOLLOW_USER,
      payload: user.id
    });

    await ApiRequest.request({
      method: 'POST',
      url: `users/${user.id}/unfollow`
    });
  } catch (error) {
    dispatch({
      type: UNFOLLOW_USER_FAILURE,
      payload: user
    });

    dispatch({
      type: LEFT_MENU_UNFOLLOW_USER_FAILURE,
      payload: user
    });

    failure('Unable to unfollow user');
  }

  return true;
};
