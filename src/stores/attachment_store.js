import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';

const AttachmentStore = Object.assign({}, EventEmitter.prototype, {
  loadAttachments: function(attachmentIDs) {
    var _this = this;

    var $loadXHR = APIRequest.get({
      resource: 'attachments',
      data: {
        ids: attachmentIDs
      }
    });

    $loadXHR.done(function(response, status, xhr) {
      _this.emitEventWithData(window.ATTACHMENTS_LOAD_EVENT, response.data);
    });
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

// Register callback to handle all updates
AttachmentStore.dispatchToken = AppDispatcher.register(function(payload) {
  var attachmentIDs;

  switch(payload.actionType) {
    case 'LOAD_ATTACHMENTS':
      attachmentIDs = payload.attachmentIDs;
      AttachmentStore.loadAttachments(attachmentIDs);
      break;

    default:
    // no op
  }
});

export default AttachmentStore;
