import { CancelToken } from 'axios';
import { ApiRequest } from 'Lib/ApiRequest';
import { merge } from 'ramda';
import getUrlParams from '../utils/getUrlParams';
import { success, failure, info } from 'Utils/toast';
import analytics from '../lib/analytics';
import uniqueId from 'lodash/uniqueId';
import { VIEWS_ENUM } from 'Enums';
import {
  buildAttachmentsData,
  buildGroupData,
  buildLabelData,
  buildTopicData,
  buildUserData
} from '../utils/buildTipData';

import {
  GET_TIPS_FAILURE,
  GET_TIPS_REQUEST,
  GET_TIPS_REQUEST_ROOT,
  GET_TIPS_SUCCESS,
  GET_TIP_BY_SLUG_FAILURE,
  GET_TIP_BY_SLUG_REQUEST,
  GET_TIP_BY_SLUG_SUCCESS,
  REMOVE_TIP_FAILURE,
  REMOVE_TIP_SUCCESS,
  STAR_TIP_FAILURE,
  STAR_TIP_SUCCESS,
  UNSTAR_TIP_FAILURE,
  UNSTAR_TIP_SUCCESS,
  LIKE_TIP_FAILURE,
  LIKE_TIP_SUCCESS,
  UNLIKE_TIP_FAILURE,
  UNLIKE_TIP_SUCCESS,
  SAVE_TIP_FAILURE,
  SAVE_TIP_REQUEST,
  SAVE_TIP_SUCCESS,
  UPDATE_TIP_FAILURE,
  UPDATE_TIP_REQUEST,
  UPDATE_TIP_SUCCESS,
  ARCHIVE_TIP_REQUEST,
  ARCHIVE_TIP_SUCCESS,
  ARCHIVE_TIP_FAILURE,
  GET_TIPS_BY_USER_ID_REQUEST,
  GET_TIPS_BY_USER_ID_SUCCESS,
  GET_TIPS_BY_USER_ID_FAILURE,
  UPDATE_TIP_IN_TASK_TOPIC_SUCCESS,
  REMOVE_ATTACHMENT_FROM_TIP,
  FLUSH_TIP,
  TIP_CONNECTIONS_SUCCESS,
  TIP_CONNECTIONS_FAILURE,
  SAVE_TIP_IN_TOPIC_SUCCESS,
  UPDATE_TIP_IN_TOPIC_SUCCESS,
  COMPLETE_CARD_FAILURE,
  COMPLETE_CARD_REQUEST,
  COMPLETE_CARD_SUCCESS,
  RENAME_CARD_FAILURE,
  RENAME_CARD_SUCCESS,
  RENAME_CARD_REQUEST,
  UPDATE_CARD_DATES_FAILURE,
  UPDATE_CARD_DATES_REQUEST,
  UPDATE_CARD_DATES_SUCCESS
} from 'AppConstants';

let getTipsCancel = null;
let tipsCancelId = null;

let getTipsByUserIdCancel = null;
let tipsByUserIdCancelId = null;

let getTipBySlugCancel = null;
let prevTopic = null;

const defaultOptions = merge({
  page: {
    number: 1,
    size: 25
  }
});


const subtopicRequest = (subtopic) => {
  if(prevTopic && prevTopic !== subtopic){
    return true;
  }
  else if(prevTopic === subtopic || prevTopic == null){
    prevTopic = subtopic;
    return false;
  }
}


