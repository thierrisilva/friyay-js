import { CancelToken } from 'axios';
import { ApiRequest } from '../lib/ApiRequest';
import { failure } from '../utils/toast';

import {
  NOTIFICATION_RECEIVED,
  GET_NOTIFICATIONS_FAILURE,
  GET_NOTIFICATIONS_REQUEST,
  GET_NOTIFICATIONS_SUCCESS,
  MARK_ALL_NOTIFICATIONS_READ,
  MARK_NOTIFICATION_READ
} from 'AppConstants';

let getLatestCancel = null;

export const getLatest = () => async dispatch => {
  if (getLatestCancel !== null) {
    getLatestCancel();
  }

  dispatch({ type: GET_NOTIFICATIONS_REQUEST });

  try {
    const { data: { data, included } } = await ApiRequest.request({
      url: 'notifications',
      cancelToken: new CancelToken(function executor(c) {
        getLatestCancel = c;
      })
    });

    dispatch({
      type: GET_NOTIFICATIONS_SUCCESS,
      payload: {
        notifications: data,
        related: included
      }
    });
  } catch (error) {
    console.error(error);

    dispatch({
      type: GET_NOTIFICATIONS_FAILURE,
      payload: error
    });

    failure('Unable to load notifications');
  } finally {
    getLatestCancel = null;
  }

  return true;
};

export const pushNotification = (
  userId = null,
  notification = null
) => dispatch => {
  if (!userId || !notification || !notification.data) {
    return false;
  }

  const { data: { relationships } } = notification;

  if (!relationships || !relationships.user || !relationships.user.data) {
    return false;
  }

  const { user: { data: { id } } } = relationships;

  if (userId.toString() !== id.toString()) {
    return false;
  }

  devLog('New notification', notification);

  dispatch({
    type: NOTIFICATION_RECEIVED,
    payload: notification
  });
};

export const markAllRead = () => async dispatch => {
  try {
    await ApiRequest.request({
      method: 'PATCH',
      url: 'notifications/mark_as_read'
    });

    dispatch({ type: MARK_ALL_NOTIFICATIONS_READ });
  } catch (error) {
    console.error(error);
  }
};

export const markAsRead = id => async dispatch => {
  try {
    await ApiRequest.request({
      method: 'PATCH',
      data: { id },
      url: 'notifications/mark_as_read'
    });

    dispatch({
      type: MARK_NOTIFICATION_READ,
      payload: id
    });
  } catch (error) {
    console.error(error);
  }
};
