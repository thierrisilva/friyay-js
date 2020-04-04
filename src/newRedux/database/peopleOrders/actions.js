import actionTypes from './actionEnum';

export const addPeopleOrders = ( normalizedPeopleOrders ) => ({
  type: actionTypes.add,
  payload: normalizedPeopleOrders
});


export const deletePeopleOrder = ( peopleOrderId ) => ({
  type: actionTypes.delete,
  payload: peopleOrderId
});


export const changePeopleOrder = ( peopleOrder ) => ({
  type: actionTypes.change,
  payload: {
    [ peopleOrder.id ]: peopleOrder
  }
});


export const replacePeopleOrder = ( replacePeopleOrderId, replacementPeopleOrder ) => ({
  type: actionTypes.replace,
  payload: {
    replaceId: replacePeopleOrderId,
    replacement: {
      [ replacementPeopleOrder.id ]: replacementPeopleOrder
    }
  }
});