export const getTips = (options, flush = false) => async (dispatch, getState) => {
  let callComplete = null;
  const params = defaultOptions(options);
  const { location } = getState();

  if (getTipsCancel !== null) {
    getTipsCancel(`CANCEL_REQUEST ${tipsCancelId}`);
    getTipsCancel = null;
    tipsCancelId = null;
  }

  dispatch({
    type: GET_TIPS_REQUEST,
    payload: flush
  });

  
  if(options.topic_id){
    if(subtopicRequest(options.topic_id)){
      params.page.number = 1;
    }
  }
    
  if(location.current){
    if(location.current.pathname === '/' && params.page.number === 1){
      dispatch({ 
        type: GET_TIPS_REQUEST_ROOT,
        payload: flush
      });
    }
  }

  try {
    const { data: { data, meta } } = await ApiRequest.request({
      url: `tips?${getUrlParams(params)}`,
      cancelToken: new CancelToken(function executor(c) {
        getTipsCancel = c;
        tipsCancelId = uniqueId();
      })
    }).catch(err => {
      // TODO: Detail full error if comes from server
      if (err.message.includes('CANCEL_REQUEST')) {
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
          console.group('CANCEL REQUEST');
          console.info('Request id', tipsCancelId);
          console.info(
            'Request url',
            `tips?${getUrlParams(defaultOptions(options))}`
          );
          console.groupEnd('CANCEL REQUEST');
        }

        throw new Error('CANCEL_REQUEST');
      }
    });

    dispatch({
      type: GET_TIPS_SUCCESS,
      payload: {
        tips: data,
        currentPage: meta.current_page,
        totalPages: meta.total_pages,
        totalCount: meta.total_count
      }
    });

    callComplete = true;
  } catch (error) {
    if (error.message !== 'CANCEL_REQUEST') {
      console.error(error);

      dispatch({
        type: GET_TIPS_FAILURE,
        payload: error
      });

      failure('Unable to load cards');
    }

    callComplete = false;
  } finally {
    getTipsCancel = null;
    tipsCancelId = null;
  }

  return callComplete;
};

export const getTipsByUserId = options => async dispatch => {
  let callComplete = null;
  const params = defaultOptions(options);

  if (getTipsByUserIdCancel !== null) {
    getTipsByUserIdCancel(`CANCEL_REQUEST ${tipsByUserIdCancelId}`);
    getTipsByUserIdCancel = null;
    tipsByUserIdCancelId = null;
  }

  dispatch({
    type: GET_TIPS_BY_USER_ID_REQUEST,
    payload: params.page.number
  });

  try {
    const { data: { data, meta } } = await ApiRequest.request({
      url: `tips?${getUrlParams(params)}`,
      cancelToken: new CancelToken(function executor(c) {
        getTipsByUserIdCancel = c;
        tipsByUserIdCancelId = uniqueId();
      })
    }).catch(err => {
      // TODO: Detail full error if comes from server
      if (err.message.includes('CANCEL_REQUEST')) {
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
          console.group('CANCEL REQUEST');
          console.info('Request id', tipsByUserIdCancelId);
          console.info(
            'Request url',
            `tips?${getUrlParams(defaultOptions(options))}`
          );
          console.groupEnd('CANCEL REQUEST');
        }

        throw new Error('CANCEL_REQUEST');
      }
    });

    dispatch({
      type: GET_TIPS_BY_USER_ID_SUCCESS,
      payload: {
        tips: data,
        currentPage: meta.current_page,
        totalPages: meta.total_pages,
        totalCount: meta.total_count
      }
    });

    callComplete = true;
  } catch (error) {
    if (error.message !== 'CANCEL_REQUEST') {
      console.error(error);

      dispatch({
        type: GET_TIPS_BY_USER_ID_FAILURE,
        payload: error
      });

      failure('Unable to load user cards');
    }

    callComplete = false;
  } finally {
    getTipsByUserIdCancel = null;
    tipsByUserIdCancelId = null;
  }

  return callComplete;
};

export const getTipBySlug = slug => async dispatch => {
  let tip = null;

  if (getTipBySlugCancel !== null) {
    getTipBySlugCancel();
  }

  dispatch({ type: GET_TIP_BY_SLUG_REQUEST });

  try {
    const { data: { data } } = await ApiRequest.request({
      url: `tips/${slug}`,
      cancelToken: new CancelToken(function executor(c) {
        getTipBySlugCancel = c;
      })
    });

    tip = data;

    dispatch({
      type: GET_TIP_BY_SLUG_SUCCESS,
      payload: data
    });
  } catch (error) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.error(error);
    }

    dispatch({
      type: GET_TIP_BY_SLUG_FAILURE,
      payload: error
    });

    failure('Unable to load card');
  } finally {
    getTipBySlugCancel = null;
  }

  return tip;
};

