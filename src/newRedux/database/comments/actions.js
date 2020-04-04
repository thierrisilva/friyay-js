import actionTypes from './actionEnum';

export const addComments = ( normalizedComments ) => ({
  type: actionTypes.add,
  payload: normalizedComments
});


export const deleteComment = ( commentId ) => ({
  type: actionTypes.delete,
  payload: commentId
});


export const changeComment = ( comment ) => ({
  type: actionTypes.change,
  payload: {
    [ comment.id ]: comment
  }
});


export const changeComments = ( normalizedComments ) => ({
  type: actionTypes.changeMany,
  payload: normalizedComments
});


export const replaceComment = ( replaceCommentId, replacementComment ) => ({
  type: actionTypes.replace,
  payload: {
    replaceId: replaceCommentId,
    replacement: {
      [ replacementComment.id ]: replacementComment
    }
  }
});
