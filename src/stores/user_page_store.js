import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';
import { uniq } from 'underscore';

let _pageUser = {};
let _pageUserItems = [];
let _pageUserItemsPagination = null;
let loadUserItemsByPageXHR = null;

const UserPageStore = Object.assign({}, EventEmitter.prototype, {
  loadUser: function(userID) {
    var _this = this;

    var $loadXHR = APIRequest.get({
      resource: 'users/' + userID
    });

    $loadXHR.done(function(response, status, xhr) {
      _pageUser = response.data;
      _this.emitEventWithData(window.USER_LOAD_EVENT, response.data);
    }).fail(function(xhr, status, error) {
      APIRequest.showErrorMessage('Unable to load user');
    });
  },

  loadUserItemsByPage: function(groupID, userID, itemType, pageNumber, pageSize, filterType, labelIDs) {
    var _this = this;

    itemType = itemType || 'tips';

    if (parseInt(pageNumber) === 1) {
      _this.clearUserItems();
    }

    APIRequest.abort(loadUserItemsByPageXHR);

    let filter;
    if (filterType === 'following') {
      filter = {
        topics: 'following',
        labels: labelIDs
      };
    } else {
      filter = {
        type:   filterType,
        labels: labelIDs
      };
    }

    // because ID is actually a slug, we need to parse the integer ID to send to API
    var intGroupID;
    if (groupID) {
      intGroupID = groupID.split('-')[0];
      filter['within_group'] = intGroupID;
    }

    loadUserItemsByPageXHR = APIRequest.get({
      resource: itemType,
      data: {
        group_id: intGroupID,
        user_id: userID,
        filter: filter,
        page: {
          number: pageNumber,
          size: pageSize
        }
      }
    });

    loadUserItemsByPageXHR.done(function(response, status, xhr) {
      $.each(response.data, function(i, userItem) {
        var currentItem = null;
        $.each(_pageUserItems, function(j, pageUserItem) {
          if (pageUserItem && parseInt(pageUserItem.id) === parseInt(userItem.id)) {
            currentItem = pageUserItem;
            _pageUserItems[j] = pageUserItem;
          }
        });

        if (!currentItem) {
          _pageUserItems.push(userItem);
        }
      });

      _pageUserItemsPagination = response['meta'];
      _this.emitEvent(window.ITEMS_LOAD_EVENT);
    }).fail(function(xhr, status, error) {
      if (status !== 'abort') {
        APIRequest.showErrorMessage('Unable to load user ' + itemType);
      }
    });
  },

  followUser: function(userID) {
    var _this = this;

    var $followXHR = APIRequest.post({
      resource: 'users/' + userID + '/follow'
    });

    $followXHR.done(function(response, status, xhr) {
      _this.emitEvent(window.USER_FOLLOW_EVENT);
    });
  },

  unfollowUser: function(userID) {
    var _this = this;

    var $unfollowXHR = APIRequest.post({
      resource: 'users/' + userID + '/unfollow'
    });

    $unfollowXHR.done(function(response, status, xhr) {
      _this.emitEvent(window.USER_UNFOLLOW_EVENT);
    });
  },

  updateUser: function(userID, userFirstName, userLastName, userEmail, userUsername, userPassword,
                       userPasswordConfirmation, userCurrentPassword) {
    var _this = this;

    var $updateXHR = APIRequest.post({
      resource: 'users/' + userID + '/user_profile',
      data: {
        data: {
          attributes: {
            user_attributes: {
              id: userID,
              first_name: userFirstName,
              last_name: userLastName,
              email: userEmail,
              // username: userUsername,
              password: userPassword,
              password_confirmation: userPasswordConfirmation,
              current_password: userCurrentPassword
            }
          }
        }
      }
    });

    $updateXHR.done(function(response, status, xhr) {
      _this.emitEventWithData(window.USER_UPDATE_EVENT, response.data);
      APIRequest.showSuccessMessage('User settings updated');
    }).fail(function(xhr, status, error) {
      APIRequest.showErrorMessage(xhr.responseJSON.errors.detail);
    });
  },

  getUser: function() {
    return _pageUser;
  },

  getUserItems: () =>
    uniq(_pageUserItems, false, user => user.id),

  getItemById: id =>
    _pageUserItems.find(item => item.attributes.slug === id),

  setItemByIndex: (index, newItem) => {
    const item = _pageUserItems[index] || {};
    if (item.id === newItem.id) {
      _pageUserItems[index] = newItem;
    }
  },

  getUserItemsPagination: () => _pageUserItemsPagination,

  // clear loaded user, subusers and items
  clearAll: function() {
    _pageUser = {};
    _pageUserItems = [];
  },

  clearUserItems: function() {
    _pageUserItems = [];
  },

  removeUserItem: function (itemId) {
    _pageUserItems = _pageUserItems.filter(item => item.id !== itemId);
    this.emitEvent(window.ITEM_REMOVE_EVENT);
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

UserPageStore.dispatchToken = AppDispatcher.register(function(payload) {
  var groupID, userID, userFirstName, userLastName, userEmail, userUsername, userPassword, userPasswordConfirmation,
    userCurrentPassword, itemType, pageNumber, pageSize, filterType, labelIDs;

  switch(payload.actionType) {
    case 'LOAD_USER':
      userID   = payload.userID;
      UserPageStore.loadUser(userID);
      break;

    case 'LOAD_USER_ITEMS_BY_PAGE':
      groupID    = payload.groupID;
      userID     = payload.userID;
      itemType   = payload.itemType;
      pageNumber = payload.pageNumber;
      pageSize   = payload.pageSize;
      filterType = payload.filterType;
      labelIDs   = payload.labelIDs;
      UserPageStore.loadUserItemsByPage(groupID, userID, itemType, pageNumber, pageSize, filterType, labelIDs);
      break;

    case 'FOLLOW_USER':
      userID = payload.userID;
      UserPageStore.followUser(userID);
      break;

    case 'UNFOLLOW_USER':
      userID = payload.userID;
      UserPageStore.unfollowUser(userID);
      break;

    case 'REMOVE_USER_ITEM':
      UserPageStore.removeUserItem(payload.itemId);
      break;

    case 'UPDATE_USER':
      userID        = payload.userID;
      userFirstName = payload.userFirstName;
      userLastName  = payload.userLastName;
      userEmail     = payload.userEmail;
      userUsername  = payload.userUsername;
      userPassword  = payload.userPassword;

      userPasswordConfirmation = payload.userPasswordConfirmation;
      userCurrentPassword      = payload.userCurrentPassword;
      UserPageStore.updateUser(userID, userFirstName, userLastName, userEmail, userUsername, userPassword,
        userPasswordConfirmation, userCurrentPassword);
      break;

    default:
    // no op
  }
});

export default UserPageStore;
