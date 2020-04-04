import actionTypes from './actionEnum';

export const addLabelOrders = ( normalizedLabelOrders ) => ({
  type: actionTypes.add,
  payload: normalizedLabelOrders
});


export const deleteLabelOrder = ( labelOrderId ) => ({
  type: actionTypes.delete,
  payload: labelOrderId
});


export const changeLabelOrder = ( labelOrder ) => ({
  type: actionTypes.change,
  payload: {
    [ labelOrder.id ]: labelOrder
  }
});


export const replaceLabelOrder = ( replaceLabelOrderId, replacementLabelOrder ) => ({
  type: actionTypes.replace,
  payload: {
    replaceId: replaceLabelOrderId,
    replacement: {
      [ replacementLabelOrder.id ]: replacementLabelOrder
    }
  }
});
