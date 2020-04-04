import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';

let _menuGroups = [];
let loadGroupsXHR = null;

const GroupMenuStore = Object.assign({}, EventEmitter.prototype, {
  loadGroups() {
    let _this = this;

    APIRequest.abort(loadGroupsXHR);

    loadGroupsXHR = APIRequest.get({
      resource: 'groups'
    });

    loadGroupsXHR.done(function(response, status, xhr) {
      _menuGroups = response.data;
      _this.emitEventWithData(window.GROUPS_LOAD_EVENT, response);
    }).fail(function(xhr, status, error) {
      if (status !== 'abort') {
        APIRequest.showErrorMessage('Unable to load teams');
      }
    });
  },

  getGroups() {
    return _menuGroups;
  },

  clearGroups() {
    _menuGroups = [];
  },

  emitEvent(eventType) {
    this.emit(eventType);
  },

  emitEventWithData(eventType, eventData) {
    this.emit(eventType, eventData);
  },

  addEventListener(eventType, callback) {
    this.on(eventType, callback);
  },

  removeEventListener(eventType, callback) {
    this.removeListener(eventType, callback);
  }
});

// Register callback to handle all updates
GroupMenuStore.dispatchToken = AppDispatcher.register(function(payload) {
  switch(payload.actionType) {
    case 'LOAD_GROUPS':
      GroupMenuStore.loadGroups();
      break;

    default:
    // no op
  }
});

export default GroupMenuStore;
