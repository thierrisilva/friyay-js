import { CancelToken } from 'axios';
import { ApiRequest } from '../lib/ApiRequest';
import getUrlParams from '../utils/getUrlParams';
import {
  GET_RELATED_TIPS_FAILURE,
  GET_RELATED_TIPS_REQUEST,
  GET_RELATED_TIPS_SUCCESS
} from 'AppConstants';

let getRelatedTipsCancel = null;

const defaultOptions = {
  page: {
    number: 1,
    size: 20
  }
};

export const getRelatedTips = id => async dispatch => {
  if (getRelatedTipsCancel !== null) {
    getRelatedTipsCancel();
  }

  dispatch({ type: GET_RELATED_TIPS_REQUEST });

  try {
    const { data: { data } } = await ApiRequest.request({
      url: `topics/${id}/tips?${getUrlParams(defaultOptions)}`,
      cancelToken: new CancelToken(function executor(c) {
        getRelatedTipsCancel = c;
      })
    });

    dispatch({
      type: GET_RELATED_TIPS_SUCCESS,
      payload: {
        tips: data
      }
    });
  } catch (error) {
    dispatch({
      type: GET_RELATED_TIPS_FAILURE,
      payload: error
    });
  } finally {
    getRelatedTipsCancel = null;
  }

  return true;
};
