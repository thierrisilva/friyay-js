import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';

let _topicsColumnTopics = [];

const TopicsColumnStore = Object.assign({}, EventEmitter.prototype, {
  create: function create(title) {
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
        _topicsColumnTopics[response.data.attributes.parent_id].unshift(
          response.data
        );
        _this.emitEvent(window.TOPIC_CREATE_EVENT);
        APIRequest.showSuccessMessage('yay created');
      })
      .fail(function(xhr, status, error) {
        APIRequest.showErrorMessage(xhr.responseJSON.errors.detail);
      });
  },

  loadAll: function() {
    var _this = this;
    var getAllXHR = APIRequest.get({
      resource: 'topics',
      data: {
        page: {
          size: 100
        }
      }
    });

    getAllXHR
      .done(function(response, status, xhr) {
        _topicsColumnTopics[0] = response.data;
        _this.emitEvent(window.TOPIC_LOAD_EVENT);
      })
      .fail(function(xhr, status, error) {
        APIRequest.showErrorMessage('Unable to load yays');
      });
  },

  loadAllByParentID: function(parentID) {
    var _this = this;
    var getAllXHR = APIRequest.get({
      resource: 'topics',
      data: {
        parent_id: parentID,
        page: {
          size: 100
        }
      }
    });

    getAllXHR
      .done(function(response, status, xhr) {
        _topicsColumnTopics[parentID] = response.data;
        _this.emitEvent(window.TOPIC_LOAD_EVENT);
      })
      .fail(function(xhr, status, error) {
        APIRequest.showErrorMessage('Unable to load yays');
      });
  },

  getAll: function() {
    return _topicsColumnTopics;
  },

  getAllByParentID: function(parentID) {
    return _topicsColumnTopics[parentID];
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
TopicsColumnStore.dispatchToken = AppDispatcher.register(function(payload) {
  var title;

  switch (payload.actionType) {
    case 'TOPICS_COLUMN_CREATE_TOPIC':
      title = payload.title.trim();
      if (title) {
        TopicsColumnStore.create(title);
      }
      break;

    default:
    // no op
  }
});

export default TopicsColumnStore;
