import { ApiRequest } from 'Lib/ApiRequest';
import { MINIMIZE_TIP, RESTORE_TIP, TOGGLE_MINIMIZE_BAR } from 'AppConstants';
import { pathOr } from 'ramda';

const getProfileId = pathOr(null, [
  'relationships',
  'user_profile',
  'data',
  'id'
]);

export const minimizeTip = item => (dispatch, getState) => {
  const { appUser, minimizeBar: { collection } } = getState();
  const profileId = getProfileId(appUser.user);
  const minimized = collection.some(({ id }) => id === item.id)
    ? collection
    : [...collection, item];

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
            minimize_dock: minimized
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
    localStorage.setItem('minimize_dock', JSON.stringify(minimized));
  } catch (err) {
    console.error(err);
  }

  dispatch({
    type: MINIMIZE_TIP,
    payload: minimized
  });
};

export const restoreTip = id => (dispatch, getState) => {
  const { appUser, minimizeBar: { collection } } = getState();
  const profileId = getProfileId(appUser.user);
  const minimized = collection.filter(item => item.id !== id);

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
            minimize_dock: minimized
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
    localStorage.setItem('minimize_dock', JSON.stringify(minimized));
  } catch (err) {
    console.error(err);
  }

  dispatch({
    type: RESTORE_TIP,
    payload: minimized
  });
};

export const toggleMinimizeBar = () => dispatch =>
  dispatch({
    type: TOGGLE_MINIMIZE_BAR
  });
