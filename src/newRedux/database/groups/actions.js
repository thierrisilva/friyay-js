import actionTypes from './actionEnum';

export const addGroups = ( normalizedGroups ) => ({
  type: actionTypes.add,
  payload: normalizedGroups
});


export const deleteGroup = ( groupId ) => ({
  type: actionTypes.delete,
  payload: groupId
});


export const changeGroup = ( group ) => ({
  type: actionTypes.change,
  payload: {
    [ group.id ]: group
  }
});



export const mergeFollows = ( groupId, followsData ) => ({
  type: actionTypes.mergeFollows,
  payload: {
    [ groupId ]: {
      relationships: followsData
    }
  }
});

export const replaceGroup = ( replaceGroupId, replacementGroup ) => ({
  type: actionTypes.replace,
  payload: {
    replaceId: replaceGroupId,
    replacement: {
      [ replacementGroup.id ]: replacementGroup
    }
  }
});
