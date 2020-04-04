import { CancelToken } from 'axios';
import { ApiRequest } from 'Lib/ApiRequest';
import { success, failure } from 'Utils/toast';

import {
  SAVE_LABEL_CATEGORY_REQUEST,
  SAVE_LABEL_CATEGORY_SUCCESS,
  SAVE_LABEL_CATEGORY_FAILURE,
  GET_LABELS_CATEGORY_REQUEST,
  GET_LABELS_CATEGORY_SUCCESS,
  GET_LABELS_CATEGORY_FAILURE,
} from 'AppConstants';

let getLabelsCategoryCancel = null;

export const getLabelCategory = () => async dispatch => {

  dispatch({ type: GET_LABELS_CATEGORY_REQUEST });

  try {
    const { data: { data } } = await ApiRequest.request({
      url: 'label_categories',
    });

    dispatch({
      type: GET_LABELS_CATEGORY_SUCCESS,
      payload: data
    });
  } catch (error) {
    console.error(error);

    dispatch({
      type: GET_LABELS_CATEGORY_FAILURE,
      payload: error
    });

    failure('Unable to load label categories');
  } finally {
    getLabelsCategoryCancel = null;
  }

  return true;
};

export const saveLabelCategory = ({name}) => async dispatch => {
    dispatch({
      type: SAVE_LABEL_CATEGORY_REQUEST
    });
  
    let reRouteUrl = null;
  
    const params = {
      data: {
        attributes: {
          name
        },
        type: 'label_categories'
      }
    };

    try {
      const { data: { data } } = await ApiRequest.request({
        method: 'POST',
        url: 'label_categories',
        data: params
      });

      reRouteUrl = data;

      dispatch({
        type: SAVE_LABEL_CATEGORY_SUCCESS,
        payload: data
      });
    } catch (error) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.error(error);
      }
  
      dispatch({
        type: SAVE_LABEL_CATEGORY_FAILURE,
        payload: error
      });
      
      failure('Could not save label category');
    }
    return reRouteUrl;
  };