export const saveTip = ({
  title,
  body,
  expiredAt,
  topicIds,
  parentTipId,
  sharingItemIds,
  attachmentIds,
  labelIds,
  view
}) => async dispatch => {
  let tip = null;

  dispatch({ type: SAVE_TIP_REQUEST });

  const params = {
    data: {
      type: 'tips',
      attributes: {
        title,
        body,
        expiration_date: expiredAt
      },
      relationships: {
        subtopics: buildTopicData(topicIds),
        parent_tip: ((parentTipId !== null && parentTipId !== undefined) ? {data: { id: parentTipId, type: "tips" }} : {}),
        labels: buildLabelData(labelIds),
        user_followers: buildUserData(sharingItemIds),
        group_followers: buildGroupData(sharingItemIds),
        attachments: buildAttachmentsData(
          Array.isArray(attachmentIds)
            ? attachmentIds
            : attachmentIds.split(',')
        )
      }
    }
  };

  try {
    const { data: { data } } = await ApiRequest.request({
      method: 'POST',
      data: params,
      url: 'tips'
    });

    tip = data;

    dispatch({
      type: SAVE_TIP_SUCCESS,
      payload: data
    });

    if(view === VIEWS_ENUM.WIKI)
    {     
      const topicId = topicIds && topicIds[0];     
      dispatch({
        type: SAVE_TIP_IN_TOPIC_SUCCESS,
        payload: { tip, topicId, parentTipId }
      });
    }

    success('Card added');

    analytics.track('Card Created', {
      id: data.id,
      title: data.attributes.title,
      topic_ids: data.relationships.topics.data.map(topic => topic.id),
      topic_titles: data.relationships.topics.data.map(topic => topic.title)
    });
  } catch (error) {
    dispatch({
      type: SAVE_TIP_FAILURE,
      payload: error
    });

    failure('Unable to add card');
  }

  return tip;
};

export const updateTip = ({
  id,
  title,
  body,
  expiredAt,
  topicIds,
  parentTipId,
  sharingItemIds,
  attachmentIds,
  labelIds,
  isTaskView = false,
  topicId = null,
  view,
  start_date = null,
  due_date = null,
  completion_date = null,
  expected_completion_date = null,
  resource_required = null,
  completed_percentage = null,
  assignedToIds = null,
  dependencyIds = null
}) => async dispatch => {
  let tip = null;

  dispatch({ type: UPDATE_TIP_REQUEST });

  const params = {
    data: {
      type: 'tips',
      attributes: {
        title,
        body,
        expiration_date: expiredAt,
        start_date,
        due_date,
        completion_date,
        expected_completion_date,
        resource_required,
        completed_percentage
      },
      relationships: {
        subtopics: buildTopicData(topicIds),
        parent_tip: ((parentTipId !== null && parentTipId !== undefined) ? {data: { id: parentTipId, type: "tips" }} : {}),
        labels: buildLabelData(labelIds),
        user_followers: assignedToIds
          ? { data: [...buildUserData(sharingItemIds), ...assignedToIds] }
          : buildUserData(sharingItemIds),
        group_followers: buildGroupData(sharingItemIds),
        attachments: buildAttachmentsData(
          Array.isArray(attachmentIds)
            ? attachmentIds
            : attachmentIds.split(',')
        ),
        tip_assignments: {
          data: assignedToIds.map(item => ({
            tip_id: id,
            assignment_id: item.id,
            assignment_type: 'User'
          }))
        },
        depends_on: { data: dependencyIds }
      }
    }
  };

  try {
    const { data: { data } } = await ApiRequest.request({
      method: 'PATCH',
      data: params,
      url: `tips/${id}`
    });

    tip = data;

    dispatch({
      type: isTaskView ? UPDATE_TIP_IN_TASK_TOPIC_SUCCESS : UPDATE_TIP_SUCCESS,
      payload: isTaskView ? { tip: data, topicId } : data
    });

    if(view === VIEWS_ENUM.WIKI)
    {
      dispatch({
        type: UPDATE_TIP_IN_TOPIC_SUCCESS,
        payload: { tip, topicId, view }
      });
    }

    success('Card updated successfully');
  } catch (error) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.error(error);
    }

    dispatch({
      type: UPDATE_TIP_FAILURE,
      payload: error
    });

    failure('Unable to update card');
  }

  return tip;
};

