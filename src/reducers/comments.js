import { switchcaseF } from './utils';
import {
  GET_COMMENTS_FAILURE,
  GET_COMMENTS_REQUEST,
  GET_COMMENTS_SUCCESS,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_REQUEST,
  UPDATE_COMMENT_REQUEST,
  UPDATE_COMMENT_FAILURE,
  UPDATE_COMMENT_SUCCESS,
  REMOVE_COMMENT_FAILURE,
  REMOVE_COMMENT_SUCCESS,
  GET_USERS_COMMENTS_FAILURE,
  GET_USERS_COMMENTS_SUCCESS,
  SET_COMMENT_EDIT,
  RESET_COMMENT_EDIT,
  GET_USERS_COMMENTS_REQUEST,
  FOLLOW_USER,
  UNFOLLOW_USER,
  FOLLOW_USER_FAILURE,
  UNFOLLOW_USER_FAILURE,
  REMOVE_MEMBER_SUCCESS
} from 'AppConstants';
import { compose, concat, filter, sortBy, prop, toLower } from 'ramda';
const sortByNameCaseInsensitive = sortBy(compose(toLower, prop('name')));
const addUserAndSortByName = ({ attributes: { username, name }, id }) =>
  compose(sortByNameCaseInsensitive, concat([{
    id,
    name: username,
    full_name: name
  }]));
const removeUserAndSortByName = id =>
  compose(sortByNameCaseInsensitive, filter(({ username }) => username !== id));

const initialState = {
  isSaving: false,
  areCommentsLoading: null,
  collection: [],
  error: null,
  areUsersLoading: null,
  users: [],
  editComment: null
};

const setCommentsLoading = state => ({
  ...state,
  error: null,
  areCommentsLoading: true,
  collection: []
});
const setUsersLoading = state => ({
  ...state,
  error: null,
  areCommentsLoading: true,
  collection: []
});
const getComments = (state, payload) => ({
  ...state,
  areCommentsLoading: false,
  collection: payload
});
const setError = (state, payload) => ({
  ...state,
  areCommentsLoading: false,
  areUsersLoading: false,
  isSaving: false,
  error: payload
});
const removeComment = (state, payload) => ({
  ...state,
  collection: state.collection.filter(({ id }) => id !== payload.id)
});
const saveCommentRequest = state => ({ ...state, isSaving: true });
const addCommentSuccess = (state, payload) => ({
  ...state,
  isSaving: false,
  collection: [...state.collection, payload]
});
const updateCommentSuccess = (state, payload) => ({
  ...state,
  isSaving: false,
  collection: state.collection.map(
    item => (item.id === payload.id ? payload : item)
  )
});
const getUsersComments = (state, payload) => ({
  ...state,
  users: payload.map(({ attributes: { username, name }, id }) => ({
    id,
    name: username,
    full_name: name
  }))
});
const addUserComments = (state, payload) => ({
  ...state,
  users: addUserAndSortByName(payload)(state.users)
});
const removeUserComments = (state, payload) => ({
  ...state,
  users: removeUserAndSortByName(payload)(state.users)
});
const setCommentEdit = (state, payload) => ({
  ...state,
  editComment: payload
});
const resetCommentEdit = state => ({
  ...state,
  editComment: null
});

const relatedTips = (state = initialState, { type, payload }) =>
  switchcaseF({
    [GET_COMMENTS_REQUEST]: setCommentsLoading,
    [GET_COMMENTS_SUCCESS]: getComments,
    [GET_COMMENTS_FAILURE]: setError,
    [ADD_COMMENT_FAILURE]: setError,
    [UPDATE_COMMENT_FAILURE]: setError,
    [ADD_COMMENT_REQUEST]: saveCommentRequest,
    [UPDATE_COMMENT_REQUEST]: saveCommentRequest,
    [ADD_COMMENT_SUCCESS]: addCommentSuccess,
    [UPDATE_COMMENT_SUCCESS]: updateCommentSuccess,
    [REMOVE_COMMENT_SUCCESS]: removeComment,
    [REMOVE_COMMENT_FAILURE]: addCommentSuccess,
    [GET_USERS_COMMENTS_REQUEST]: setUsersLoading,
    [GET_USERS_COMMENTS_FAILURE]: setError,
    [GET_USERS_COMMENTS_SUCCESS]: getUsersComments,
    [FOLLOW_USER]: addUserComments,
    [UNFOLLOW_USER_FAILURE]: addUserComments,
    [UNFOLLOW_USER]: removeUserComments,
    [FOLLOW_USER_FAILURE]: removeUserComments,
    [SET_COMMENT_EDIT]: setCommentEdit,
    [RESET_COMMENT_EDIT]: resetCommentEdit,
    [REMOVE_MEMBER_SUCCESS]: removeUserComments
  })(state)(type)(state, payload);

export default relatedTips;
