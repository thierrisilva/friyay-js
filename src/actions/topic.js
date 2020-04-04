import { CancelToken } from 'axios';
import { ApiRequest } from 'Lib/ApiRequest';
import getUrlParams from 'Utils/getUrlParams';
import uniqueId from 'lodash/uniqueId';
import {
  handleCancelRequest,
  handleAPICancelToken,
  handleAPICatch,
  handleCatch,
  handleFinally
} from './error';

import {
  buildGroupData,
  buildUserData,
  buildAdminRolesData,
  buildTopicData
} from '../utils/buildTipData';
import { success, failure, info } from 'Utils/toast';
import analytics from 'Lib/analytics';
import { VIEWS_ENUM } from 'Enums';

import {
  STAR_TOPIC_LEFT_MENU,
  GET_TOPIC_REQUEST,
  GET_TOPIC_SUCCESS,
  GET_TOPIC_FAILURE,
  GET_TOPIC_GROUP_REQUEST,
  GET_TOPIC_GROUP_SUCCESS,
  GET_TOPIC_GROUP_FAILURE,
  GET_TOPIC_SUBTOPICS_REQUEST,
  GET_TOPIC_SUBTOPICS_SUCCESS,
  GET_TOPIC_SUBTOPICS_FAILURE,
  STAR_TOPIC_FAILURE,
  UNSTAR_TOPIC_SUCCESS,
  UNSTAR_TOPIC_FAILURE,
  FOLLOW_TOPIC_SUCCESS,
  FOLLOW_TOPIC_FAILURE,
  UNFOLLOW_TOPIC_SUCCESS,
  UNFOLLOW_TOPIC_FAILURE,
  STAR_TOPIC_SUCCESS,
  UPDATE_TOPIC_SUBTOPIC_SUCCESS,
  UPDATE_TOPIC_SUBTOPIC_FAILURE,
  SAVE_TOPIC_SUBTOPIC_FAILURE,
  GET_TOPIC_TIPS_REQUEST,
  GET_TOPIC_TIPS_SUCCESS,
  GET_TOPIC_TIPS_FAILURE,
  GET_TOPIC_TIPS_WIKI_REQUEST,
  GET_TOPIC_TIPS_WIKI_SUCCESS,
  GET_TOPIC_TIPS_WIKI_FAILURE,
  GET_SUBTOPIC_TIPS_WIKI_SUCCESS,
  SAVE_TOPIC_REQUEST,
  SAVE_TOPIC_SUCCESS,
  SAVE_TOPIC_FAILURE,
  UPDATE_TOPIC_REQUEST,
  UPDATE_TOPIC_SUCCESS,
  UPDATE_TOPIC_FAILURE,
  DELETE_TOPIC_REQUEST,
  DELETE_TOPIC_SUCCESS,
  DELETE_TOPIC_FAILURE,
  STAR_TOPIC_TIP_SUCCESS,
  STAR_TOPIC_TIP_FAILURE,
  UNSTAR_TOPIC_TIP_SUCCESS,
  UNSTAR_TOPIC_TIP_FAILURE,
  LIKE_TOPIC_TIP_SUCCESS,
  LIKE_TOPIC_TIP_FAILURE,
  UNLIKE_TOPIC_TIP_SUCCESS,
  UNLIKE_TOPIC_TIP_FAILURE,
  CHANGE_TOPIC_TIP_ORDER_SUCCESS,
  CHANGE_TOPIC_TIP_ORDER_FAILURE,
  CHANGE_TOPIC_TIP_ORDER_WIKI_SUCCESS,
  CHANGE_TOPIC_TIP_ORDER_WIKI_FAILURE,
  ADD_TOPIC_TIP_SUCCESS,
  ADD_TOPIC_TIP_FAILURE,
  REMOVE_TOPIC_TIP_SUCCESS,
  REMOVE_TOPIC_TIP_FAILURE,
  ADD_TIP_FROM_TOPIC_SUCCESS,
  ADD_TIP_FROM_TOPIC_FAILURE,
  MOVE_TIP_FROM_TOPIC_SUCCESS,
  MOVE_TIP_FROM_TOPIC_FAILURE,
  UPDATE_TOPIC_VIEW_SUCCESS,
  UPDATE_TOPIC_VIEW_FAILURE,
  REORDER_TOPIC_TIP_SUCCESS,
  REORDER_TOPIC_TIP_FAILURE,
  DELETE_TOPIC_AND_MOVE_REQUEST,
  DELETE_TOPIC_AND_MOVE_SUCCESS,
  DELETE_TOPIC_AND_MOVE_FAILURE,
  MOVE_TOPIC_REQUEST,
  MOVE_TOPIC_SUCCESS,
  MOVE_TOPIC_FAILURE,
  DELETE_SUBTOPIC_REQUEST,
  DELETE_SUBTOPIC_SUCCESS,
  DELETE_SUBTOPIC_FAILURE,
  DELETE_SUBTOPIC_AND_MOVE_REQUEST,
  DELETE_SUBTOPIC_AND_MOVE_SUCCESS,
  DELETE_SUBTOPIC_AND_MOVE_FAILURE,
  CHANGE_TASK_TOPIC_TIP_ORDER_SUCCESS,
  REORDER_TASK_TOPIC_TIP_SUCCESS,
  ADD_TIP_FROM_TASK_TOPIC_SUCCESS,
  MOVE_TIP_FROM_TASK_TOPIC_SUCCESS,
  SAVE_TIP_IN_TASK_TOPIC_REQUEST,
  SAVE_TIP_IN_TASK_TOPIC_SUCCESS,
  SAVE_TIP_IN_TASK_TOPIC_FAILURE,
  SAVE_FIRST_TOPIC_REQUEST,
  SAVE_FIRST_TOPIC_SUCCESS,
  SAVE_FIRST_TOPIC_FAILURE,
  DELETE_TIP_IN_TASK_TOPIC_SUCCESS,
  DELETE_TIP_IN_TASK_TOPIC_FAILURE,
  ARCHIVE_TIP_IN_TASK_TOPIC_REQUEST,
  ARCHIVE_TIP_IN_TASK_TOPIC_SUCCESS,
  ARCHIVE_TIP_IN_TASK_TOPIC_FAILURE,
  CREATE_SUBTOPICS_WITH_TITLE_REQUEST,
  CREATE_SUBTOPICS_WITH_TITLE_SUCCESS,
  CREATE_SUBTOPICS_WITH_TITLE_FAILURE,
  CREATE_SUBTOPIC_IN_TASK_VIEW_REQUEST,
  CREATE_SUBTOPIC_IN_TASK_VIEW_SUCCESS,
  UPDATE_TOPIC_IN_TASK_VIEW_SUCCESS,
  UPDATE_SUBTOPIC_IN_TASK_VIEW_SUCCESS,
  SAVE_TOPIC_SUBTOPIC_SUCCESS,
  SAVE_TIP_SUCCESS,
  SET_SELECTED_TIP_FOR_WIKI_VIEW_SUCCESS,
  SET_SELECTED_TIP_FOR_WIKI_VIEW_FAILURE,
  SET_TIP_NESTED_TIPS_SUCCESS,
  SET_TIP_NESTED_TIPS_FAILURE,
  CHANGE_TIP_NESTED_TIPS_ORDER_SUCCESS,
  CHANGE_TIP_NESTED_TIPS_ORDER_FAILURE,
  SET_TOPIC_ACTIVE_VIEW_SUCCESS
} from 'AppConstants';

