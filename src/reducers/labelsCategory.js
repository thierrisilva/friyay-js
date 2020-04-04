import { switchcaseF } from './utils';
import {
    SAVE_LABEL_CATEGORY_REQUEST,
    SAVE_LABEL_CATEGORY_SUCCESS,
    SAVE_LABEL_CATEGORY_FAILURE,
    GET_LABELS_CATEGORY_REQUEST,
    GET_LABELS_CATEGORY_SUCCESS,
    GET_LABELS_CATEGORY_FAILURE,
} from 'AppConstants';
import { compose, sortBy, toLower, concat, path } from 'ramda';

const sortByNameCaseInsensitive = sortBy(compose(toLower, path(['attributes', 'name'])));
const addLabelCategoryAndSortByName = labelCategory => compose(sortByNameCaseInsensitive, concat([ labelCategory ]));

const initialState = {
    isSavingLabelCategory: false,
    isLoadingLC: null,
    collectionLC: [],
    error: null,
  };

const saveLabelCategoryRequest = state => ({
    ...state,
    isSavingLabelCategory: true
});

const saveLableCategorySuccess = (state, payload) => ({
    ...state,
    collectionLC: addLabelCategoryAndSortByName(payload)(state.collectionLC),
    isSavingLabelCategory: false,
  });

const saveLableCategoryFailure = (state, payload) => ({
    ...state,
    error: payload
});

const setLoading = state => (
  { 
  ...state, 
  error: null, 
  isLoadingLC: true 
});

const getLabelsCategory = (state, payload) => ({
  ...state,
  isLoadingLC: false,
  collectionLC: payload
});

const setError = (state, payload) => ({
  ...state,
  isLoadingLC: false,
  error: payload
});
const reset = () => initialState;

const labelsCategory = (state = initialState, { type, payload }) =>
  switchcaseF({
    [SAVE_LABEL_CATEGORY_REQUEST]: saveLabelCategoryRequest,
    [SAVE_LABEL_CATEGORY_SUCCESS] : saveLableCategorySuccess,
    [SAVE_LABEL_CATEGORY_FAILURE] : saveLableCategoryFailure,
    [GET_LABELS_CATEGORY_REQUEST]: setLoading,
    [GET_LABELS_CATEGORY_SUCCESS]: getLabelsCategory,
    [GET_LABELS_CATEGORY_FAILURE]: setError,
  })(state)(type)(state, payload);

export default labelsCategory;