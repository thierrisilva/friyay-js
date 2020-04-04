import {
  TOGGLE_TOPIC_OPTIONS,
  TOGGLE_HEX_GRID,
  GET_VIEWS,
  SET_ALL_TOPICS_VIEW,
  SELECT_VIEW,
  SELECT_TOPIC_VIEW
} from 'AppConstants';
import { ApiRequest } from 'Lib/ApiRequest';
import { VIEWS_ENUM as VIEWS } from 'Enums';
import { not, pathOr } from 'ramda';

const getProfileId = pathOr(null, [
  'relationships',
  'user_profile',
  'data',
  'id'
]);
const selectView = view => () => (dispatch, getState) => {
  const { appUser } = getState();
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
            tips_view: view
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
    localStorage.setItem('tips_view', JSON.stringify(view));
  } catch (err) {
    console.error(err);
  }

  dispatch({ type: SELECT_VIEW, payload: view });
};

const selectViewForTopic = view => topicId => (dispatch, getState) => {
  const { appUser, tipsView } = getState();
  const myViews = [
    ...tipsView.myTopics.filter(({ id }) => id !== topicId),
    { id: topicId, view }
  ];

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
            my_topics_view: myViews
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
    localStorage.setItem('my_topics_view', JSON.stringify(myViews));
  } catch (err) {
    console.error(err);
  }

  dispatch({ type: SELECT_TOPIC_VIEW, payload: myViews });
};

export const selectCardView = selectView(VIEWS.CARD);
export const selectGridView = selectView(VIEWS.GRID);
export const selectListView = selectView(VIEWS.LIST);
export const selectSmallGridView = selectView(VIEWS.SMALL_GRID);
export const selectTaskView = selectView(VIEWS.TASK);
export const selectDocumentsView = selectView(VIEWS.DOCUMENTS);

export const togglePanel = () => dispatch =>
  dispatch({ type: TOGGLE_TOPIC_OPTIONS });

export const toggleGrid = () => (dispatch, getState) => {
  const currState = getState().tipsView;
  const { appUser } = getState();
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
            hex_panel: not(currState.isHexGridVisible)
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
    localStorage.setItem('hex_panel', JSON.stringify(not(currState.isHexGridVisible)));
  } catch (err) {
    console.error(err);
  }

  dispatch({ type: TOGGLE_HEX_GRID });
};

export const selectCardViewForTopic = selectViewForTopic(VIEWS.CARD);
export const selectGridViewForTopic = selectViewForTopic(VIEWS.GRID);
export const selectSmallGridViewForTopic = selectViewForTopic(VIEWS.SMALL_GRID);
export const selectListViewForTopic = selectViewForTopic(VIEWS.LIST);
export const selectTaskViewForTopic = selectViewForTopic(VIEWS.TASK);



export const selectViewForAll = view => (dispatch, getState) => {
  const { appUser } = getState();
  const allTopics = {
    view: view,
    lastModified: new Date().valueOf()
  };

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
            all_topics_view: allTopics,
            my_topics_view: []
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
    localStorage.setItem('all_topics_view', JSON.stringify(allTopics));
    localStorage.removeItem('my_topics_view');
  } catch (err) {
    console.error(err);
  }

  dispatch({ type: SET_ALL_TOPICS_VIEW, payload: allTopics });
};

export const getViews = () => async dispatch => {
  try {
    const { data: { data } } = await ApiRequest.request({
      url: 'views'
    });

    dispatch({
      type: GET_VIEWS,
      payload: data
    });
  } catch (error) {
    if (__DEV__) {
      console.error(error);
    }
  }
};
