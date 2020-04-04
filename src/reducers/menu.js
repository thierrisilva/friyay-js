import { switchcaseF } from './utils';
import {
  LEFT_MENU_SET_USER_FILTER,
  LEFT_MENU_SET_TOPIC_FILTER,
  LEFT_MENU_TOGGLE,
  LEFT_MENU_GET_USERS_REQUEST,
  LEFT_MENU_GET_USERS_SUCCESS,
  LEFT_MENU_GET_USERS_FAILURE,
  LEFT_MENU_GET_TOPICS_REQUEST,
  LEFT_MENU_GET_TOPICS_SUCCESS,
  LEFT_MENU_GET_TOPICS_FAILURE,
  LEFT_MENU_FOLLOW_USER,
  LEFT_MENU_FOLLOW_USER_FAILURE,
  LEFT_MENU_UNFOLLOW_USER,
  LEFT_MENU_UNFOLLOW_USER_FAILURE,
  REMOVE_MEMBER_SUCCESS,
  FOLLOW_TOPIC_SUCCESS,
  UNFOLLOW_TOPIC_SUCCESS,
  SAVE_TOPIC_SUCCESS,
  UPDATE_TOPIC_SUCCESS,
  DELETE_TOPIC_REQUEST,
  TOPIC_FOLLOW_SUCCESS,
  TOPIC_UNFOLLOW_SUCCESS,
  LEFT_MENU_GET_SUBTOPICS_REQUEST,
  LEFT_MENU_GET_SUBTOPICS_SUCCESS,
  CREATE_SUBTOPICS_WITH_TITLE_REQUEST,
  CREATE_SUBTOPICS_WITH_TITLE_SUCCESS,
  CREATE_SUBTOPICS_WITH_TITLE_FAILURE,
  SAVE_TOPIC_REQUEST,
  SAVE_TOPIC_FAILURE,
  TOGGLE_LEFT_MENU_PEOPLE_PANEL,
  SET_UI_SETTINGS,
  STAR_TOPIC_LEFT_MENU,
  UNSTAR_TOPIC_SUCCESS
} from 'AppConstants';
import { MENU_FILTER as FILTER } from 'Enums';
import tiphive from 'Lib/tiphive';
import {
  ifElse,
  always,
  not,
  uniqBy,
  prop,
  compose,
  filter,
  sortBy,
  toLower,
  concat,
  path,
  isNil,
  T,
  F,
  propEq,
  find,
  assocPath,
  replace,
  identity,
  and,
  equals
} from 'ramda';
const notNil = compose(not, isNil);
const sortByNameCaseInsensitive = sortBy(
  compose(toLower, path(['attributes', 'name']))
);
const sortByTitleCaseInsensitive = sortBy(
  compose(toLower, replace(/[^a-zA-Z0-9 ]/g, ''), path(['attributes', 'title']))
);
const addUserAndSortByName = user =>
  compose(sortByNameCaseInsensitive, concat([user]));
const removeUserAndSortByName = id =>
  compose(sortByNameCaseInsensitive, filter(({ id: userId }) => userId !== id));
const addTopicAndSortByName = topic =>
  compose(sortByTitleCaseInsensitive, concat([topic]));

const getUiSettingsFor = key =>
  compose(
    ifElse(
      id => and(equals(FILTER.ALL, id), tiphive.isPublicDomain()),
      always(FILTER.FOLLOWING),
      identity
    ),
    ifElse(notNil, prop('value'), always(null)),
    find(propEq('key', key))
  );
  
const getUiLeftMenu = getUiSettingsFor('left_menu_open');
const getUiPeoplePanel = getUiSettingsFor('left_menu_people_panel');
const getUiPeopleFilter = getUiSettingsFor('left_menu_people_filter');
const getUiTopicsFilter = getUiSettingsFor('left_menu_topics_filter');

const uniqById = uniqBy(prop('id'));
const getDefault = ifElse(
  tiphive.isPublicDomain,
  always(FILTER.FOLLOWING),
  always(FILTER.ALL)
);
const getStored = ifElse(
  id => and(equals(FILTER.ALL, localStorage.getItem(id)), tiphive.isPublicDomain()),
  always(FILTER.FOLLOWING),
  id => localStorage.getItem(id)
);
const getStoredOrDefault = ifElse(
  id => localStorage.getItem(id),
  getStored,
  getDefault
);
const getParsed = compose(JSON.parse, key => localStorage.getItem(key));
const getValueOrTrue = ifElse(compose(notNil, getParsed), getParsed, T);
const getValueOrFalse = ifElse(compose(notNil, getParsed), getParsed, F);
const starTopic = assocPath(['attributes', 'starred_by_current_user'], true);
const unstarTopic = assocPath(['attributes', 'starred_by_current_user'], false);