export function updateCardTitle(card, title) {
  return async dispatch => {
    dispatch({ type: RENAME_CARD_REQUEST, payload: { id: card.id, title } });

    try {
      await ApiRequest.request({
        url: `tips/${card.id}`,
        method: 'PATCH',
        data: { data: { attributes: { title } } }
      });

      dispatch({ type: RENAME_CARD_SUCCESS });

      success('Card title updated successfully');
    } catch (err) {
      if (__DEV__) {
        console.error(err);
      }

      dispatch({
        type: RENAME_CARD_FAILURE,
        payload: { id: card.id, previousValue: title }
      });

      failure('Unable to update card title');
    }
  };
}

export function updateCardDates(card, start_date, due_date) {
  return async dispatch => {
    dispatch({
      type: UPDATE_CARD_DATES_REQUEST,
      payload: { id: card.id, start_date, due_date }
    });

    try {
      await ApiRequest.request({
        url: `tips/${card.id}`,
        method: 'PATCH',
        data: {
          data: {
            attributes: {
              start_date,
              due_date
            }
          }
        }
      });

      dispatch({ type: UPDATE_CARD_DATES_SUCCESS, payload: card.id });

      success('Card dates updated successfully');
    } catch (error) {
      if (__DEV__) {
        console.error(error);
      }

      dispatch({
        type: UPDATE_CARD_DATES_FAILURE,
        payload: {
          error,
          id: card.id,
          start_date: card.start_date,
          due_date: card.due_date
        }
      });

      failure('Unable to update card dates');
    }
  };
}

export function completeCard(card, completion = 100) {
  return async dispatch => {
    const completion_date =
      completion === 100 ? new Date().valueOf() : card.completion_date;

    dispatch({
      type: COMPLETE_CARD_REQUEST,
      payload: { id: card.id, completion, date: completion_date }
    });

    try {
      await ApiRequest.request({
        url: `tips/${card.id}`,
        method: 'PATCH',
        data: {
          data: {
            attributes: {
              completed_percentage: completion,
              completion_date
            }
          }
        }
      });

      dispatch({ type: COMPLETE_CARD_SUCCESS, payload: card.id });

      success('Card updated successfully');
    } catch (error) {
      if (__DEV__) {
        console.error(error);
      }

      dispatch({
        type: COMPLETE_CARD_FAILURE,
        payload: {
          error,
          id: card.id,
          previousDate: card.attributes.completion_date,
          previousValue: card.attributes.completed_percentage
        }
      });

      failure('Unable to update card');
    }
  };
}

export const removeTip = id => async dispatch => {
  let callComplete = null;

  try {
    await ApiRequest.request({
      method: 'DELETE',
      url: `tips/${id}`
    });

    dispatch({
      type: REMOVE_TIP_SUCCESS,
      payload: id
    });

    success('Card deleted successfully');
    callComplete = true;
  } catch (error) {
    dispatch({
      type: REMOVE_TIP_FAILURE,
      payload: error
    });

    failure('Unable to remove card');
    callComplete = false;
  }

  return callComplete;
};

export const archiveTip = id => async dispatch => {
  let callComplete = null;

  let msg = info('Archiving card...');

  try {
    dispatch({
      type: ARCHIVE_TIP_REQUEST,
      payload: id
    });

    const { data: { data } } = await ApiRequest.request({
      method: 'POST',
      url: `tips/${id}/archive`
    });

    dispatch({
      type: ARCHIVE_TIP_SUCCESS,
      payload: data
    });

    msg.update({
      message: 'Card archived successfully',
      type: 'success',
      showCloseButton: true
    });

    callComplete = true;
  } catch (error) {
    dispatch({
      type: ARCHIVE_TIP_FAILURE,
      payload: error
    });

    msg.update({
      message: 'Unable to archive card',
      type: 'error',
      showCloseButton: true
    });

    callComplete = false;
  }

  return callComplete;
};

