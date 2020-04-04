import actionTypes from './actionEnum';
export const isDeletingTopic = topicId => {
  return {
    type: actionTypes.deletingTopic,
    payload: topicId
  }
};
