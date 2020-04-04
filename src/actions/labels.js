import { CancelToken } from 'axios';
import { ApiRequest } from 'Lib/ApiRequest';
import { success, failure } from 'Utils/toast';
import toString from 'lodash/toString';
import { buildLabelCategoryData } from 'Utils/buildTipData';

import {
  GET_LABELS_FAILURE,
  GET_LABELS_REQUEST,
  GET_LABELS_SUCCESS,
  ADD_LABEL_FAILURE,
  ADD_LABEL_SUCCESS,
  REMOVE_LABEL_FAILURE,
  REMOVE_LABEL_SUCCESS,
  UPDATE_LABEL_FAILURE,
  UPDATE_LABEL_SUCCESS,
  ASSIGN_LABEL_FAILURE,
  ASSIGN_LABEL_SUCCESS,
  UNASSIGN_LABEL_FAILURE,
  UNASSIGN_LABEL_SUCCESS
} from 'AppConstants';

let getLabelsCancel = null;

export const getLabels = () => async dispatch => {
  if (getLabelsCancel !== null) {
    getLabelsCancel();
  }

  dispatch({ type: GET_LABELS_REQUEST });

  try {
    const { data: { data } } = await ApiRequest.request({
      url: 'labels',
      cancelToken: new CancelToken(function executor(c) {
        getLabelsCancel = c;
      })
    });

    dispatch({
      type: GET_LABELS_SUCCESS,
      payload: data
    });
  } catch (error) {
    console.error(error);

    dispatch({
      type: GET_LABELS_FAILURE,
      payload: error
    });

    failure('Unable to load labels');
  } finally {
    getLabelsCancel = null;
  }

  return true;
};

export const saveLabel = ({ name, kind, color, label_category_ids }) => async dispatch => {
  const params = {
    data: {
      attributes: {
        name,
        kind,
        color,
        label_category_ids
      }
    }
  };

  let label = null;

  try {
    const { data: { data } } = await ApiRequest.request({
      method: 'POST',
      data: params,
      url: 'labels'
    });

    label = data;

    dispatch({
      type: ADD_LABEL_SUCCESS,
      payload: data
    });

    success('Label added');
  } catch (error) {
    dispatch({
      type: ADD_LABEL_FAILURE,
      payload: error
    });

    failure('Unable to add label');
  }

  return label;
};

export const updateLabel = ({ id, name, kind, color, label_category_ids }) => async dispatch => {
  const params = {
    data: {
      attributes: {
        name,
        kind,
        color,
        label_category_ids
      }
    },
    item_id: id,
    item_type: 'Label'
  };

  try {
    await ApiRequest.request({
      method: 'PATCH',
      data: params,
      url: `labels/${id}`
    });

    dispatch({
      type: UPDATE_LABEL_SUCCESS,
      payload: {
        id,
        attributes: {
          color: toString(color),
          kind,
          name,
          label_category_ids
        },
        type: "labels",
        relationships: {
          label_categories: buildLabelCategoryData(label_category_ids)
        }
      }
    });

    success('Label updated successfully');
  } catch (error) {
    console.error(error);

    dispatch({
      type: UPDATE_LABEL_FAILURE,
      payload: error
    });

    failure('Unable to update label');
  }
};

export const removeLabel = id => async dispatch => {
  try {
    await ApiRequest.request({
      method: 'DELETE',
      url: `labels/${id}`
    });

    dispatch({
      type: REMOVE_LABEL_SUCCESS,
      payload: id
    });

    success('Label deleted successfully');
  } catch (error) {
    dispatch({
      type: REMOVE_LABEL_FAILURE,
      payload: error
    });

    failure('Unable to remove label');
  }

  return true;
};

export const assignLabel = (label, itemId) => async dispatch => {
  try {
    dispatch({
      type: ASSIGN_LABEL_SUCCESS,
      payload: {
        id: itemId,
        label
      }
    });

    await ApiRequest.request({
      method: 'POST',
      url: 'label_assignments',
      data: {
        data: {
          type: 'label_assignments',
          attributes: {
            label_id: label.id,
            item_id: itemId,
            item_type: 'Tip'
          }
        }
      }
    });
  } catch (error) {
    console.error(error);

    dispatch({
      type: ASSIGN_LABEL_FAILURE,
      payload: {
        error,
        id: itemId,
        label
      }
    });

    failure('Unable to assign label');
  }

  return true;
};

export const unassignLabel = (label, itemId) => async dispatch => {
  try {
    dispatch({
      type: UNASSIGN_LABEL_SUCCESS,
      payload: {
        id: itemId,
        label
      }
    });

    await ApiRequest.request({
      method: 'DELETE',
      url: 'label_assignments/do-not-need',
      data: {
        data: {
          type: 'label_assignments',
          attributes: {
            label_id: label.id,
            item_id: itemId,
            item_type: 'Tip'
          }
        }
      }
    });
  } catch (error) {
    console.error(error);

    dispatch({
      type: UNASSIGN_LABEL_FAILURE,
      payload: {
        error,
        id: itemId,
        label
      }
    });

    failure('Unable to unassign label');
  }

  return true;
};