const leftMenu = JSON.parse(localStorage.getItem('isLeftMenuActive'));
const topicFilter = localStorage.getItem('defaultLeftNavHiveFilter');
const peopleFilter = localStorage.getItem('defaultLeftNavPeopleFilter');

// Migrate old left menu content
// TODO: move this into app start
if (leftMenu !== null) {
  localStorage.setItem('left_menu_open', leftMenu);
  localStorage.removeItem('isLeftMenuActive');
}

// Migrate old topic filter content
// TODO: move this into app start
if (topicFilter !== null) {
  localStorage.setItem('left_menu_topics_filter', topicFilter);
  localStorage.removeItem('defaultLeftNavHiveFilter');
}

// Migrate old people filter content
// TODO: move this into app start
if (peopleFilter !== null) {
  localStorage.setItem('left_menu_people_filter', peopleFilter);
  localStorage.removeItem('defaultLeftNavPeopleFilter');
}

const initialState = {
  isOpen: getValueOrTrue('left_menu_open'),
  isUsersPanelCollapsed: getValueOrFalse('left_menu_people_panel'),
  peopleFilter: getStoredOrDefault('left_menu_people_filter'),
  topicsFilter: getStoredOrDefault('left_menu_topics_filter'),
  areUsersLoading: null,
  users: [],
  usersError: [],
  areTopicsLoading: null,
  topics: [],
  topicsError: [],
  subtopics: [],
  areSubTopicsLoading: false,
  subTopicsError: [],
  isSavingTopic: false,
  isSavingSubTopic: false
};

const setUiSettings = (state, payload) => ({
  ...state,
  isOpen: getUiLeftMenu(payload),
  isUsersPanelCollapsed: getUiPeoplePanel(payload),
  peopleFilter: getUiPeopleFilter(payload),
  topicsFilter: getUiTopicsFilter(payload)
});
const star = (state, payload) => ({
  ...state,
  topics: state.topics.map(
    topic => 
      topic !== null && topic.id === payload
        ? starTopic(topic)
        : topic
  )
});
const unstar = (state, payload) => ({
  ...state,
  topics: state.topics.map(
    topic => 
      topic !== null && topic.id === payload
        ? unstarTopic(topic)
        : topic
  )
});
const toggleMenu = state => ({
  ...state,
  isOpen: not(state.isOpen)
});
const togglePeoplePanel = state => ({
  ...state,
  isUsersPanelCollapsed: not(state.isUsersPanelCollapsed)
});
const setPeopleFilter = (state, payload) => ({
  ...state,
  peopleFilter: payload
});
const setTopicFilter = (state, payload) => ({
  ...state,
  topicsFilter: payload
});
const setUsersLoading = state => ({ ...state, areUsersLoading: true });
const setUsersError = (state, payload) => ({
  ...state,
  areUsersLoading: false,
  usersError: payload
});
const setUsers = (state, payload) => ({
  ...state,
  areUsersLoading: false,
  users: uniqById(payload)
});
const setTopicsLoading = state => ({ ...state, areTopicsLoading: true });
const setTopicsError = (state, payload) => ({
  ...state,
  areTopicsLoading: false,
  topicsError: payload
});
const setTopics = (state, payload) => ({
  ...state,
  areTopicsLoading: false,
  topics: payload
});
const followUser = (state, payload) => ({
  ...state,
  users:
    state.peopleFilter === FILTER.FOLLOWING
      ? addUserAndSortByName(payload)(state.users)
      : state.users
});
const unfollowUser = (state, payload) => ({
  ...state,
  users:
    state.peopleFilter === FILTER.FOLLOWING
      ? removeUserAndSortByName(payload)(state.users)
      : state.users
});
const removeUser = (state, payload) => ({
  ...state,
  users: removeUserAndSortByName(payload)(state.users)
});

const removeTopic = (state, { topicId }) => ({
  ...state,
  topics: state.topics.filter(x => x.id !== topicId)
});
const deleteTopicSuccess = (state, payload) => removeTopic(state, payload);

const followTopicSuccess = (state, { topic }) => ({
  ...state,
  topics:
    state.topicsFilter === FILTER.FOLLOWING
      ? state.topics.filter(x => x.id === topic.id).length
        ? state.topics
        : [topic, ...state.topics]
      : state.topics
});

