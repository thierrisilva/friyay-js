import { inc, assocPath, ifElse, identity, compose, lensPath, view, isNil } from 'ramda';
import {
  GET_NOTIFICATIONS_FAILURE,
  GET_NOTIFICATIONS_REQUEST,
  GET_NOTIFICATIONS_SUCCESS,
  MARK_ALL_NOTIFICATIONS_READ,
  MARK_NOTIFICATION_READ,
  NOTIFICATION_RECEIVED
} from 'AppConstants';

import { switchcaseF } from './utils';

const markRead = assocPath(['attributes', 'read_at'], (new Date()).toISOString());
const hasNoReadDate = compose(isNil, view(lensPath(['attributes, read_at'])));
const markReadIfNot = ifElse(
  hasNoReadDate,
  markRead,
  identity
);

const initialState = {
  loadsCount: 0,
  hasUnread: false,
  collection: [],
  related: [],
  isLoading: null
};

const setError = state => ({
  ...state,
  hasUnread: false,
  isLoading: false
});
const setLoading = state => ({
  ...state,
  isLoading: true
});
const getLatest = (state, payload) => ({
  ...state,
  collection: payload.notifications,
  related: payload.related,
  loadsCount: inc(state.loadsCount),
  hasUnread: payload.notifications.some(
    ({ attributes: { read_at }}) => isNil(read_at)
  )
});
const markAllRead = state => ({
  ...state,
  collection: state.collection.map(markReadIfNot),
  hasUnread: false
});
const markAsRead = (state, payload) => ({
  ...state,
  collection: state.collection.map(
    item => item.id.toString() === payload.toString()
      ? markReadIfNot(item)
      : item
  ),
  hasUnread: state.collection
    .map(
      item => item.id.toString() === payload.toString()
        ? markReadIfNot(item)
        : item
    )
    .some(
      ({ attributes: { read_at }}) => isNil(read_at)
    )
});

const pushNotification = (state, payload) => ({
  ...state,
  collection: [payload.data, ...state],
  loadsCount: inc(state.loadsCount),
  hasUnread: true
});

const notifications = (state = initialState, { type, payload }) =>
  switchcaseF({
    [GET_NOTIFICATIONS_FAILURE]: setError,
    [GET_NOTIFICATIONS_REQUEST]: setLoading,
    [GET_NOTIFICATIONS_SUCCESS]: getLatest,
    [MARK_ALL_NOTIFICATIONS_READ]: markAllRead,
    [MARK_NOTIFICATION_READ]: markAsRead,
    [NOTIFICATION_RECEIVED]: pushNotification,
  })(state)(type)(state, payload);

export default notifications;
