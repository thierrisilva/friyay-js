import { switchcaseF } from './utils';
import {
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
  UPDATE_GROUP_SUCCESS,
} from 'AppConstants';

const initialState = {
  isLoading: null,
  collection: [],
  error: null,
  isSaving: false
};
const setLoading = state => ({ 
  ...state, 
  error: null, 
  isLoading: true 
});
const setSaving = state => ({ 
  ...state, 
  isSaving: true 
});
const getGroups = (state, payload) => ({
  ...state,
  isLoading: false,
  collection: payload
});
const setError = (state, payload) => ({
  ...state,
  isLoading: false,
  isSaving: false,
  error: payload
});
const addGroup = (state, payload) => ({
  ...state,
  isSaving: false,
  collection: [payload, ...state.collection]
});
const updateGroup = (state, payload) => ({
  ...state,
  isSaving: false,
  collection: state.collection.map(
    item => item.id === payload.id 
      ? payload
      : item
  )
});
const removeGroup = (state, payload) => ({
  ...state,
  collection: state.collection.filter(
    ({ id }) => id !== payload
  )
})

const groups = (state = initialState, { type, payload }) =>
  switchcaseF({
    [GET_GROUPS_REQUEST]: setLoading,
    [GET_GROUPS_FAILURE]: setError,
    [GET_GROUPS_SUCCESS]: getGroups,
    [ADD_GROUP_REQUEST]: setSaving,
    [ADD_GROUP_FAILURE]: setError,
    [ADD_GROUP_SUCCESS]: addGroup,
    [UPDATE_GROUP_REQUEST]: setSaving,
    [UPDATE_GROUP_FAILURE]: setError,
    [UPDATE_GROUP_SUCCESS]: updateGroup,
    [REMOVE_GROUP_FAILURE]: setError,
    [REMOVE_GROUP_SUCCESS]: removeGroup
  })(state)(type)(state, payload);

export default groups;
