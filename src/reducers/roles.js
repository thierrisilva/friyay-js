import { switchcaseF } from './utils';
import {
  GET_ROLES_REQUEST,
  GET_ROLES_SUCCESS,
  GET_ROLES_FAILURE
} from 'AppConstants';

const initialState = {
  isLoading: null,
  collection: [],
  error: null
};
const setLoading = state => ({ 
  ...state, 
  error: null, 
  isLoading: true 
});
const getRoles = (state, payload) => ({
  ...state,
  isLoading: false,
  collection: payload
});
const setError = (state, payload) => ({
  ...state,
  isLoading: false,
  error: payload
});

const roles = (state = initialState, { type, payload }) =>
  switchcaseF({
    [GET_ROLES_REQUEST]: setLoading,
    [GET_ROLES_FAILURE]: setError,
    [GET_ROLES_SUCCESS]: getRoles
  })(state)(type)(state, payload);

export default roles;
