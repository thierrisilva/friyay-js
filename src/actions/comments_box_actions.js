import AppDispatcher from '../dispatchers/app_dispatcher';

var CommentsBoxActions = {
  loadComments: function(resourceID, resourceType) {
    AppDispatcher.dispatch({
      actionType: 'LOAD_COMMENTS',
      resourceID: resourceID,
      resourceType: resourceType
    });
  },

  createComment: function(resourceID, resourceType, commentBody) {
    AppDispatcher.dispatch({
      actionType: 'CREATE_COMMENT',
      resourceID: resourceID,
      resourceType: resourceType,
      commentBody: commentBody
    });
  },

  updateComment: function(commentID, commentBody) {
    AppDispatcher.dispatch({
      actionType: 'UPDATE_COMMENT',
      commentID: commentID,
      commentBody: commentBody
    });
  },

  deleteComment: function(commentID) {
    AppDispatcher.dispatch({
      actionType: 'DELETE_COMMENT',
      commentID: commentID
    });
  },

  loadUsers: function() {
    AppDispatcher.dispatch({
      actionType: 'LOAD_USERS'
    });
  }
};

export default CommentsBoxActions;
