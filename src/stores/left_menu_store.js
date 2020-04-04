import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';
import { uniq } from 'underscore';

let _leftMenuUsers = [];
let loadLeftMenuUsersXHR = null;

const LeftMenuStore = Object.assign({}, EventEmitter.prototype, {
  open: function() {
    localStorage.isLeftMenuActive = true;
    this.emitEvent(window.TOGGLE_EVENT);
  },

  close: function() {
    localStorage.isLeftMenuActive = false;
    this.emitEvent(window.TOGGLE_EVENT);
  },

  isLeftMenuActive: function() {
    localStorage.isLeftMenuActive = (localStorage.isLeftMenuActive === undefined) ?
      true : localStorage.isLeftMenuActive;

    return JSON.parse(localStorage.isLeftMenuActive);
  },

  loadUsers: function(groupID, filterType='all') {
    var filter = {};

    // because groupID is actually a slug, we need to parse the integer ID to send to API
    var intGroupID;
    if (groupID) {
      intGroupID = groupID.split('-')[0];
      filter['within_group'] = intGroupID;
    }

    APIRequest.abort(loadLeftMenuUsersXHR);

    let url = `users?filter[users]=${filterType}`;

    loadLeftMenuUsersXHR = APIRequest.get({
      resource: url,
      data: {
        page: {
          size: 999
        },
        filter: filter
      }
    });

    loadLeftMenuUsersXHR.done(response => {
      _leftMenuUsers = response.data;
      this.emitEvent(window.USERS_LOAD_EVENT);
    }).fail((xhr, status) => {
      if (status !== 'abort') {
        APIRequest.showErrorMessage('Can not load following users');
      }
    });
  },

  getUsers: () => uniq(_leftMenuUsers, false, user => user.id),

  removeUser: userId => {
    const user = _leftMenuUsers.find(({ id }) => id === userId);

    if (user !== undefined) {
      _leftMenuUsers = _leftMenuUsers.filter(({ id }) => id !== userId);
    }
  },

  clearUsers: function() {
    _leftMenuUsers = [];
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
LeftMenuStore.dispatchToken = AppDispatcher.register(function(payload) {
  var groupID;

  switch(payload.actionType) {
    case 'LEFT_MENU_OPEN':
      LeftMenuStore.open();
      break;

    case 'LEFT_MENU_CLOSE':
      LeftMenuStore.close();
      break;

    case 'LOAD_USERS':
      groupID = payload.groupID;
      LeftMenuStore.loadUsers(groupID, payload.filterType);
      break;

    default:
      // no op
  }
});

export default LeftMenuStore;
