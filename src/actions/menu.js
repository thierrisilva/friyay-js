import { CancelToken } from 'axios';
import {
  LEFT_MENU_SET_USER_FILTER,
  LEFT_MENU_SET_TOPIC_FILTER,
  LEFT_MENU_TOGGLE,
  LEFT_MENU_GET_USERS_REQUEST,
  LEFT_MENU_GET_USERS_SUCCESS,
  LEFT_MENU_GET_USERS_FAILURE,
  LEFT_MENU_GET_TOPICS_REQUEST,
  LEFT_MENU_GET_TOPICS_SUCCESS,
  LEFT_MENU_GET_TOPICS_FAILURE,
  LEFT_MENU_GET_SUBTOPICS_REQUEST,
  LEFT_MENU_GET_SUBTOPICS_SUCCESS,
  SAVE_TOPIC_REQUEST,
  SAVE_TOPIC_SUCCESS,
  SAVE_TOPIC_FAILURE,
  TOGGLE_LEFT_MENU_PEOPLE_PANEL
} from 'AppConstants';
import tiphive from 'Lib/tiphive';
import { merge, not, pathOr } from 'ramda';
import getUrlParams from 'Utils/getUrlParams';
import { ApiRequest } from 'Lib/ApiRequest';
import { failure } from 'Utils/toast';
import uniqueId from 'lodash/uniqueId';
import { MENU_FILTER as FILTER } from 'Enums';

const getProfileId = pathOr(null, [
  'relationships',
  'user_profile',
  'data',
  'id'
]);

const defaultUsersOptions = merge({
  filter: {
    users: FILTER.ALL,
    is_active: true
  },
  page: {
    size: 999
  }
});

const defaultTopicsOptions = merge({
  page: {
    size: 999
  }
});

export const getUsers = options => async dispatch => {
  dispatch({
    type: LEFT_MENU_GET_USERS_REQUEST
  });

  try {
    const {
      data: { data }
    } = await ApiRequest.request({
      url: `users?${getUrlParams(defaultUsersOptions(options))}`
    });

    dispatch({
      type: LEFT_MENU_GET_USERS_SUCCESS,
      payload: data
    });
  } catch (error) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.error(error);
    }

    dispatch({
      type: LEFT_MENU_GET_USERS_FAILURE,
      payload: error
    });

    failure('Unable to load users');
  }

  return true;
};

let getTopicsCancel = null;
let topicsCancelId = null;
let getSubtopicsCancel = null;
let subtopicsCancelId = null;

export const getTopics = (options, isSubTopics) => async dispatch => {
  if (isSubTopics) {
    if (getSubtopicsCancel !== null) {
      getSubtopicsCancel(`CANCEL_REQUEST ${subtopicsCancelId}`);
      getSubtopicsCancel = null;
      subtopicsCancelId = null;
    }
  } else {
    if (getTopicsCancel !== null) {
      getTopicsCancel(`CANCEL_REQUEST ${topicsCancelId}`);
      getTopicsCancel = null;
      topicsCancelId = null;
    }
  }

  dispatch({
    type: isSubTopics
      ? LEFT_MENU_GET_SUBTOPICS_REQUEST
      : LEFT_MENU_GET_TOPICS_REQUEST
  });

  try {
    const {
      data: { data }
    } = await ApiRequest.request({
      url: `topics?${getUrlParams(defaultTopicsOptions(options))}`,
      cancelToken: new CancelToken(function executor(c) {
        if (isSubTopics) {
          getSubtopicsCancel = c;
          subtopicsCancelId = uniqueId();
        } else {
          getTopicsCancel = c;
          topicsCancelId = uniqueId();
        }
      })
    }).catch(err => {
      // TODO: Detail full error if comes from server
      if (err.message.includes('CANCEL_REQUEST')) {
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
          if (topicsCancelId !== null) {
            console.group('CANCEL REQUEST');
            console.info('Request id', topicsCancelId);
            console.info(
              'Request url',
              `topics?${getUrlParams(defaultTopicsOptions(options))}`
            );
            console.groupEnd('CANCEL REQUEST');
          }

          if (subtopicsCancelId !== null) {
            console.group('CANCEL REQUEST');
            console.info('Request id', subtopicsCancelId);
            console.info(
              'Request url',
              `topics?${getUrlParams(defaultTopicsOptions(options))}`
            );
            console.groupEnd('CANCEL REQUEST');
          }
        }

        throw new Error('CANCEL_REQUEST');
      }
    });

    dispatch({
      type: isSubTopics
        ? LEFT_MENU_GET_SUBTOPICS_SUCCESS
        : LEFT_MENU_GET_TOPICS_SUCCESS,
      payload: data
    });
  } catch (error) {
    if (error.message !== 'CANCEL_REQUEST') {
      console.error(error);

      dispatch({
        type: LEFT_MENU_GET_TOPICS_FAILURE,
        payload: error
      });

      failure('Unable to load yays');
    }
  } finally {
    getTopicsCancel = null;
    topicsCancelId = null;
    getSubtopicsCancel = null;
    subtopicsCancelId = null;
  }

  return true;
};

