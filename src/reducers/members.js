import { switchcaseF } from './utils';
import {
  GET_USERS_BY_DOMAIN_REQUEST,
  GET_USERS_BY_DOMAIN_SUCCESS,
  GET_USERS_BY_DOMAIN_FAILURE,
  UPDATE_ROLE_REQUEST,
  UPDATE_ROLE_SUCCESS,
  UPDATE_ROLE_FAILURE,
  REMOVE_MEMBER_REQUEST,
  REMOVE_MEMBER_SUCCESS,
  REMOVE_MEMBER_FAILURE,
} from 'AppConstants';
import uniqBy from 'lodash/uniqBy';

const initialState = {
  isLoading: null,
  collection: [],
  error: null,
  isRemovingMember: null,
  isUpdatingRole: null
};
const setLoading = state => ({ 
  ...state, 
  error: null, 
  isLoading: true 
});
const getUsersByDomain = (state, payload) => ({
  ...state,
  isLoading: false,
  collection: uniqBy(payload, 'id')
});
const setError = (state, payload) => ({
  ...state,
  isLoading: false,
  error: payload
});
const setUpdating = (state, payload) => ({
  ...state,
  isUpdatingRole: payload 
});
const updateMember = (state, { id, role }) => ({
  ...state,
  isUpdatingRole: null,
  collection: state.collection.map(
    item => item.id === id 
      ? Object.assign({}, item, { current_role: role })
      : item
  )
});
const setUpdateError = (state, payload) => ({
  ...state,
  isUpdatingRole: null,
  error: payload
});
const setRemoving = (state, payload) => ({
  ...state,
  isRemovingMember: payload 
});
const removeMember = (state, payload) => ({
  ...state,
  isRemovingMember: null,
  collection: state.collection.filter(({ id }) => id !== payload)
});
const setRemoveError = (state, payload) => ({
  ...state,
  isRemovingMember: null,
  error: payload
});

const members = (state = initialState, { type, payload }) =>
  switchcaseF({
    [GET_USERS_BY_DOMAIN_REQUEST]: setLoading,
    [GET_USERS_BY_DOMAIN_FAILURE]: setError,
    [GET_USERS_BY_DOMAIN_SUCCESS]: getUsersByDomain,
    [UPDATE_ROLE_REQUEST]: setUpdating,
    [UPDATE_ROLE_SUCCESS]: updateMember,
    [UPDATE_ROLE_FAILURE]: setUpdateError,
    [REMOVE_MEMBER_REQUEST]: setRemoving,
    [REMOVE_MEMBER_SUCCESS]: removeMember,
    [REMOVE_MEMBER_FAILURE]: setRemoveError,
  })(state)(type)(state, payload);

export default members;