let getTopicCancel = null;
let topicCancelId = null;

export const getTopic = id => async dispatch => {
  let topic = null;
  if (getTopicCancel !== null) {
    getTopicCancel(`CANCEL_REQUEST ${topicCancelId}`);
    getTopicCancel = null;
    topicCancelId = null;
  }

  dispatch({ type: GET_TOPIC_REQUEST });

  try {
    const {
      data: { data }
    } = await ApiRequest.request({
      url: `topics/${id}`,
      cancelToken: new CancelToken(function executor(c) {
        getTopicCancel = c;
        topicCancelId = uniqueId();
      })
    }).catch(err => {
      // TODO: Detail full error if comes from server
      if (err.message.includes('CANCEL_REQUEST')) {
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
          console.group('CANCEL REQUEST');
          console.info('Request id', topicCancelId);
          console.info('Request url', `topics?${id}`);
          console.groupEnd('CANCEL REQUEST');
        }

        throw new Error('CANCEL_REQUEST');
      }
    });

    topic = data;
    dispatch({
      type: GET_TOPIC_SUCCESS,
      payload: topic
    });
  } catch (error) {
    if (error.message !== 'CANCEL_REQUEST') {
      console.error(error);

      dispatch({
        type: GET_TOPIC_FAILURE,
        payload: error
      });

      failure('Unable to load yay');
    }
  } finally {
    getTopicCancel = null;
    topicCancelId = null;
  }

  return topic;
};

export function getGroup(groupID) {
  return async dispatch => {
    handleCancelRequest();

    dispatch({
      type: GET_TOPIC_GROUP_REQUEST
    });

    try {
      const {
        data: { data }
      } = await ApiRequest.request({
        url: `groups/${groupID}`,
        cancelToken: new CancelToken(handleAPICancelToken)
      }).catch(handleAPICatch);

      dispatch({
        type: GET_TOPIC_GROUP_SUCCESS,
        payload: {
          group: data
        }
      });
    } catch (error) {
      handleCatch(error, dispatch, GET_TOPIC_GROUP_FAILURE, 'load team');
    } finally {
      handleFinally();
    }

    return true;
  };
}

