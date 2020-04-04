import { switchcaseF } from './utils';
import {
  GET_TOPICS_REQUEST,
  GET_TOPICS_SUCCESS,
  GET_TOPICS_FAILURE,
  TOPIC_FOLLOW_REQUEST,
  TOPIC_FOLLOW_SUCCESS,
  TOPIC_FOLLOW_ERROR,
  TOPIC_UNFOLLOW_REQUEST,
  TOPIC_UNFOLLOW_SUCCESS,
  TOPIC_UNFOLLOW_ERROR,
  SAVE_FIRST_TOPIC_SUCCESS
} from 'AppConstants';

const initialState = { 
  isLoading: null,
  collection: [],
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  topicFollowUnfollow: {
    id: '',
    isLoading: false
  }
};
const setLoading = state => ({ ...state, isLoading: true });
const setFollowUnfollowLoading = (state, {topicFollowUnfollow}) => ({
  ...state, 
  topicFollowUnfollow
});
const setFollowUnfollowSuccess = (state, {topicFollowUnfollow, topic}) => {
  const topics = [...state.collection];
  topics.forEach((data, index) => {
    if (data.id === topic.id) {
      topics[index] = topic;
    }
  });
  return {
    ...state,
    collection: topics,
    topicFollowUnfollow
  };
};
const setFollowUnfollowError = (state, payload) => ({
  ...state, 
  topicFollowUnfollow : {
    id: '', 
    isLoading: false
  },
  error: payload
});
const setError = (state, payload) => ({ 
  ...state, 
  isLoading: false,
  error: payload 
});
const getTopics = (state, payload) => ({
  ...state,
  isLoading: false,
  collection:
  payload.currentPage === 1
    ? payload.topics
    : [...state.collection, ...payload.topics],
  currentPage: payload.currentPage,
  totalPages: payload.totalPages,
  totalCount: payload.totalCount
});
const addTopic = (state, payload) => ({
  ...state,
  collection: [payload, ...state.collection]
});

const topics = (state = initialState, { type, payload }) => 
  switchcaseF({
    [GET_TOPICS_FAILURE]: setError,
    [GET_TOPICS_REQUEST]: setLoading,
    [GET_TOPICS_SUCCESS]: getTopics,
    [TOPIC_FOLLOW_REQUEST]: setFollowUnfollowLoading,
    [TOPIC_FOLLOW_SUCCESS]: setFollowUnfollowSuccess,
    [TOPIC_UNFOLLOW_REQUEST]: setFollowUnfollowLoading,
    [TOPIC_UNFOLLOW_SUCCESS]: setFollowUnfollowSuccess,
    [TOPIC_FOLLOW_ERROR]: setFollowUnfollowError,
    [TOPIC_UNFOLLOW_ERROR]: setFollowUnfollowError,
    [SAVE_FIRST_TOPIC_SUCCESS]: addTopic
  })(state)(type)(state, payload);

export default topics;