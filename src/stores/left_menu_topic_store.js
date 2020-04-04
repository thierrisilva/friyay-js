import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';

let _leftMenuTopics = [];
let loadLeftMenuTopicsXHR = null;

const LeftMenuTopicStore = Object.assign({}, EventEmitter.prototype, {
  create: function create(title, groupID) {
    var _this = this;

    var group_followers = {};

    // because groupID is actually a slug, we need to parse the integer ID to send to API
    var intGroupID;
    if (groupID) {
      intGroupID = groupID.split('-')[0];
      group_followers = {
        data: [
          {
            id: intGroupID,
            type: 'groups'
          }
        ]
      };
    }

    var createXHR = APIRequest.post({
      resource: 'topics',
      data: {
        data: {
          type: 'topics',
          attributes: {
            title: title
          },
          relationships: {
            group_followers: group_followers
          }
        }
      }
    });

    createXHR
      .done(function(response, status, xhr) {
        _leftMenuTopics.unshift(response.data);
        _this.emitEventWithData(window.TOPIC_CREATE_EVENT, response);

        if (response.meta && response.meta.message) {
          APIRequest.showSuccessMessage(response.meta.message);
        } else {
          APIRequest.showSuccessMessage('yay created');
        }
      })
      .fail(function(xhr, status, error) {
        const { errors } = xhr.responseJSON;
        APIRequest.showErrorMessage(errors.title);
      });
  },

  loadAll: function(groupID, filterType, userID) {
    var _this = this;

    var filter = {};

    // because groupID is actually a slug, we need to parse the integer ID to send to API
    var intGroupID;
    if (groupID) {
      intGroupID = groupID.split('-')[0];
      filter['within_group'] = intGroupID;
    }

    APIRequest.abort(loadLeftMenuTopicsXHR);
    let url = 'topics/?with_followers=false&search_all_hives=true';
    const baseUrl = 'topics?filter';
    switch (filterType) {
      case 'following':
        url = `${baseUrl}[followed_by_user]=${userID}`;
        break;
      case 'created':
        url = `${baseUrl}[created_by]=${userID}`;
        break;
      case 'shared':
        url = `${baseUrl}[shared_with]=${userID}`;
        break;
      case 'starred':
        url = `${baseUrl}[type]=starred`;
        break;
    }
    loadLeftMenuTopicsXHR = APIRequest.get({
      resource: url,
      data: {
        page: {
          size: 999
        },
        filter: filter
      }
    });

    loadLeftMenuTopicsXHR
      .done(function(response, status, xhr) {
        _leftMenuTopics = response.data;
        _this.emitEvent(window.TOPIC_LOAD_EVENT);
      })
      .fail(function(xhr, status, error) {
        if (status !== 'abort') {
          APIRequest.showErrorMessage('Unable to load yays');
        }
      });
  },

  getAll: function() {
    return _leftMenuTopics;
  },

  starTopic(topicID) {
    let _this = this;

    let $followXHR = APIRequest.post({
      resource: 'topics/' + topicID + '/star'
    });

    $followXHR.done((response, status, xhr) => {
      _this.emitEventWithData(window.LEFT_MENU_STAR_HIVE, response);
    });
  },

  unstarTopic(topicID) {
    let _this = this;

    let $unfollowXHR = APIRequest.post({
      resource: 'topics/' + topicID + '/unstar'
    });

    $unfollowXHR.done((response, status, xhr) => {
      _this.emitEventWithData(window.LEFT_MENU_UNSTAR_HIVE, response);
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
LeftMenuTopicStore.dispatchToken = AppDispatcher.register(function(payload) {
  var title, groupID, filterType, userID, topicID;

  switch (payload.actionType) {
    case 'LEFT_MENU_TOPIC_LOAD_ALL':
      groupID = payload.groupID;
      LeftMenuTopicStore.loadAll(groupID, payload.filterType, payload.userID);
      break;

    case 'LEFT_MENU_TOPIC_CREATE':
      title = payload.title.trim();
      groupID = payload.groupID;
      if (title) {
        LeftMenuTopicStore.create(title, groupID);
      }
      break;

    case 'LEFT_MENU_STAR_HIVE':
      topicID = payload.topicID;
      LeftMenuTopicStore.starTopic(topicID);
      break;

    case 'LEFT_MENU_UNSTAR_HIVE':
      topicID = payload.topicID;
      LeftMenuTopicStore.unstarTopic(topicID);
      break;

    default:
    // no op
  }
});

export default LeftMenuTopicStore;
