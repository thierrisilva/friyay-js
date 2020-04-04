import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';

let _topics = [];
let _topicsPagination = null;

const TopicsPageStore = Object.assign({}, EventEmitter.prototype, {
  _handleResponse: function(response, status, xhr) {
    for (let topic of response.data) {
      _topics.push(topic);
    }
    _topicsPagination = response['meta'];
    this.emitEventWithData(window.TOPICS_LOAD_EVENT, response);
  },
  _handleErrorResponse: function(xhr, status, error) {
    APIRequest.showErrorMessage('Can not load recommended yays');
  },
  loadTopicsByPage: function(pageNumber, pageSize) {
    var _this = this;

    if (parseInt(pageNumber) === 1) {
      _this.clearTopics();
    }

    var $loadXHR = APIRequest.get({
      resource: 'topics?with_details=true',
      data: {
        with_followers: true,
        search_all_hives: true,
        page: {
          number: pageNumber,
          size: pageSize
        }
      }
    });

    $loadXHR
      .done(this._handleResponse.bind(this))
      .fail(this._handleErrorResponse);
  },

  loadTopicsByUserFollowed: function(
    userID,
    isFollowing,
    pageNumber,
    pageSize
  ) {
    var _this = this;

    if (parseInt(pageNumber) === 1) {
      _this.clearTopics();
    }

    let resourceUrl = '/topics/?with_details=true&filter';

    if (isFollowing) {
      resourceUrl = `${resourceUrl}[followed_by_user]=${userID}`;
    } else {
      resourceUrl = `${resourceUrl}[not_followed_by_user]=${userID}`;
    }

    var $loadXHR = APIRequest.get({
      resource: resourceUrl,
      data: {
        page: {
          number: pageNumber,
          size: pageSize
        }
      }
    });

    $loadXHR
      .done(this._handleResponse.bind(this))
      .fail(this._handleErrorResponse);
  },

  createTopic: function create(title) {
    var _this = this;
    var createXHR = APIRequest.post({
      resource: 'topics',
      data: {
        data: {
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
        APIRequest.showSuccessMessage('yay created');
      })
      .fail(function(xhr, status, error) {
        APIRequest.showErrorMessage(xhr.responseJSON.errors.detail);
      });
  },

  followTopic: function(topicID) {
    var _this = this;

    var $followXHR = APIRequest.post({
      resource: 'topics/' + topicID + '/join'
    });

    $followXHR.done(function(response, status, xhr) {
      _this.emitEventWithData(window.HIVE_FOLLOW_EVENT, response);
    });
  },

  unfollowTopic(topicID) {
    let _this = this;

    let $unfollowXHR = APIRequest.post({
      resource: 'topics/' + topicID + '/leave'
    });

    $unfollowXHR.done((response, status, xhr) => {
      _this.emitEventWithData(window.HIVE_UNFOLLOW_EVENT, response);
    });
  },

  getTopics: function() {
    return _topics;
  },

  getTopicsPagination: function() {
    return _topicsPagination;
  },

  clearTopics: function() {
    _topics = [];
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
TopicsPageStore.dispatchToken = AppDispatcher.register(function(payload) {
  var topicID, userID, pageNumber, pageSize, title, isFollowing;

  switch (payload.actionType) {
    case 'LOAD_TOPICS_BY_PAGE':
      pageNumber = payload.pageNumber;
      pageSize = payload.pageSize;
      TopicsPageStore.loadTopicsByPage(pageNumber, pageSize);
      break;

    case 'LOAD_TOPICS_BY_USER_FOLLOWED':
      pageNumber = payload.pageNumber;
      pageSize = payload.pageSize;
      userID = payload.userID;
      isFollowing = payload.isFollowing;
      TopicsPageStore.loadTopicsByUserFollowed(
        userID,
        isFollowing,
        pageNumber,
        pageSize
      );
      break;

    case 'FOLLOW_HIVE':
      topicID = payload.topicID;
      TopicsPageStore.followTopic(topicID);
      break;

    case 'UNFOLLOW_HIVE':
      topicID = payload.topicID;
      TopicsPageStore.unfollowTopic(topicID);
      break;

    default:
    // no op
  }
});

export default TopicsPageStore;
