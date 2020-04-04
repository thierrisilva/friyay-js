import { normalizeNotification, normalizeNotifications } from './schema';
import { addNotifications, changeNotification, markAsRead, notificationModalHide, notificationModalShow } from './actions';
import { setLiveNotification } from 'Src/newRedux/bot/actions';
import { success, failure } from 'Utils/toast';
import api from './apiCalls';

export const getNotifications = () => async(dispatch, getState) => {

  try {
    const notificationsData = await api.fetchNotifications();

    dispatch( addNotifications( normalizeNotifications( notificationsData ).notifications ) );
    return notificationsData;

  } catch (error) {
    failure('Unable to load notifications');
    return null;
  }
};

export const pushNotification = (userId = null, notification = null) =>
  async dispatch => {

    if (notification.live_notification) {
      return dispatch(setLiveNotification(notification));
    }

    if (userId && notification && notification.data) {
      const { data: { relationships } } = notification;
      const { user: { data: { id } } } = relationships;

      if (
        (!relationships || !relationships.user || !relationships.user.data)
        || userId.toString() !== id.toString()
      ) return false;
      dispatch(addNotifications({ [notification.data.id]: notification.data }));
    }
  };

export const markNotificationsAsRead = ({ id }) => async(dispatch, getState) => {
  try {
    dispatch( markAsRead( id ) )
    await api.markNotificationAsRead( id );

  } catch (error) {
    failure('There was a problem');
    return null;
  }
}

export const hideNotificationModal = () => {
  return (dispatch, getState) => {
    dispatch(notificationModalHide());
  }
}

export const showNotificationModal = () => {
  return (dispatch, getState) => {
    dispatch(notificationModalShow());
  }
}