export function getSubTopics(topicID, groupID) {
  return async dispatch => {
    handleCancelRequest();
    dispatch({
      type: GET_TOPIC_SUBTOPICS_REQUEST
    });

    try {
      const filter = {};
      if (groupID) {
        filter['within_group'] = groupID;
      }

      const options = {
        parent_id: topicID.split('-')[0],
        page: {
          size: 999
        },
        filter
      };

      const {
        data: { data }
      } = await ApiRequest.request({
        url: `topics?${getUrlParams(options)}`,
        cancelToken: new CancelToken(handleAPICancelToken)
      }).catch(handleAPICatch);
      dispatch({
        type: GET_TOPIC_SUBTOPICS_SUCCESS,
        payload: {
          subtopics: data
        }
      });
    } catch (error) {
      handleCatch(
        error,
        dispatch,
        GET_TOPIC_SUBTOPICS_FAILURE,
        'load subTopics'
      );
    } finally {
      handleFinally();
    }

    return true;
  };
}

export function starTopic(id) {
  return async dispatch => {
    try {
      dispatch({
        type: STAR_TOPIC_SUCCESS,
        payload: id
      });
      await ApiRequest.request({
        method: 'POST',
        url: `topics/${id}/star`
      });
      dispatch({
        type: STAR_TOPIC_LEFT_MENU,
        payload: id
      });
    } catch (error) {
      handleCatch(error, dispatch, STAR_TOPIC_FAILURE, 'star topic');
    }

    return true;
  };
}

export function unstarTopic(id) {
  return async dispatch => {
    try {
      dispatch({
        type: UNSTAR_TOPIC_SUCCESS,
        payload: id
      });
      await ApiRequest.request({
        method: 'POST',
        url: `topics/${id}/unstar`
      });
    } catch (error) {
      handleCatch(error, dispatch, UNSTAR_TOPIC_FAILURE, 'unstar topic');
    }

    return true;
  };
}

export function followTopic(topic, userId) {
  return async dispatch => {
    try {
      dispatch({
        type: FOLLOW_TOPIC_SUCCESS,
        payload: { topic, userId }
      });
      await ApiRequest.request({
        method: 'POST',
        url: `topics/${topic.id}/join`
      });
    } catch (error) {
      handleCatch(error, dispatch, FOLLOW_TOPIC_FAILURE, 'follow topic');
    }

    return true;
  };
}

export function unfollowTopic(topicId, userId) {
  return async dispatch => {
    try {
      dispatch({
        type: UNFOLLOW_TOPIC_SUCCESS,
        payload: { topicId, userId }
      });
      await ApiRequest.request({
        method: 'POST',
        url: `topics/${topicId}/leave`
      });
    } catch (error) {
      handleCatch(error, dispatch, UNFOLLOW_TOPIC_FAILURE, 'unfollow topic');
    }

    return true;
  };
}

export function saveTopic({
  title,
  description,
  sharingItemIDs,
  adminUserIDs,
  topicPermissionData
}) {
  return async dispatch => {
    handleCancelRequest();
    dispatch({
      type: SAVE_TOPIC_REQUEST,
      payload: {
        isTopicSaving: true
      }
    });
    try {
      const users = buildUserData(sharingItemIDs);
      const groups = buildGroupData(sharingItemIDs);
      const admins = buildAdminRolesData(adminUserIDs);

      const {
        data: { data }
      } = await ApiRequest.request({
        method: 'POST',
        url: 'topics',
        cancelToken: new CancelToken(handleAPICancelToken),
        data: {
          data: {
            type: 'topics',
            attributes: {
              title,
              description
            },
            relationships: {
              user_followers: users,
              group_followers: groups,
              roles: admins,
              topic_permission: topicPermissionData
            }
          }
        }
      }).catch(handleAPICatch);
      dispatch({
        type: SAVE_TOPIC_SUCCESS,
        payload: data
      });
      success('yay added');
    } catch (error) {
      handleCatch(error, dispatch, SAVE_TOPIC_FAILURE, 'save topic');
    } finally {
      handleFinally();
    }
  };
}

