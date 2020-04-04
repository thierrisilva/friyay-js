import { CancelToken } from 'axios';
import { ApiRequest } from 'Lib/ApiRequest';
import { success, failure, info } from 'Utils/toast';
import { buildUserData } from 'Utils/buildTipData';
import {
  SET_GROUP_BY_SLUG,
  GET_GROUPS_REQUEST,
  GET_GROUPS_FAILURE,
  GET_GROUPS_SUCCESS,
  ADD_GROUP_REQUEST,
  ADD_GROUP_FAILURE,
  ADD_GROUP_SUCCESS,
  REMOVE_GROUP_FAILURE,
  REMOVE_GROUP_SUCCESS,
  UPDATE_GROUP_REQUEST,
  UPDATE_GROUP_FAILURE,
  UPDATE_GROUP_SUCCESS
} from 'AppConstants';
import uniqueId from 'lodash/uniqueId';

let getGroupsCancel = null;
let groupsCancelId = null;

export const setActiveGroup = slug => dispatch =>
  dispatch({
    type: SET_GROUP_BY_SLUG,
    payload: slug
  });

export const getGroups = () => async dispatch => {
  if (getGroupsCancel !== null) {
    getGroupsCancel(`CANCEL_REQUEST ${groupsCancelId}`);
    getGroupsCancel = null;
    groupsCancelId = null;
  }

  dispatch({
    type: GET_GROUPS_REQUEST
  });

  try {
    const {
      data: { data }
    } = await ApiRequest.request({
      url: 'groups',
      cancelToken: new CancelToken(function executor(c) {
        getGroupsCancel = c;
        groupsCancelId = uniqueId();
      })
    }).catch(err => {
      // TODO: Detail full error if comes from server
      if (err.message.includes('CANCEL_REQUEST')) {
        throw new Error('CANCEL_REQUEST');
      }
    });

    dispatch({
      type: GET_GROUPS_SUCCESS,
      payload: data
    });
  } catch (error) {
    if (error.message !== 'CANCEL_REQUEST') {
      console.error(error);

      dispatch({
        type: GET_GROUPS_FAILURE,
        payload: error
      });

      failure('Unable to load teams');
    }
  } finally {
    getGroupsCancel = null;
    groupsCancelId = null;
  }

  return true;
};

export const createGroup = ({
  title,
  description,
  userIds,
  domain
}) => async dispatch => {
  dispatch({
    type: ADD_GROUP_REQUEST
  });

  let reRouteUrl = null;

  const params = {
    data: {
      type: 'groups',
      attributes: {
        title,
        description
      },
      relationships: {
        user_followers: buildUserData(userIds)
      }
    }
  };

  try {
    if (domain) {
      ApiRequest.defaults.headers.common['X-Tenant-Name'] =
        domain.attributes.tenant_name;
    } else {
      delete ApiRequest.default.headers.common['X-Tenant-Name'];
    }
    const {
      data: { data }
    } = await ApiRequest.request({
      method: 'POST',
      data: params,
      url: 'groups'
    }).catch(err => {
      // TODO: untested
      if (err.detail) {
        reRouteUrl = err.detail.resourceUrl;
        throw new Error(err.title);
      }
    });

    reRouteUrl = data.attributes.slug;

    dispatch({
      type: ADD_GROUP_SUCCESS,
      payload: data
    });

    success('Team created');
  } catch (error) {
    dispatch({
      type: ADD_GROUP_FAILURE,
      payload: error
    });

    failure(error.message);

    if (reRouteUrl !== null) {
      info('That Team already exists. Redirecting to the existing Team.');
    }
  }

  return reRouteUrl;
};

export const updateGroup = ({
  id,
  title,
  description,
  userIds
}) => async dispatch => {
  dispatch({
    type: UPDATE_GROUP_REQUEST
  });

  const params = {
    data: {
      type: 'groups',
      attributes: {
        title,
        description
      },
      relationships: {
        user_followers: buildUserData(userIds)
      }
    }
  };

  try {
    const {
      data: { data }
    } = await ApiRequest.request({
      method: 'PATCH',
      data: params,
      url: `groups/${id}`
    });

    dispatch({
      type: UPDATE_GROUP_SUCCESS,
      payload: data
    });

    success('Team updated');
  } catch (error) {
    dispatch({
      type: UPDATE_GROUP_FAILURE,
      payload: error
    });

    failure(error.message);
  }
};

export const removeGroup = id => async dispatch => {
  try {
    await ApiRequest.request({
      method: 'DELETE',
      url: `groups/${id}`
    });

    dispatch({
      type: REMOVE_GROUP_SUCCESS,
      payload: id
    });

    success('Team removed');
  } catch (error) {
    dispatch({
      type: REMOVE_GROUP_FAILURE,
      payload: error
    });

    failure(error.message);
  }
};
