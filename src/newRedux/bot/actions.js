import actionTypes from './actionEnum';

export const fetchBot = (content) => ({
  type: actionTypes.get,
  payload: content
});

export const setCommandResponse = (payload) => ({
  type: actionTypes.setCommandResponse,
  payload,
});

export const fetchUsersAndTopics = (usersAndTopics) => ({
  type: actionTypes.getUsersAndTopics,
  payload: usersAndTopics
});

export const setLiveNotification = (payload) => ({
  type: actionTypes.setLiveNotification,
  payload: payload
});
