import { uniqBy, prop } from 'ramda';
import { switchcaseF } from './utils';
import {  
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_FAILURE,
  FOLLOW_USER,
  SET_FOLLOWING_USER,
  UNFOLLOW_USER,
  FOLLOW_USER_FAILURE,
  UNFOLLOW_USER_FAILURE,
  GET_USER_BY_ID_REQUEST,
  GET_USER_BY_ID_SUCCESS,
  GET_USER_BY_ID_FAILURE,
  LOGOUT_USER,
  REMOVE_MEMBER_SUCCESS
} from 'AppConstants';

const uniqById = uniqBy(prop('id'));

const initialState = { 
  isLoading: null,
  collection: [],
  error: null,
  userById: null,
  followingUsers: [],
  currentPage: 1,
  totalPages: 1,
  totalCount: 0
};
const setLoading = state => ({ ...state, isLoading: true, userById: null });
const setError = (state, payload) => ({ 
  ...state, 
  isLoading: false,
  error: payload 
});
const getUsers = (state, payload) => ({
  ...state,
  isLoading: false,
  collection:
  payload.currentPage === 1
    ? uniqById(payload.people)
    : uniqById([...state.collection, ...payload.people]),
  currentPage: payload.currentPage,
  totalPages: payload.totalPages,
  totalCount: payload.totalCount
});
const getUserById = (state, payload) => ({
  ...state,
  isLoading: false,
  userById: payload,
  error: null
});
const followUser = (state, payload) => ({
  ...state,
  followingUsers: [
    ...state.followingUsers, 
    ...(Array.isArray(payload) ? payload : [ payload.id ])
  ]
});
const unfollowUser = (state, payload) => ({
  ...state,
  followingUsers: state.followingUsers.filter(id => id !== payload)
});
const removeUser = (state, payload) => ({
  ...state,
  collection: state.collection.filter(({ id }) => id !== payload),
  followingUsers: state.followingUsers.filter(id => id !== payload),
  userById: state.userById !== null && state.userById.id === payload ? null : state.userById
});
const reset = () => initialState;

const people = (state = initialState, { type, payload }) => 
  switchcaseF({
    [GET_USERS_FAILURE]: setError,
    [GET_USERS_REQUEST]: setLoading,
    [GET_USER_BY_ID_FAILURE]: setError,
    [GET_USER_BY_ID_REQUEST]: setLoading,
    [GET_USER_BY_ID_SUCCESS]: getUserById,
    [GET_USERS_SUCCESS]: getUsers,
    [SET_FOLLOWING_USER]: followUser,
    [FOLLOW_USER]: followUser,
    [FOLLOW_USER_FAILURE]: unfollowUser,
    [UNFOLLOW_USER]: unfollowUser,
    [UNFOLLOW_USER_FAILURE]: followUser,
    [LOGOUT_USER]: reset,
    [REMOVE_MEMBER_SUCCESS]: removeUser
  })(state)(type)(state, payload);

export default people;