export function updateTopic(
  topicId,
  title,
  description,
  sharingItemIDs,
  adminUserIDs,
  topicPermissionData,
  isTaskView
) {
  return async dispatch => {
    handleCancelRequest();
    dispatch({
      type: UPDATE_TOPIC_REQUEST
    });
    try {
      const users = buildUserData(sharingItemIDs);
      const groups = buildGroupData(sharingItemIDs);
      const admins = buildAdminRolesData(adminUserIDs);

      const {
        data: { data: topic }
      } = await ApiRequest.request({
        method: 'PATCH',
        url: `topics/${topicId}`,
        data: {
          data: {
            type: 'topics',
            attributes: {
              title,
              description
            },
            relationships: {
              user_followers: users,
              group_followers: groups,
              roles: admins,
              topic_permission: topicPermissionData
            }
          }
        }
      }).catch(handleAPICatch);
      dispatch({
        type: isTaskView
          ? UPDATE_TOPIC_IN_TASK_VIEW_SUCCESS
          : UPDATE_TOPIC_SUCCESS,
        payload: {
          isTopicUpdating: false,
          topic
        }
      });
      success('yay updated');
    } catch (error) {
      handleCatch(error, dispatch, UPDATE_TOPIC_FAILURE, 'update topic');
    } finally {
      handleFinally();
    }
  };
}

export function deleteTopic(topicId, isSubtopic = false) {
  return async dispatch => {
    handleCancelRequest();

    const text = isSubtopic ? 'Deleting subtopic...' : 'Deleting topic...';
    const msg = info(text);

    dispatch({
      type: isSubtopic ? DELETE_SUBTOPIC_REQUEST : DELETE_TOPIC_REQUEST,
      payload: {
        topicId
      }
    });
    try {
      await ApiRequest.request({
        method: 'delete',
        url: `topics/${topicId}`
      }).catch(handleAPICatch);

      dispatch({
        type: isSubtopic ? DELETE_SUBTOPIC_SUCCESS : DELETE_TOPIC_SUCCESS,
        payload: { topicId }
      });

      msg.update({
        message: isSubtopic ? 'yay deleted' : 'yay deleted',
        type: 'success',
        showCloseButton: true
      });
    } catch (error) {
      if (error.message !== 'CANCEL_REQUEST') {
        console.error(error);

        dispatch({
          type: isSubtopic ? DELETE_TOPIC_FAILURE : DELETE_SUBTOPIC_FAILURE,
          payload: error
        });

        msg.update({
          message: isSubtopic ? 'Failed to delete yay' : 'Failed to delete yay',
          type: 'error',
          showCloseButton: true
        });
      }
    } finally {
      handleFinally();
    }
  };
}

export function deleteTopicAndMove(topicId, newTopicId, isSubtopic = false) {
  return async dispatch => {
    handleCancelRequest();

    const text = isSubtopic
      ? 'Deleting yay and moving content...'
      : 'Deleting yay and moving content...';
    const msg = info(text);

    dispatch({
      type: isSubtopic
        ? DELETE_SUBTOPIC_AND_MOVE_REQUEST
        : DELETE_TOPIC_AND_MOVE_REQUEST,
      payload: {
        topicId
      }
    });
    try {
      await ApiRequest.request({
        method: 'delete',
        url: `topics/${topicId}`,
        data: {
          data: {
            alternate_topic_id: newTopicId,
            move_tip_ids: 'all'
          }
        }
      }).catch(handleAPICatch);
      dispatch({
        type: isSubtopic
          ? DELETE_SUBTOPIC_AND_MOVE_SUCCESS
          : DELETE_TOPIC_AND_MOVE_SUCCESS,
        payload: {
          topicId
        }
      });

      msg.update({
        message: isSubtopic
          ? 'yay deleted and content moved'
          : 'yay deleted and content moved',
        type: 'success',
        showCloseButton: true
      });
    } catch (error) {
      if (error.message !== 'CANCEL_REQUEST') {
        console.error(error);

        dispatch({
          type: isSubtopic
            ? DELETE_SUBTOPIC_AND_MOVE_FAILURE
            : DELETE_TOPIC_AND_MOVE_FAILURE,
          payload: error
        });

        msg.update({
          message: isSubtopic ? 'Failed to delete yay' : 'Failed to delete yay',
          type: 'error',
          showCloseButton: true
        });
      }
    } finally {
      handleFinally();
    }
  };
}

export function moveTopic(topicID, newTopicID) {
  return async dispatch => {
    handleCancelRequest();
    dispatch({
      type: MOVE_TOPIC_REQUEST,
      payload: {
        isTopicDeletingAndMoving: true
      }
    });
    try {
      await ApiRequest.request({
        method: 'POST',
        url: `topics/${topicID}/move`,
        data: {
          data: {
            alternate_topic_id: newTopicID,
            move_tip_ids: 'all'
          }
        }
      }).catch(handleAPICatch);
      dispatch({
        type: MOVE_TOPIC_SUCCESS,
        payload: {
          isTopicDeletingAndMoving: false
        }
      });
      success('yay deleted and moved');
    } catch (error) {
      handleCatch(
        error,
        dispatch,
        MOVE_TOPIC_FAILURE,
        'delete topic and moved topic'
      );
    } finally {
      handleFinally();
    }
  };
}