export const toggleMenu = () => (dispatch, getState) => {
  const {
    appUser,
    menu: { isOpen }
  } = getState();
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
            left_menu_open: not(isOpen)
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
    localStorage.setItem('left_menu_open', JSON.stringify(not(isOpen)));
  } catch (err) {
    console.error(err);
  }

  dispatch({ type: LEFT_MENU_TOGGLE });
};

export const togglePeoplePanel = () => (dispatch, getState) => {
  const {
    appUser,
    menu: { isUsersPanelCollapsed }
  } = getState();
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
            left_menu_people_panel: not(isUsersPanelCollapsed)
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
    localStorage.setItem(
      'left_menu_people_panel',
      JSON.stringify(not(isUsersPanelCollapsed))
    );
  } catch (err) {
    console.error(err);
  }

  dispatch({ type: TOGGLE_LEFT_MENU_PEOPLE_PANEL });
};

export const setPeopleFilter = activeFilter => (dispatch, getState) => {
  const { appUser } = getState();
  const profileId = getProfileId(appUser.user);

  if (tiphive.isPublicDomain() && activeFilter === FILTER.ALL) {
    activeFilter = FILTER.FOLLOWING;
  }

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
            left_menu_people_filter: activeFilter
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
    localStorage.setItem('left_menu_people_filter', activeFilter);
  } catch (err) {
    console.error(err);
  }

  dispatch({
    type: LEFT_MENU_SET_USER_FILTER,
    payload: activeFilter
  });
};

export const setTopicsFilter = activeFilter => (dispatch, getState) => {
  const { appUser } = getState();
  const profileId = getProfileId(appUser.user);

  if (tiphive.isPublicDomain() && activeFilter === FILTER.ALL) {
    activeFilter = FILTER.FOLLOWING;
  }

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
            left_menu_topics_filter: activeFilter
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
    localStorage.setItem('left_menu_topics_filter', activeFilter);
  } catch (err) {
    console.error(err);
  }

  dispatch({
    type: LEFT_MENU_SET_TOPIC_FILTER,
    payload: activeFilter
  });
};

export const saveTopic = (title, groupId = null) => async dispatch => {
  dispatch({
    type: SAVE_TOPIC_REQUEST
  });

  let reRouteUrl = null;

  let groupFollowers = {};

  if (groupId !== null) {
    groupFollowers = {
      data: [
        {
          id: groupId,
          type: 'groups'
        }
      ]
    };
  }

  const params = {
    data: {
      type: 'topics',
      attributes: { title },
      relationships: {
        group_followers: groupFollowers
      }
    }
  };

  try {
    const {
      data: { data }
    } = await ApiRequest.request({
      method: 'POST',
      url: 'topics',
      data: params
    });

    reRouteUrl = data.attributes.slug;

    dispatch({
      type: SAVE_TOPIC_SUCCESS,
      payload: data
    });
  } catch (error) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.error(error);
    }

    dispatch({
      type: SAVE_TOPIC_FAILURE,
      payload: error
    });

    failure('Could not save yay');
  }

  return reRouteUrl;
};

export const saveSubtopic = (title, parentId, groupId = null) => async () => {
  let reRouteUrl = null;

  let groupFollowers = {};

  if (groupId !== null) {
    groupFollowers = {
      data: [
        {
          id: groupId,
          type: 'groups'
        }
      ]
    };
  }

  const params = {
    data: {
      type: 'topics',
      attributes: { title, parent_id: parentId },
      relationships: {
        group_followers: groupFollowers
      }
    }
  };

  try {
    const {
      data: { data }
    } = await ApiRequest.request({
      method: 'POST',
      url: 'topics',
      data: params
    });

    reRouteUrl = data.attributes.slug;
  } catch (error) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.error(error);
    }

    failure('Could not save yay');
  }

  return reRouteUrl;
};
