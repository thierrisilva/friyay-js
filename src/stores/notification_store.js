import { ReduceStore } from 'flux/utils';

import NotificationDispatcher from '../dispatchers/notification_dispatcher';

import APIRequest from '../lib/ApiRequest';

let $notificationsLoadXHR;

class NotificationStore extends ReduceStore {
  constructor() {
    super(NotificationDispatcher);
  }

  getInitialState() {
    return {
      loadsCount:    0,
      hasUnread:     false,
      notifications: [],
      meta:          {},
      isLoading:     false
    };
  }

  pushNotification(state, action) {
    let newState = Object.assign({}, state);

    newState.loadsCount = state.loadsCount + 1;
    newState.hasUnread = true;
    newState.notifications.unshift(action.notification.data);

    return newState;
  }

  loadLatestNotifications(state, action) {
    let newState = Object.assign({}, state);

    newState.isLoading = true;

    if ($notificationsLoadXHR) {
      APIRequest.abort($notificationsLoadXHR);
    }

    $notificationsLoadXHR = APIRequest.get({
      resource: 'notifications'
    });

    $notificationsLoadXHR.done((response, status, xhr) => {
      NotificationDispatcher.dispatch({
        type:          'LOAD_LATEST_NOTIFICATIONS_DONE',
        notifications: response.data,
        meta:          response.meta
      });
    }).fail((xhr, status, error) => {
      NotificationDispatcher.dispatch({
        type:          'LOAD_LATEST_NOTIFICATIONS_FAIL'
      });
    });

    return newState;
  }

  loadLatestNotificationsDone(state, action) {
    let newState = Object.assign({}, state);

    let { notifications, meta } = action;

    newState.loadsCount    = state.loadsCount + 1;
    newState.isLoading     = false;
    newState.notifications = notifications;
    newState.meta          = meta;

    for (let i = 0, len = notifications.length; i < len; i++) {
      let notification = notifications[i];
      if (!notification.attributes.read_at) {
        newState.hasUnread = true;
        break;
      }
    }

    return newState;
  }

  loadLatestNotificationsFail(state, action) {
    let newState = Object.assign({}, state);

    newState.hasUnread = false;

    return newState;
  }

  markAllAsRead(state, action) {
    let newState = Object.assign({}, state);

    newState.hasUnread = false;
    for (let i = 0, len = newState.notifications.length; i < len; i++) {
      let notification = newState.notifications[i];
      if (notification.attributes.read_at) {
        continue;
      }

      notification.attributes.read_at = (new Date()).toISOString();
    }

    APIRequest.patch({
      resource: 'notifications/mark_as_read'
    });

    return newState;
  }

  markAsRead(state, action) {
    let newState = Object.assign({}, state);

    let readNotification = action.notification;

    newState.hasUnread = false;
    for (let i = 0, len = newState.notifications.length; i < len; i++) {
      let notification = newState.notifications[i];

      if (notification.id.toString() === readNotification.id.toString()) {
        notification.attributes.read_at = (new Date()).toISOString();

        APIRequest.patch({
          resource: 'notifications/mark_as_read',
          data: {
            id: notification.id
          }
        });

        continue;
      }

      if (!notification.attributes.read_at) {
        newState.hasUnread = true;
      }
    }

    return newState;
  }

  reduce(state, action) {
    switch (action.type) {
      case 'PUSH_NOTIFICATION':
        return this.pushNotification(state, action);

      case 'LOAD_LATEST_NOTIFICATIONS':
        return this.loadLatestNotifications(state, action);

      case 'LOAD_LATEST_NOTIFICATIONS_DONE':
        return this.loadLatestNotificationsDone(state, action);

      case 'LOAD_LATEST_NOTIFICATIONS_FAIL':
        return this.loadLatestNotificationsFail(state, action);

      case 'MARK_ALL_AS_READ':
        return this.markAllAsRead(state, action);

      case 'MARK_AS_READ':
        return this.markAsRead(state, action);

      default:
        return state;
    }
  }
}

export default new NotificationStore();