export const saveTopicAndGoToTopicPage = saveData => async dispatch => {
  let added = false;
  handleCancelRequest();
  try {
    const {
      data: { data }
    } = await ApiRequest.request({
      method: 'POST',
      url: 'topics',
      cancelToken: new CancelToken(handleAPICancelToken),
      data: {
        data: {
          type: 'topics',
          ...saveData
        }
      }
    }).catch(handleAPICatch);

    dispatch({
      type: SAVE_TOPIC_SUBTOPIC_SUCCESS,
      payload: data
    });

    added = true;
  } catch (error) {
    handleCatch(error, dispatch, SAVE_TOPIC_SUBTOPIC_FAILURE, 'save topic');
  } finally {
    handleFinally();
  }

  return added;
};

export const updateSubTopicTitle = (
  topicId,
  title,
  isTaskView
) => async dispatch => {
  handleCancelRequest();
  try {
    dispatch({
      type: isTaskView
        ? UPDATE_SUBTOPIC_IN_TASK_VIEW_SUCCESS
        : UPDATE_TOPIC_SUBTOPIC_SUCCESS,
      payload: {
        topicId,
        title
      }
    });
    const {
      data: { data }
    } = await ApiRequest.request({
      method: 'PATCH',
      url: `topics/${topicId}`,
      cancelToken: new CancelToken(handleAPICancelToken),
      data: {
        data: {
          type: 'topics',
          attributes: {
            title
          }
        }
      }
    }).catch(handleAPICatch);
    return data;
  } catch (error) {
    handleCatch(error, dispatch, UPDATE_TOPIC_SUBTOPIC_FAILURE, 'save topic');
  } finally {
    handleFinally();
  }
};

export const loadTopicTips = options => async (dispatch, getState) => {
  handleCancelRequest();
  let topicId = options.topic_id || '';
  topicId = topicId.split('-')[0];
  try {
    const storedTips = getState().topic.subtopicsWithTips[topicId];
    if (storedTips && storedTips.tips) {
      const {
        data: { data: newTips }
      } = await ApiRequest.request({
        url: `tips?${getUrlParams(options)}`
      }).catch(handleAPICatch);

      const ids = storedTips.tips.map(tip => tip.id).join('.');
      const newIds = newTips.map(tip => tip.id).join('.');

      if (ids !== newIds) {
        dispatch({
          type: GET_TOPIC_TIPS_SUCCESS,
          payload: {
            tips: newTips,
            topicId
          }
        });
      }
    } else {
      dispatch({
        type: GET_TOPIC_TIPS_REQUEST,
        payload: {
          topicId
        }
      });

      const {
        data: { data: newTips }
      } = await ApiRequest.request({
        url: `tips?${getUrlParams(options)}`
      }).catch(handleAPICatch);

      dispatch({
        type: GET_TOPIC_TIPS_SUCCESS,
        payload: {
          tips: newTips,
          topicId
        }
      });
    }
  } catch (error) {
    handleCatch(error, dispatch, GET_TOPIC_TIPS_FAILURE, 'load topic cards');
  }
};

export function starTopicTip(tipId, topicId) {
  return async dispatch => {
    try {
      dispatch({
        type: STAR_TOPIC_TIP_SUCCESS,
        payload: { tipId, topicId }
      });

      await ApiRequest.request({
        method: 'POST',
        url: `tips/${tipId}/star`
      });
    } catch (error) {
      dispatch({
        type: STAR_TOPIC_TIP_FAILURE,
        payload: error
      });

      failure('Unable to star card');
    }

    return true;
  };
}

export function unstarTopicTip(tipId, topicId) {
  return async dispatch => {
    try {
      dispatch({
        type: UNSTAR_TOPIC_TIP_SUCCESS,
        payload: { tipId, topicId }
      });

      await ApiRequest.request({
        method: 'POST',
        url: `tips/${tipId}/unstar`
      });
    } catch (error) {
      dispatch({
        type: UNSTAR_TOPIC_TIP_FAILURE,
        payload: error
      });

      failure('Unable to unstar card');
    }

    return true;
  };
}

export function likeTopicTip(tipId, topicId) {
  return async dispatch => {
    try {
      dispatch({
        type: LIKE_TOPIC_TIP_SUCCESS,
        payload: { tipId, topicId }
      });

      await ApiRequest.request({
        method: 'POST',
        url: `tips/${tipId}/like`
      });
    } catch (error) {
      dispatch({
        type: LIKE_TOPIC_TIP_FAILURE,
        payload: error
      });

      failure('Unable to like card');
    }

    return true;
  };
}

