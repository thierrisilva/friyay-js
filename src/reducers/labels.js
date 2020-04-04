import { switchcaseF } from './utils';
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
  LOGOUT_USER
} from 'AppConstants';
import { compose, sortBy, toLower, concat, path } from 'ramda';

const sortByNameCaseInsensitive = sortBy(compose(toLower, path(['attributes', 'name'])));
const addLabelAndSortByName = label => compose(sortByNameCaseInsensitive, concat([ label ]));

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
const getLabels = (state, payload) => ({
  ...state,
  isLoading: false,
  collection: payload
});
const setError = (state, payload) => ({
  ...state,
  isLoading: false,
  error: payload
});
const addLabel = (state, payload) => ({
  ...state,
  collection: addLabelAndSortByName(payload)(state.collection)
});
const removeLabel = (state, payload) => ({
  ...state,
  collection: state.collection.filter(({ id }) => id !== payload)
});
const updateLabel = (state, payload) => ({
  ...state,
  collection: state.collection.map(
    item => (item.id === payload.id ? payload : item)
  )
});
const reset = () => initialState;

const labels = (state = initialState, { type, payload }) =>
  switchcaseF({
    [GET_LABELS_REQUEST]: setLoading,
    [GET_LABELS_SUCCESS]: getLabels,
    [ADD_LABEL_FAILURE]: setError,
    [REMOVE_LABEL_FAILURE]: setError,
    [UPDATE_LABEL_FAILURE]: setError,
    [GET_LABELS_FAILURE]: setError,
    [ADD_LABEL_SUCCESS]: addLabel,
    [REMOVE_LABEL_SUCCESS]: removeLabel,
    [UPDATE_LABEL_SUCCESS]: updateLabel,
    [LOGOUT_USER]: reset
  })(state)(type)(state, payload);

export default labels;
