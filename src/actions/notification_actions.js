import NotificationDispatcher from '../dispatchers/notification_dispatcher';

const NotificationActions = {
  pushNotification(user, notification) {
    if (!user || !notification || !notification.data) return;
    let relationships = notification.data.relationships;

    if (!relationships || !relationships.user || !relationships.user.data) return;
    let notifiedUser = relationships.user.data;

    if (user.id.toString() !== notifiedUser.id.toString()) return;

    NotificationDispatcher.dispatch({
      type: 'PUSH_NOTIFICATION',
      notification
    });
  },

  loadLatest() {
    NotificationDispatcher.dispatch({
      type: 'LOAD_LATEST_NOTIFICATIONS'
    });
  },

  markAllAsRead() {
    NotificationDispatcher.dispatch({
      type: 'MARK_ALL_AS_READ'
    });
  },

  markAsRead(notification) {
    if (notification.attributes.read_at) return;

    NotificationDispatcher.dispatch({
      type: 'MARK_AS_READ',
      notification
    });
  }
};

export default NotificationActions;
