import { CancelToken } from 'axios';
import { ApiRequest } from 'Lib/ApiRequest';
import getUrlParams from '../utils/getUrlParams';
import { success, failure } from 'Utils/toast';
import uniqueId from 'lodash/uniqueId';
import {
  GET_COMMENTS_REQUEST,
  GET_COMMENTS_SUCCESS,
  GET_COMMENTS_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
  UPDATE_COMMENT_REQUEST,
  UPDATE_COMMENT_SUCCESS,
  UPDATE_COMMENT_FAILURE,
  REMOVE_COMMENT_SUCCESS,
  REMOVE_COMMENT_FAILURE,
  GET_USERS_COMMENTS_SUCCESS,
  GET_USERS_COMMENTS_FAILURE,
  SET_COMMENT_EDIT,
  RESET_COMMENT_EDIT
} from 'AppConstants';

let getCommentsCancel = null;
let commentsCancelId = null;

export const getComments = id => async dispatch => {
  if (getCommentsCancel !== null) {
    getCommentsCancel(`CANCEL_REQUEST ${commentsCancelId}`);
    getCommentsCancel = null;
    commentsCancelId = null;
  }

  dispatch({ type: GET_COMMENTS_REQUEST });

  try {
    const { data: { data } } = await ApiRequest.request({
      url: `tips/${id}/comments`,
      cancelToken: new CancelToken(function executor(c) {
        getCommentsCancel = c;
        commentsCancelId = uniqueId();
      })
    }).catch(err => {
      // TODO: Detail full error if comes from server
      if (err.message.includes('CANCEL_REQUEST')) {
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
          console.group('CANCEL REQUEST');
          console.info('Request id', commentsCancelId);
          console.info(
            'Request url',
            `tips/${id}/comments`
          );
          console.groupEnd('CANCEL REQUEST');
        }

        throw new Error('CANCEL_REQUEST');
      }
    })

    dispatch({
      type: GET_COMMENTS_SUCCESS,
      payload: data
    });
  } catch (error) {
    if (error.message !== 'CANCEL_REQUEST') {
      console.error(error);

      dispatch({
        type: GET_COMMENTS_FAILURE,
        payload: error
      });

      failure('Unable to load comments');
    }
  } finally {
    getCommentsCancel = null;
    commentsCancelId = null;
  }

  return true;
};

export const saveComment = ({ id, body }) => async dispatch => {
  dispatch({ type: ADD_COMMENT_REQUEST });

  const params = {
    data: {
      attributes: {
        body
      }
    }
  };

  let label = null;

  try {
    const { data: { data } } = await ApiRequest.request({
      method: 'POST',
      data: params,
      url: `tips/${id}/comments`
    });

    label = data;

    dispatch({
      type: ADD_COMMENT_SUCCESS,
      payload: data
    });

    success('Comment added');
  } catch (error) {
    dispatch({
      type: ADD_COMMENT_FAILURE,
      payload: error
    });

    failure('Unable to add comment');
  }

  return label;
};

export const updateComment = ({ id, body }) => async dispatch => {
  dispatch({ type: UPDATE_COMMENT_REQUEST });

  const params = { data: { attributes: { body } } };

  try {
    const { data: { data } } = await ApiRequest.request({
      method: 'PATCH',
      data: params,
      url: `comments/${id}`
    });

    dispatch({
      type: UPDATE_COMMENT_SUCCESS,
      payload: data
    });

    success('Comment updated successfully');
  } catch (error) {
    dispatch({
      type: UPDATE_COMMENT_FAILURE,
      payload: error
    });

    failure('Unable to update comment');
  }
};

export const removeComment = (id, tipId) => async dispatch => {
  try {
    await ApiRequest.request({
      method: 'DELETE',
      url: `comments/${id}`
    });

    dispatch({
      type: REMOVE_COMMENT_SUCCESS,
      payload: { id, tipId }
    });

    success('Comment deleted successfully');
  } catch (error) {
    dispatch({
      type: REMOVE_COMMENT_FAILURE,
      payload: error
    });

    failure('Unable to remove comment');
  }

  return true;
};

export const getUsers = () => async dispatch => {
  let users = [];

  const params = {
    page: {
      size: 999
    }
  };

  try {
    const { data: { data } } = await ApiRequest.request({
      url: `users?${getUrlParams(params)}`
    });

    users = data;

    dispatch({
      type: GET_USERS_COMMENTS_SUCCESS,
      payload: data
    });
  } catch (error) {
    console.error(error);

    dispatch({
      type: GET_USERS_COMMENTS_FAILURE,
      payload: error
    });

    failure('Unable to load users');
  }

  return users;
};

export const editComment = id => dispatch =>
  dispatch({
    type: SET_COMMENT_EDIT,
    payload: id
  });

export const resetComment = () => dispatch =>
  dispatch({ type: RESET_COMMENT_EDIT });
