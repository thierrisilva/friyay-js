import { ApiRequest } from 'Lib/ApiRequest';
import { failure, success } from 'Utils/toast';
import getUrlParams from 'Utils/getUrlParams';
import {
  GET_USERS_BY_DOMAIN_REQUEST,
  GET_USERS_BY_DOMAIN_SUCCESS,
  GET_USERS_BY_DOMAIN_FAILURE,
  UPDATE_ROLE_REQUEST,
  UPDATE_ROLE_SUCCESS,
  UPDATE_ROLE_FAILURE,
  REMOVE_MEMBER_REQUEST,
  REMOVE_MEMBER_SUCCESS,
  REMOVE_MEMBER_FAILURE
} from 'AppConstants';
import { MENU_FILTER as FILTER } from 'Enums';

const defaultOptions = {
  include: 'user_profile',
  filter: {
    users: FILTER.ALL,
    is_active: true
  },
  page: {
    size: 999
  }
};

export const getMembers = () => async dispatch => {
  dispatch({ type: GET_USERS_BY_DOMAIN_REQUEST });

  try {
    const { data: { data, included } } = await ApiRequest.request({
      url: `users?${getUrlParams(defaultOptions)}`,
    });

    dispatch({
      type: GET_USERS_BY_DOMAIN_SUCCESS,
      payload: data.map(user => {
        const profileId = user.relationships.user_profile.data.id;
        const { attributes: { avatar_url } } = included.find(profile => profile.id === profileId);
  
        return {
          name: user.attributes.name,
          current_role: user.attributes.current_domain_role,
          id: user.id,
          avatar_url
        };
      })
    });
  } catch (error) {
    dispatch({
      type: GET_USERS_BY_DOMAIN_FAILURE,
      payload: error
    });

    failure('Could not load domain members');
  }
};

export const updateRole = (id, role) => async dispatch => {
  dispatch({ 
    type: UPDATE_ROLE_REQUEST,
    payload: id
  });

  try {
    await ApiRequest.request({
      method: 'PATCH',
      url: `users/${id}/domain_roles`,
      data: {
        data: { role }
      }
    });

    dispatch({
      type: UPDATE_ROLE_SUCCESS,
      payload: { id, role }
    });

    success('User role updated');
  } catch (error) {
    dispatch({
      type: UPDATE_ROLE_FAILURE,
      payload: error
    });

    failure('Could not update user role');
  }
};

export const removeMember = (id, name) => async dispatch => {
  dispatch({ 
    type: REMOVE_MEMBER_REQUEST,
    payload: id
  });

  try {
    await ApiRequest.request({
      method: 'POST',
      url: `domains/remove_user?user_id=${id}`,
    });

    dispatch({
      type: REMOVE_MEMBER_SUCCESS,
      payload: id
    });

    success(`Member ${name} removed from workspace`);
  } catch (error) {
    console.error(error);

    dispatch({
      type: REMOVE_MEMBER_FAILURE,
      payload: error
    });

    failure('Could not remove member from workspace');
  }
};