export function unlikeTopicTip(tipId, topicId) {
  return async dispatch => {
    try {
      dispatch({
        type: UNLIKE_TOPIC_TIP_SUCCESS,
        payload: { tipId, topicId }
      });

      await ApiRequest.request({
        method: 'POST',
        url: `tips/${tipId}/unlike`
      });
    } catch (error) {
      dispatch({
        type: UNLIKE_TOPIC_TIP_FAILURE,
        payload: error
      });

      failure('Unable to unlike card');
    }

    return true;
  };
}

export function changeTopicTipOrder(query, toTopic, isTaskView) {
  return async dispatch => {
    try {
      dispatch({
        type: isTaskView
          ? CHANGE_TASK_TOPIC_TIP_ORDER_SUCCESS
          : CHANGE_TOPIC_TIP_ORDER_SUCCESS,
        payload: { query, toTopic }
      });
    } catch (error) {
      dispatch({
        type: CHANGE_TOPIC_TIP_ORDER_FAILURE,
        payload: error
      });
    }
  };
}

export function addTopicTip(topicId, tip) {
  topicId = topicId.split('-')[0];
  return async dispatch => {
    try {
      dispatch({
        type: ADD_TOPIC_TIP_SUCCESS,
        payload: { topicId, tip }
      });
    } catch (error) {
      dispatch({
        type: ADD_TOPIC_TIP_FAILURE,
        payload: error
      });
    }
  };
}

export function removeTopicTip(topicId, tip) {
  return async dispatch => {
    try {
      dispatch({
        type: REMOVE_TOPIC_TIP_SUCCESS,
        payload: { topicId, tip }
      });
    } catch (error) {
      console.error('error', error);
      dispatch({
        type: REMOVE_TOPIC_TIP_FAILURE,
        payload: error
      });
    }
  };
}

export function addTipIntoTopic(tip, fromTopic, toTopic, isTaskView) {
  return async dispatch => {
    try {
      const {
        data: { data }
      } = await ApiRequest.request({
        method: 'POST',
        url: `tips/${tip.id}/topic_assignments`,
        data: {
          data: {
            topic_id: toTopic.id
          }
        }
      }).catch(handleAPICatch);

      dispatch({
        type: isTaskView
          ? ADD_TIP_FROM_TASK_TOPIC_SUCCESS
          : ADD_TIP_FROM_TOPIC_SUCCESS,
        payload: { tip: data, fromTopic, toTopic }
      });

      success(`Card has been added to ${toTopic.attributes.title}`);
    } catch (error) {
      console.error('error', error);
      handleCatch(
        error,
        dispatch,
        ADD_TIP_FROM_TOPIC_FAILURE,
        `add card into ${toTopic.attributes.title}`
      );
    }
  };
}

export function moveTipFromTopic(tip, fromTopic, toTopic, isTaskView) {
  return async dispatch => {
    try {
      const options = {
        from_topic: fromTopic.id,
        to_topic: toTopic.id
      };

      const {
        data: { data }
      } = await ApiRequest.request({
        method: 'POST',
        url: `tips/${tip.id}/topic_assignments/move`,
        data: {
          data: options
        }
      }).catch(handleAPICatch);

      dispatch({
        type: isTaskView
          ? MOVE_TIP_FROM_TASK_TOPIC_SUCCESS
          : MOVE_TIP_FROM_TOPIC_SUCCESS,
        payload: { tip: data, fromTopic, toTopic }
      });
      success(`Card has been moved to ${toTopic.attributes.title}`);
    } catch (error) {
      handleCatch(
        error,
        dispatch,
        MOVE_TIP_FROM_TOPIC_FAILURE,
        `move card into ${toTopic.attributes.title}`
      );
    }
  };
}

export const updateTopicView = (topicId, viewId) => async dispatch => {
  try {
    dispatch({
      type: UPDATE_TOPIC_VIEW_SUCCESS,
      payload: viewId
    });
    await ApiRequest.request({
      method: 'PATCH',
      url: `topics/${topicId}`,
      data: {
        data: {
          type: 'topics',
          attributes: {
            default_view_id: viewId
          }
        }
      }
    }).catch(handleAPICatch);
  } catch (error) {
    handleCatch(error, dispatch, UPDATE_TOPIC_VIEW_FAILURE);
  }
};

