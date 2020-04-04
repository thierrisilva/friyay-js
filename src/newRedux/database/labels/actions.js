import actionTypes from './actionEnum';

export const addLabels = ( normalizedLabels ) => ({
  type: actionTypes.add,
  payload: normalizedLabels
});


export const deleteLabel = ( labelId ) => ({
  type: actionTypes.delete,
  payload: labelId
});


export const changeLabel = ( label ) => ({
  type: actionTypes.change,
  payload: {
    [ label.id ]: label
  }
});


export const replaceLabel = ( replaceLabelId, replacementLabel ) => ({
  type: actionTypes.replace,
  payload: {
    replaceId: replaceLabelId,
    replacement: {
      [ replacementLabel.id ]: replacementLabel
    }
  }
});
