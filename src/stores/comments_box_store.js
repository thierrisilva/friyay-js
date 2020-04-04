import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';
import analytics from '../lib/analytics';

let _boxComments = [];
let _commentBoxUsers = [];

const CommentsBoxStore = Object.assign({}, EventEmitter.prototype, {
  loadComments: function(resourceID, resourceType) {
    var _this = this;

    var $loadXHR = APIRequest.get({
      resource: resourceType + '/' + resourceID + '/comments'
    });

    $loadXHR.done(function(response, status, xhr) {
      _boxComments = response.data;
      _this.emitEventWithData(window.COMMENTS_LOAD_EVENT, response);
    }).fail(function(xhr, status, error) {

    });
  },

  createComment: function(resourceID, resourceType, commentBody) {
    var _this = this;

    var $createXHR = APIRequest.post({
      resource: resourceType + '/' + resourceID + '/comments',
      data: {
        data: {
          attributes: {
            body: commentBody
          }
        }
      }
    });

    $createXHR.done(function(response, status, xhr) {
      _this.emitEventWithData(window.COMMENT_CREATE_EVENT, response);
      APIRequest.showSuccessMessage('Comment added.');
      analytics.track('Comment Created', { commented_on: resourceType + '-' + resourceID });
    }).fail(function(xhr, status, error) {
      APIRequest.showErrorMessage('Failed to add comment.');
    });
  },

  updateComment: function(commentID, commentBody) {
    var _this = this;

    var $updateXHR = APIRequest.patch({
      resource: 'comments/' + commentID,
      data: {
        data: {
          attributes: {
            body: commentBody
          }
        }
      }
    });

    $updateXHR.done(function(response, status, xhr) {
      _this.emitEventWithData(window.COMMENT_UPDATE_EVENT, response);
      APIRequest.showSuccessMessage('Comment edited.');
    }).fail(function(xhr, status, error) {
      APIRequest.showErrorMessage('Failed to edit comment.');
    });
  },

  deleteComment: function(commentID) {
    var _this = this;

    var $deleteXHR = APIRequest.delete({
      resource: 'comments/' + commentID
    });

    $deleteXHR.done(function(response, status, xhr) {
      _this.emitEvent(window.COMMENT_DESTROY_EVENT);
      APIRequest.showSuccessMessage('Comment deleted.');
    }).fail(function(xhr, status, error) {
      APIRequest.showErrorMessage('Failed to delete comment.');
    });
  },

  getComments: function() {
    return _boxComments;
  },

  clearComments: function() {
    _boxComments = [];
  },

  loadUsers: function() {
    var _this = this;

    var $loadXHR = APIRequest.get({
      resource: 'users',
      data: {
        page: {
          size: 999
        }
      }
    });

    $loadXHR.done(function(response, status, xhr){
      _commentBoxUsers = response.data;
      _this.emitEvent(window.USERS_LOAD_EVENT);
    }).fail(function(xhr, status, error) {
      APIRequest.showErrorMessage('Can not load following users');
    });
  },

  getUsers: function() {
    return _commentBoxUsers;
  },

  emitEvent: function(eventType) {
    this.emit(eventType);
  },

  emitEventWithData: function(eventType, eventData) {
    this.emit(eventType, eventData);
  },

  addEventListener: function(eventType, callback) {
    this.on(eventType, callback);
  },

  removeEventListener: function(eventType, callback) {
    this.removeListener(eventType, callback);
  }
});

CommentsBoxStore.dispatchToken = AppDispatcher.register(function(payload) {
  var resourceID, resourceType, commentID, commentBody;

  switch(payload.actionType) {
    case 'LOAD_COMMENTS':
      resourceID   = payload.resourceID;
      resourceType = payload.resourceType;
      CommentsBoxStore.loadComments(resourceID, resourceType);
      break;

    case 'CREATE_COMMENT':
      resourceID   = payload.resourceID;
      resourceType = payload.resourceType;
      commentBody  = payload.commentBody;
      CommentsBoxStore.createComment(resourceID, resourceType, commentBody);
      break;

    case 'UPDATE_COMMENT':
      commentID   = payload.commentID;
      commentBody = payload.commentBody;
      CommentsBoxStore.updateComment(commentID, commentBody);
      break;

    case 'DELETE_COMMENT':
      commentID = payload.commentID;
      CommentsBoxStore.deleteComment(commentID);
      break;

    case 'LOAD_USERS':
      CommentsBoxStore.loadUsers();
      break;

    default:
    // no op
  }
});

export default CommentsBoxStore;
