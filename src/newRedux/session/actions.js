import actionTypes from './actionEnum';

export const addLabelOrderIdToLabelOrderNewOrChangeConfirmed = ( labelOrderId ) => ({
  type: actionTypes.addLabelOrderIdToLabelOrderNewOrChangeConfirmed,
  payload: labelOrderId
});


export const addPeopleOrderIdToPeopleOrderNewOrChangeConfirmed = ( peopleOrderId ) => ({
  type: actionTypes.addPeopleOrderIdToPeopleOrderNewOrChangeConfirmed,
  payload: peopleOrderId
});


export const addTopicIdToNoSelectedLabelOrderInformed = ( topicId ) => ({
  type: actionTypes.addTopicIdToNoSelectedLabelOrderInformed,
  payload: topicId
});


export const addTopicIdToNoSelectedPeopleOrderInformed = ( topicId ) => ({
  type: actionTypes.addTopicIdToNoSelectedPeopleOrderInformed,
  payload: topicId
});


export const addTopicIdToTopicOrderNewOrChangeConfirmed = ( topicId ) => ({
  type: actionTypes.addTopicIdToTopicOrderNewOrChangeConfirmed,
  payload: topicId
});


export const setLaunchComplete = ( launchComplete ) => ({
  type: actionTypes.setLaunchComplete,
  payload: launchComplete
});
