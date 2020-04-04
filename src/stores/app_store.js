import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';

const AppStore = Object.assign({}, EventEmitter.prototype, {
  loadCurrentUser: function() {
    var _this = this;

    var $loadXHR = APIRequest.get({
      resource: 'me'
    });

    $loadXHR.done(function(response, status, xhr) {
      _this.emitEventWithData(window.USER_LOAD_EVENT, response.data);
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
AppStore.dispatchToken = AppDispatcher.register(function(payload) {
  switch(payload.actionType) {
    case 'LOAD_CURRENT_USER':
      AppStore.loadCurrentUser();
      break;

    default:
    // no op
  }
});

export default AppStore;