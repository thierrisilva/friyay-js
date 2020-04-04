import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from 'Lib/ApiRequest';

let _users = [];
let _usersPagination = null;
import { uniq } from 'underscore';

const UsersPageStore = Object.assign({}, EventEmitter.prototype, {
  loadUsersByPage: function(groupID, pageNumber, pageSize, filterType='all') {
    var _this = this;

    if (parseInt(pageNumber) === 1) {
      _this.clearUsers();
    }

    var filter = {};

    // because groupID is actually a slug, we need to parse the integer ID to send to API
    var intGroupID;
    if (groupID) {
      intGroupID = groupID.split('-')[0];
      filter['within_group'] = intGroupID;
    }

    var $loadXHR = APIRequest.get({
      resource: `users?with_details=true&filter[users]=${filterType}`,
      data: {
        page: {
          number: pageNumber,
          size: pageSize
        },
        filter
      }
    });

    $loadXHR.done(function(response, status, xhr){
      for (var i = 0; i < response.data.length; i++) {
        var user = response.data[i];
        _users.push(user);
      }
      _usersPagination = response['meta'];
      _this.emitEventWithData(window.PEOPLE_LOAD_EVENT, response);
    }).fail(function(xhr, status, error) {
      APIRequest.showErrorMessage('Can not load recommended user');
    });
  },

  followUser: function(userID) {
    var _this = this;

    var $followXHR = APIRequest.post({
      resource: 'users/' + userID + '/follow'
    });

    $followXHR.done(function(response, status, xhr) {
      _this.emitEventWithData(window.USER_FOLLOW_EVENT, response);
    });
  },

  unfollowUser(userID) {
    let _this = this;

    let $unfollowXHR = APIRequest.post({
      resource: 'users/' + userID + '/unfollow'
    });

    $unfollowXHR.done((response, status, xhr) => {
      _this.emitEventWithData(window.USER_UNFOLLOW_EVENT, response);
    });
  },

  getUsers: () =>
    uniq(_users, false, user => user.id),

  getUsersPagination: () => _usersPagination,

  removeUser: userId => {
    const user = _users.find(({ id }) => id === userId);

    if (user !== undefined) {
      _users = _users.filter(({ id }) => id !== userId);
    }
  },

  clearUsers: function() {
    _users = [];
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
UsersPageStore.dispatchToken = AppDispatcher.register(function(payload) {
  var userID, pageNumber, pageSize, filterType, groupID;

  switch(payload.actionType) {
    case 'LOAD_PEOPLE_ITEMS_BY_PAGE':
      pageNumber = payload.pageNumber;
      pageSize   = payload.pageSize;
      filterType = payload.filterType;
      groupID = payload.groupID;
      UsersPageStore.loadUsersByPage(groupID, pageNumber, pageSize, filterType);
      break;

    case 'FOLLOW_USER':
      userID = payload.userID;
      UsersPageStore.followUser(userID);
      break;

    case 'UNFOLLOW_USER':
      userID = payload.userID;
      UsersPageStore.unfollowUser(userID);
      break;

    default:
    // no op
  }
});

export default UsersPageStore;