const unfollowTopicSuccess = (state, { topicId }) => ({
  ...state,
  topics:
    state.topicsFilter === FILTER.FOLLOWING
      ? state.topics.filter(x => x.id !== topicId)
      : state.topics
});
const saveTopicRequest = state => ({
  ...state,
  isSavingTopic: true
});
const saveTopicFailure = (state, payload) => ({
  ...state,
  error: payload,
  isSavingTopic: false
});
const saveTopicSuccess = (state, payload) => ({
  ...state,
  isSavingTopic: false,
  topics: state.topics.some(({ id }) => id === payload.id)
    ? state.topics
    : addTopicAndSortByName(payload)(state.topics)
});
const updateTopicSuccess = (state, { topic }) => ({
  ...state,
  topics: state.topics.map(x => (x.id === topic.id ? topic : x))
});

const setSubtopicsLoading = state => ({
  ...state,
  subtopics: [],
  areSubTopicsLoading: true
});
const setSubtopicsSuccess = (state, payload) => ({
  ...state,
  subtopics: payload,
  areSubTopicsLoading: false
});

const createSubTopicsWithTitleLoading = state => ({
  ...state,
  isSavingSubTopic: true
});
const createSubTopicsWithTitleSuccess = (state, { subtopic }) => ({
  ...state,
  isSavingSubTopic: false,
  subtopics: sortByTitleCaseInsensitive([subtopic, ...state.subtopics])
});

const setSubTopicsError = (state, payload) => ({
  ...state,
  areSubTopicsLoading: false,
  subTopicsError: payload
});

const menu = (state = initialState, { type, payload }) =>
  switchcaseF({
    [LEFT_MENU_TOGGLE]: toggleMenu,
    [LEFT_MENU_SET_USER_FILTER]: setPeopleFilter,
    [LEFT_MENU_SET_TOPIC_FILTER]: setTopicFilter,
    [LEFT_MENU_GET_USERS_REQUEST]: setUsersLoading,
    [LEFT_MENU_GET_USERS_SUCCESS]: setUsers,
    [LEFT_MENU_GET_USERS_FAILURE]: setUsersError,
    [LEFT_MENU_GET_TOPICS_REQUEST]: setTopicsLoading,
    [LEFT_MENU_GET_TOPICS_SUCCESS]: setTopics,
    [LEFT_MENU_GET_TOPICS_FAILURE]: setTopicsError,
    [LEFT_MENU_FOLLOW_USER]: followUser,
    [LEFT_MENU_UNFOLLOW_USER_FAILURE]: followUser,
    [LEFT_MENU_FOLLOW_USER_FAILURE]: unfollowUser,
    [LEFT_MENU_UNFOLLOW_USER]: unfollowUser,
    [REMOVE_MEMBER_SUCCESS]: removeUser,
    [FOLLOW_TOPIC_SUCCESS]: followTopicSuccess,
    [UNFOLLOW_TOPIC_SUCCESS]: unfollowTopicSuccess,
    [SAVE_TOPIC_REQUEST]: saveTopicRequest,
    [SAVE_TOPIC_FAILURE]: saveTopicFailure,
    [SAVE_TOPIC_SUCCESS]: saveTopicSuccess,
    [UPDATE_TOPIC_SUCCESS]: updateTopicSuccess,
    [DELETE_TOPIC_REQUEST]: deleteTopicSuccess,
    [TOPIC_FOLLOW_SUCCESS]: followTopicSuccess,
    [TOPIC_UNFOLLOW_SUCCESS]: unfollowTopicSuccess,
    [LEFT_MENU_GET_SUBTOPICS_REQUEST]: setSubtopicsLoading,
    [LEFT_MENU_GET_SUBTOPICS_SUCCESS]: setSubtopicsSuccess,
    [CREATE_SUBTOPICS_WITH_TITLE_REQUEST]: createSubTopicsWithTitleLoading,
    [CREATE_SUBTOPICS_WITH_TITLE_SUCCESS]: createSubTopicsWithTitleSuccess,
    [CREATE_SUBTOPICS_WITH_TITLE_FAILURE]: setSubTopicsError,
    [TOGGLE_LEFT_MENU_PEOPLE_PANEL]: togglePeoplePanel,
    [SET_UI_SETTINGS]: setUiSettings,
    [STAR_TOPIC_LEFT_MENU]: star,
    [UNSTAR_TOPIC_SUCCESS]: unstar
  })(state)(type)(state, payload);

export default menu;