export function reorderTopicTip(
  tip,
  dragIndex,
  precedingTipsIDs,
  toTopic,
  fromTopic,
  isTaskView,
  parentTip
) {
  return async dispatch => {
    try {
      dispatch({
        type: isTaskView
          ? REORDER_TASK_TOPIC_TIP_SUCCESS
          : REORDER_TOPIC_TIP_SUCCESS,
        payload: { tip, dragIndex, toTopic, fromTopic }
      });

      await ApiRequest.request({
        method: 'POST',
        url: `tips/${tip.id}/reorder`,
        data: {
          data: {
            topic_id: toTopic.id,
            preceding_tips: precedingTipsIDs,
            parent_tip: parentTip
          }
        }
      }).catch(handleAPICatch);

      success('Card position changed');
    } catch (error) {
      handleCatch(
        error,
        dispatch,
        REORDER_TOPIC_TIP_FAILURE,
        'change card position'
      );
    }
  };
}

export function saveTipInTaskTopic(title, topicId) {
  return async dispatch => {
    let tip = null;
    handleCancelRequest();
    dispatch({
      type: SAVE_TIP_IN_TASK_TOPIC_REQUEST
    });

    try {
      const params = {
        data: {
          type: 'tips',
          attributes: {
            title,
            body: ''
          },
          relationships: {
            subtopics: buildTopicData([topicId])
          }
        }
      };

      const {
        data: { data }
      } = await ApiRequest.request({
        method: 'POST',
        data: params,
        url: 'tips'
      }).catch(handleAPICatch);

      tip = data;

      dispatch({
        type: SAVE_TIP_IN_TASK_TOPIC_SUCCESS,
        payload: { tip, topicId }
      });

      dispatch({
        type: SAVE_TIP_SUCCESS,
        payload: tip
      });

      success('Card added');

      analytics.track('Card Created', {
        id: data.id,
        title: data.attributes.title,
        topic_ids: data.relationships.topics.data.map(topic => topic.id),
        topic_titles: data.relationships.topics.data.map(topic => topic.title)
      });
    } catch (error) {
      handleCatch(error, dispatch, SAVE_TIP_IN_TASK_TOPIC_FAILURE, 'add card');
    }

    return tip;
  };
}
export const setTopicActiveView = view => dispatch =>
  dispatch({
    type: SET_TOPIC_ACTIVE_VIEW_SUCCESS,
    payload: { view }
  });

let isSavingFirstTopic = false;

export const createFirstTopic = title => async dispatch => {
  let reRouteUrl = null;

  if (isSavingFirstTopic) {
    return false;
  }

  isSavingFirstTopic = true;

  dispatch({
    type: SAVE_FIRST_TOPIC_REQUEST
  });

  try {
    const {
      data: { data }
    } = await ApiRequest.request({
      method: 'POST',
      data: {
        data: {
          join_if_existed: true,
          type: 'topics',
          attributes: { title }
        }
      },
      url: 'topics'
    }).catch(err => {
      console.error(err);
      if (err.response.status === 401) {
        reRouteUrl = err.response.errors.details.resource_slug;
      }
    });

    reRouteUrl = data.attributes.slug;

    analytics.track('Topic Created', {
      id: data.id,
      title: data.attributes.title
    });

    dispatch({
      type: SAVE_FIRST_TOPIC_SUCCESS,
      payload: data
    });

    success('yay created');
  } catch (error) {
    console.error(error);
    dispatch({
      type: SAVE_FIRST_TOPIC_FAILURE,
      payload: [error.message]
    });
  } finally {
    isSavingFirstTopic = false;
  }

  return reRouteUrl;
};
export function deleteTipInTaskTopic(tipId, topicId, view) {
  return async dispatch => {
    handleCancelRequest();
    dispatch({
      type: DELETE_TIP_IN_TASK_TOPIC_SUCCESS,
      payload: { tipId, topicId, view }
    });
    try {
      await ApiRequest.request({
        method: 'DELETE',
        url: `tips/${tipId}`
      });
      success('Card deleted successfully');
    } catch (error) {
      handleCatch(
        error,
        dispatch,
        DELETE_TIP_IN_TASK_TOPIC_FAILURE,
        'delete card'
      );
    }
  };
}

export const archiveTipInTaskTopic = (
  tipId,
  topicId,
  view
) => async dispatch => {
  let msg = info('Archiving card...');
  try {
    if (view !== VIEWS_ENUM.WIKI) {
      dispatch({
        type: ARCHIVE_TIP_IN_TASK_TOPIC_REQUEST,
        payload: { tipId, topicId }
      });
    }
    const {
      data: { data: tip }
    } = await ApiRequest.request({
      method: 'POST',
      url: `tips/${tipId}/archive`
    });

    dispatch({
      type: ARCHIVE_TIP_IN_TASK_TOPIC_SUCCESS,
      payload: { tip, topicId, view }
    });

    msg.update({
      message: 'Card archived successfully',
      type: 'success',
      showCloseButton: true
    });
  } catch (error) {
    handleCatch(
      error,
      dispatch,
      ARCHIVE_TIP_IN_TASK_TOPIC_FAILURE,
      'archive card'
    );
  }

  return true;
};

