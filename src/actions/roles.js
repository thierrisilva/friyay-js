import { ApiRequest } from 'Lib/ApiRequest';
import {
  GET_ROLES_REQUEST,
  GET_ROLES_SUCCESS,
  GET_ROLES_FAILURE
} from 'AppConstants';

export const getRoles = () => async dispatch => {
  dispatch({ type: GET_ROLES_REQUEST });

  try {
    const { data: { data } } = await ApiRequest.request({
      url: 'domain_roles',
    });

    dispatch({
      type: GET_ROLES_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GET_ROLES_FAILURE,
      payload: error
    });
  }
};