export const starTip = id => async dispatch => {
  let callComplete = null;

  try {
    dispatch({
      type: STAR_TIP_SUCCESS,
      payload: id
    });

    await ApiRequest.request({
      method: 'POST',
      url: `tips/${id}/star`
    });

    callComplete = true;
  } catch (error) {
    dispatch({
      type: STAR_TIP_FAILURE,
      payload: error
    });

    failure('Unable to star card');
    callComplete = false;
  }

  return callComplete;
};

export const unstarTip = id => async dispatch => {
  let callComplete = null;

  try {
    dispatch({
      type: UNSTAR_TIP_SUCCESS,
      payload: id
    });

    await ApiRequest.request({
      method: 'POST',
      url: `tips/${id}/unstar`
    });

    callComplete = true;
  } catch (error) {
    dispatch({
      type: UNSTAR_TIP_FAILURE,
      payload: error
    });

    failure('Unable to unstar card');

    callComplete = false;
  }

  return callComplete;
};

export const likeTip = id => async dispatch => {
  let callComplete = null;

  try {
    dispatch({
      type: LIKE_TIP_SUCCESS,
      payload: id
    });

    await ApiRequest.request({
      method: 'POST',
      url: `tips/${id}/like`
    });

    callComplete = true;
  } catch (error) {
    dispatch({
      type: LIKE_TIP_FAILURE,
      payload: error
    });

    failure('Unable to like card');
    callComplete = false;
  }

  return callComplete;
};

export const unlikeTip = id => async dispatch => {
  let callComplete = null;

  try {
    dispatch({
      type: UNLIKE_TIP_SUCCESS,
      payload: id
    });

    await ApiRequest.request({
      method: 'POST',
      url: `tips/${id}/unlike`
    });

    callComplete = true;
  } catch (error) {
    dispatch({
      type: UNLIKE_TIP_FAILURE,
      payload: error
    });

    failure('Unable to unlike card');
    callComplete = false;
  }

  return callComplete;
};

export const removeAttachment = (tipId, attachmentId) => dispatch =>
  dispatch({
    type: REMOVE_ATTACHMENT_FROM_TIP,
    payload: {
      tipId,
      attachmentId
    }
  });


export const flushTip = () => dispatch =>
  dispatch({ type: FLUSH_TIP });
  
export function makeConnections(options) {  
  return async dispatch => {
    try {
      dispatch({
        type: TIP_CONNECTIONS_SUCCESS        
      });
      const params = buildTipConnectionsParams(options);
      await ApiRequest.request({
        method: 'POST',
        url: 'connections',
        data: params
      });
     
    } catch (error) {     
      dispatch({
        type: TIP_CONNECTIONS_FAILURE,
        payload: error
      });
    }
  };
}

const buildTipConnectionsParams = (options) =>
{ 
  if(options.type === 'Create')
  {
    return ({ 
      data: { 
        attributes: { 
          next: {
            follower : { id: options.nextFollower, type: 'Tip' }, 
            followable : {id: options.nextFollowable, type: 'Tip' } 
          } 
        }
      }
    });
  }
  else if(options.type === 'Update')
  {
    return ({ 
      data: { 
        attributes: { 
          previous: {
            follower : { id: options.previousFollower, type: 'Tip' }, 
            followable : {id: options.previousFollowable, type: 'Tip' } 
          },
          next: {
            follower : { id: options.nextFollower, type: 'Tip' }, 
            followable : {id: options.nextFollowable, type: 'Tip' } 
          } 
        }
      }
    });
  }
  else if(options.type === 'Remove')
  {
    return ({ 
      data: { 
        attributes: { 
          previous: {
            follower : { id: options.previousFollower, type: 'Tip' }, 
            followable : {id: options.previousFollowable, type: 'Tip' } 
          } 
        }
      }
    });

  }
};