export const createSubTopicsWithTitle = (
  title,
  parentId,
  view
) => async dispatch => {
  handleCancelRequest();
  dispatch({
    type:
      view === VIEWS_ENUM.TASK || view === VIEWS_ENUM.WIKI
        ? CREATE_SUBTOPIC_IN_TASK_VIEW_REQUEST
        : CREATE_SUBTOPICS_WITH_TITLE_REQUEST
  });
  try {
    const {
      data: { data: subtopic }
    } = await ApiRequest.request({
      method: 'POST',
      url: 'topics',
      cancelToken: new CancelToken(handleAPICancelToken),
      data: {
        data: {
          type: 'topics',
          attributes: { title, parent_id: parentId }
        }
      }
    }).catch(handleAPICatch);
    if (view === VIEWS_ENUM.TASK) {
      dispatch({
        type: CREATE_SUBTOPIC_IN_TASK_VIEW_SUCCESS,
        payload: {
          subtopic
        }
      });
    } else if (view === VIEWS_ENUM.WIKI) {
      dispatch({
        type: CREATE_SUBTOPICS_WITH_TITLE_SUCCESS,
        payload: {
          subtopic
        }
      });
    }
  } catch (error) {
    handleCatch(
      error,
      dispatch,
      CREATE_SUBTOPICS_WITH_TITLE_FAILURE,
      'create subtopic'
    );
  } finally {
    handleFinally();
  }
};

export function getSetTopicTipsViewSettingsStore(value) {
  if (value) {
    localStorage.setItem('TopicTipsView', JSON.stringify(value));
  } else {
    const topicTipsView = JSON.parse(
      localStorage.getItem('TopicTipsView') || '{}'
    );
    topicTipsView['topics'] = topicTipsView['topics'] || {};
    return topicTipsView;
  }
}

export function selectTipForWikiView(tip) {
  return dispatch => {
    try {
      dispatch({
        type: SET_SELECTED_TIP_FOR_WIKI_VIEW_SUCCESS,
        payload: { tip }
      });
    } catch (error) {
      dispatch({
        type: SET_SELECTED_TIP_FOR_WIKI_VIEW_FAILURE,
        payload: { error }
      });
    }
  };
}

export function setTipNestedTips(tipId, tips) {
  return dispatch => {
    try {
      dispatch({
        type: SET_TIP_NESTED_TIPS_SUCCESS,
        payload: { tipId, tips }
      });
    } catch (error) {
      dispatch({
        type: SET_TIP_NESTED_TIPS_FAILURE,
        payload: { error }
      });
    }
  };
}

export function changeTipNestedTipsOrder(query, tipId) {
  return async dispatch => {
    try {
      dispatch({
        type: CHANGE_TIP_NESTED_TIPS_ORDER_SUCCESS,
        payload: { query, tipId }
      });
    } catch (error) {
      dispatch({
        type: CHANGE_TIP_NESTED_TIPS_ORDER_FAILURE,
        payload: error
      });
    }
  };
}

export function loadTopicTipsForWiki(options, topic, isSubtopic) {
  return async (dispatch, getState) => {
    handleCancelRequest();
    let topicId = options.topic_id || '';
    topicId = topicId.split('-')[0];
    dispatch({
      type: GET_TOPIC_TIPS_WIKI_REQUEST,
      payload: {
        topicId,
        isSubtopic
      }
    });
    try {
      let tips;
      const {
        data: { data: newTips }
      } = await ApiRequest.request({
        url: `tips?${getUrlParams(options)}`
      }).catch(handleAPICatch);
      dispatch({
        type: isSubtopic
          ? GET_SUBTOPIC_TIPS_WIKI_SUCCESS
          : GET_TOPIC_TIPS_WIKI_SUCCESS,
        payload: {
          tips: newTips,
          topicId,
          topic: topic
        }
      });
    } catch (error) {
      handleCatch(
        error,
        dispatch,
        GET_TOPIC_TIPS_WIKI_FAILURE,
        'load topic cards'
      );
    }
  };
}

export function changeTopicTipOrderWiki(treeData) {
  return async dispatch => {
    try {
      dispatch({
        type: CHANGE_TOPIC_TIP_ORDER_WIKI_SUCCESS,
        payload: {
          treeData
        }
      });
    } catch (error) {
      dispatch({
        type: CHANGE_TOPIC_TIP_ORDER_WIKI_FAILURE,
        payload: error
      });
    }
  };
}
