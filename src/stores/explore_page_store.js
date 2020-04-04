import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';

let _explorePageTopics = [];
let _explorePageTopicsPagination = null;
let _explorePageUsers = [];
let _explorePageUsersPagination = null;

const ExplorePageStore = Object.assign({}, EventEmitter.prototype, {
  loadTopicsByPage: function(pageNumber, pageSize) {
    var _this = this;

    if (parseInt(pageNumber) === 1) {
      _this.clearTopics();
    }

    var $loadXHR = APIRequest.get({
      resource: 'topics/explore',
      data: {
        page: {
          number: pageNumber,
          size: pageSize
        }
      }
    });

    $loadXHR
      .done(function(response, status, xhr) {
        for (var i = 0; i < response.data.length; i++) {
          var topic = response.data[i];
          _explorePageTopics.push(topic);
        }
        _explorePageTopicsPagination = response['meta'];
        _this.emitEventWithData(window.TOPICS_LOAD_EVENT, response);
      })
      .fail(function(xhr, status, error) {
        APIRequest.showErrorMessage('Can not load recommended yays');
      });
  },

  followTopic: function(topicID) {
    var _this = this;

    var $followXHR = APIRequest.post({
      resource: 'topics/' + topicID + '/join'
    });

    $followXHR.done(function(response, status, xhr) {
      _this.emitEventWithData(window.TOPIC_FOLLOW_EVENT, response);
    });
  },

  getTopics: function() {
    return _explorePageTopics;
  },

  getTopicsPagination: function() {
    return _explorePageTopicsPagination;
  },

  clearTopics: function() {
    _explorePageTopics = [];
  },

  loadUsersByPage: function(pageNumber, pageSize) {
    var _this = this;

    if (parseInt(pageNumber) === 1) {
      _this.clearUsers();
    }

    var $loadXHR = APIRequest.get({
      resource: 'users/explore',
      data: {
        page: {
          number: pageNumber,
          size: pageSize
        }
      }
    });

    $loadXHR
      .done(function(response, status, xhr) {
        for (var i = 0; i < response.data.length; i++) {
          var user = response.data[i];
          _explorePageUsers.push(user);
        }
        _explorePageUsersPagination = response['meta'];
        _this.emitEventWithData(window.USERS_LOAD_EVENT, response);
      })
      .fail(function(xhr, status, error) {
        APIRequest.showErrorMessage('Can not load recommended friends');
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

  getUsers: function() {
    return _explorePageUsers;
  },

  getUsersPagination: function() {
    return _explorePageUsersPagination;
  },

  clearUsers: function() {
    _explorePageUsers = [];
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
ExplorePageStore.dispatchToken = AppDispatcher.register(function(payload) {
  var topicID, userID, pageNumber, pageSize;

  switch (payload.actionType) {
    case 'LOAD_TOPICS_BY_PAGE':
      pageNumber = payload.pageNumber;
      pageSize = payload.pageSize;
      ExplorePageStore.loadTopicsByPage(pageNumber, pageSize);
      break;

    case 'EXPLORE_FOLLOW_TOPIC':
      topicID = payload.topicID;
      ExplorePageStore.followTopic(topicID);
      break;

    case 'LOAD_USERS_BY_PAGE':
      pageNumber = payload.pageNumber;
      pageSize = payload.pageSize;
      ExplorePageStore.loadUsersByPage(pageNumber, pageSize);
      break;

    case 'FOLLOW_USER':
      userID = payload.userID;
      ExplorePageStore.followUser(userID);
      break;

    default:
    // no op
  }
});

export default ExplorePageStore;
