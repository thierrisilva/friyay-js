import actionTypes from './actionEnum';

export const addTopicOrders = ( normalizedTopicOrders ) => ({
  type: actionTypes.add,
  payload: normalizedTopicOrders
});


export const deleteTopicOrder = ( topicOrderId ) => ({
  type: actionTypes.delete,
  payload: topicOrderId
});


export const changeTopicOrder = ( topicOrder ) => ({
  type: actionTypes.change,
  payload: {
    [ topicOrder.id ]: topicOrder
  }
});


export const replaceTopicOrder = ( replaceTopicOrderId, replacementTopicOrder ) => ({
  type: actionTypes.replace,
  payload: {
    replaceId: replaceTopicOrderId,
    replacement: {
      [ replacementTopicOrder.id ]: replacementTopicOrder
    }
  }
});
