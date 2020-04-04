import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';

const ViewsStore = Object.assign({}, EventEmitter.prototype, {
  loadViews: function() {
    APIRequest.get({
      resource: 'views'
    })
      .done((response, status, xhr) => {
        this.emitEventWithData(window.VIEWS_LOAD_EVENT, response);
      })
      .fail(function(xhr, status, error) {
        APIRequest.showErrorMessage('Can not load views');
      });
  },

  updateTopicView: function(topicID, viewID) {
    APIRequest.patch({
      resource: 'topics/' + topicID,
      data: {
        data: {
          type: 'topics',
          attributes: {
            default_view_id: viewID
          }
        }
      }
    })
      .done((response, status, xhr) => {})
      .fail(function(xhr, status, error) {
        APIRequest.showErrorMessage('Can not update yay view');
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
ViewsStore.dispatchToken = AppDispatcher.register(function(payload) {
  switch (payload.actionType) {
    case 'VIEWS_LOAD':
      ViewsStore.loadViews();
      break;

    case 'TOPIC_VIEW_CHANGE':
      ViewsStore.updateTopicView(payload.topicID, payload.viewID);
      break;

    default:
    // no op
  }
});

export default ViewsStore;
