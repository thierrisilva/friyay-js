import actionTypes from './actionEnum';

export const addNotifications = ( normalizedNotifications ) => ({
  type: actionTypes.add,
  payload: normalizedNotifications
});


export const deleteNotification = ( notificationId ) => ({
  type: actionTypes.delete,
  payload: notificationId
});


export const changeNotification = ( notification ) => ({
  type: actionTypes.change,
  payload: {
    [ notification.id ]: notification
  }
});


export const markAsRead = ( id ) => ({
  type: actionTypes.markAsRead,
  payload: id
});


export const replaceNotification = ( replaceNotificationId, replacementNotification ) => ({
  type: actionTypes.replace,
  payload: {
    replaceId: replaceNotificationId,
    replacement: {
      [ replacementNotification.id ]: replacementNotification
    }
  }
});

export const notificationModalHide = () => ({
  type: actionTypes.hideNotificationModal
});

export const notificationModalShow = () => ({
  type: actionTypes.showNotificationModal
});
