import actionTypes from './actionEnum';

export const addLabelCategories = ( normalizedLabelCategories ) => ({
  type: actionTypes.add,
  payload: normalizedLabelCategories
});


export const deleteLabelCategory = ( labelCategoryId ) => ({
  type: actionTypes.delete,
  payload: labelCategoryId
});


export const changeLabelCategory = ( labelCategory ) => ({
  type: actionTypes.change,
  payload: {
    [ labelCategory.id ]: labelCategory
  }
});


export const replaceLabelCategory = ( replaceLabelCategoryId, replacementLabelCategory ) => ({
  type: actionTypes.replace,
  payload: {
    replaceId: replaceLabelCategoryId,
    replacement: {
      [ replacementLabelCategory.id ]: replacementLabelCategory
    }
  }
});
