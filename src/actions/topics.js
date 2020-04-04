import { CancelToken } from 'axios';
import { ApiRequest } from '../lib/ApiRequest';
import { merge } from 'ramda';
import getUrlParams from '../utils/getUrlParams';
import { failure } from 'Utils/toast';
import uniqueId from 'lodash/uniqueId';

import {
  handleCancelRequest,
  handleAPICancelToken,
  handleAPICatch,
  handleCatch,
  handleFinally
} from './error';

import {
  GET_TOPICS_REQUEST,
  GET_TOPICS_SUCCESS,
  GET_TOPICS_FAILURE,
  TOPIC_FOLLOW_REQUEST,
  TOPIC_FOLLOW_SUCCESS,
  TOPIC_FOLLOW_ERROR,
  TOPIC_UNFOLLOW_REQUEST,
  TOPIC_UNFOLLOW_SUCCESS,
  TOPIC_UNFOLLOW_ERROR
} from 'AppConstants';

const defaultOptions = merge({
  with_details: true,
  with_followers: true,
  search_all_hives: true,
  page: {
    number: 1,
    size: 25
  }
});

export const getTopics = options => async dispatch => {
  handleCancelRequest();
  dispatch({ type: GET_TOPICS_REQUEST });
  try {
    const {
      data: { data, meta }
    } = await ApiRequest.request({
      url: `topics?${getUrlParams(defaultOptions(options))}`,
      cancelToken: new CancelToken(handleAPICancelToken)
    }).catch(handleAPICatch);

    dispatch({
      type: GET_TOPICS_SUCCESS,
      payload: {
        topics: data,
        currentPage: meta.current_page,
        totalPages: meta.total_pages,
        totalCount: meta.total_count
      }
    });
  } catch (error) {
    handleCatch(error, dispatch, GET_TOPICS_FAILURE, 'load topics');
  } finally {
    handleFinally();
  }

  return true;
};

export const followTopic = id => async dispatch => {
  handleCancelRequest();
  dispatch({
    type: TOPIC_FOLLOW_REQUEST,
    payload: {
      topicFollowUnfollow: {
        id,
        isLoading: true
      }
    }
  });
  try {
    const {
      data: { data }
    } = await ApiRequest.request({
      method: 'POST',
      url: `topics/${id}/join`,
      cancelToken: new CancelToken(handleAPICancelToken)
    }).catch(handleAPICatch);

    dispatch({
      type: TOPIC_FOLLOW_SUCCESS,
      payload: {
        topicFollowUnfollow: {
          id: data.id,
          isLoading: false
        },
        topic: data
      }
    });
  } catch (error) {
    handleCatch(error, dispatch, TOPIC_FOLLOW_ERROR, 'follow topic');
  } finally {
    handleFinally();
  }

  return true;
};

export const unfollowTopic = id => async dispatch => {
  handleCancelRequest();
  dispatch({
    type: TOPIC_UNFOLLOW_REQUEST,
    payload: {
      topicFollowUnfollow: {
        id,
        isLoading: true
      }
    }
  });
  try {
    const {
      data: { data }
    } = await ApiRequest.request({
      method: 'POST',
      url: `topics/${id}/leave`,
      cancelToken: new CancelToken(handleAPICancelToken)
    }).catch(handleAPICatch);

    dispatch({
      type: TOPIC_UNFOLLOW_SUCCESS,
      payload: {
        topicFollowUnfollow: {
          id: data.id,
          isLoading: false
        },
        topic: data,
        topicId: data.id
      }
    });
  } catch (error) {
    handleCatch(error, dispatch, TOPIC_UNFOLLOW_ERROR, 'unfollow topic');
  } finally {
    handleFinally();
  }

  return true;
};

export const createTopic = (title, history) => async dispatch => {
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
          attributes: { title }
        }
      }
    }).catch(handleAPICatch);
    history.push(`/yays/${data.id}`);
  } catch (error) {
    handleCatch(error, dispatch, GET_TOPICS_FAILURE, 'create topic');
  } finally {
    handleFinally();
  }
};
