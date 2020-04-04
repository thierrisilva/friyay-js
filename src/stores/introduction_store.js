import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';

const IntroductionStore = Object.assign({}, EventEmitter.prototype, {
  findOrCreate: function create(title) {
    var _this = this;

    var createXHR = APIRequest.post({
      resource: 'topics',
      data: {
        data: {
          join_if_existed: true,
          type: 'topics',
          attributes: {
            title: title
          }
        }
      }
    });

    createXHR
      .done(function(response, status, xhr) {
        _this.emitEventWithData(window.TOPIC_CREATE_EVENT, response);

        if (response.meta && response.meta.message) {
          APIRequest.showSuccessMessage(response.meta.message);
        } else {
          APIRequest.showSuccessMessage('yay created');
        }
      })
      .fail(function(xhr, status, error) {
        if (error === 'Conflict' && xhr.responseJSON.errors.detail) {
          _this.emitEventWithData(
            window.TOPIC_CREATE_CONFLICT_EVENT,
            xhr.responseJSON.errors.detail.resource_slug
          );
        } else {
          APIRequest.showErrorMessage(xhr.responseJSON.errors.title);
        }
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
IntroductionStore.dispatchToken = AppDispatcher.register(function(payload) {
  var title;

  switch (payload.actionType) {
    case 'INTRODUCTION_TOPIC_FIND_OR_CREATE':
      title = payload.title.trim();
      if (title) {
        IntroductionStore.findOrCreate(title);
      }
      break;

    default:
    // no op
  }
});

export default IntroductionStore;
