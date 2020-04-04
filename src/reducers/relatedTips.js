import { switchcaseF } from './utils';
import {
  GET_RELATED_TIPS_FAILURE,
  GET_RELATED_TIPS_REQUEST,
  GET_RELATED_TIPS_SUCCESS,
  REMOVE_TIP_SUCCESS,
  REMOVE_TIP_FAILURE,
  UPDATE_TIP_FAILURE,
  UPDATE_TIP_REQUEST,
  UPDATE_TIP_SUCCESS
} from 'AppConstants';

const initialState = {
  isSaving: null,
  isLoading: null,
  collection: [],
  error: null
};

const setLoading = state => ({
  ...state,
  error: null,
  isLoading: true
});
const getRelatedTips = (state, payload) => ({
  ...state,
  isLoading: false,
  collection: payload.tips
});
const setError = (state, payload) => ({
  ...state,
  isLoading: false,
  error: payload
});
const removeTip = (state, payload) => ({
  ...state,
  collection: state.collection.filter(({ id }) => id !== payload)
});
const updateTipRequest = state => ({ ...state, isSaving: true });
const updateTipSuccess = (state, payload) => ({
  ...state,
  isSaving: false,
  collection: state.collection.map(
    item => (item.id === payload.id ? payload : item)
  )
});
const updateTipFailure = (state, payload) => ({
  ...state,
  isSaving: false,
  error: payload
});

const relatedTips = (state = initialState, { type, payload }) =>
  switchcaseF({
    [GET_RELATED_TIPS_REQUEST]: setLoading,
    [GET_RELATED_TIPS_SUCCESS]: getRelatedTips,
    [GET_RELATED_TIPS_FAILURE]: setError,
    [REMOVE_TIP_SUCCESS]: removeTip,
    [REMOVE_TIP_FAILURE]: setError,
    [UPDATE_TIP_REQUEST]: updateTipRequest,
    [UPDATE_TIP_SUCCESS]: updateTipSuccess,
    [UPDATE_TIP_FAILURE]: updateTipFailure
  })(state)(type)(state, payload);

export default relatedTips;
