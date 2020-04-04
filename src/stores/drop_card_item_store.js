import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';

let _pageItem = null;

const ItemPageStore = Object.assign({}, EventEmitter.prototype, {

  addItemIntoTopic: function(item, fromTopic, toTopic) {
    
    var $postXHR = APIRequest.post({
      resource: `tips/${item.id}/topic_assignments`,
      data: {
        data: {
          topic_id: toTopic.id
        }
      }
    });

    $postXHR.done(function(response, status, xhr) {
      APIRequest.showSuccessMessage(`Card has been added to ${toTopic.attributes.title}`, 5);
    }).fail(function(xhr, status, error) {
      APIRequest.showErrorMessage(`Unable to add card into ${toTopic.attributes.title}`);
    });
  },

  moveItemFromTopic: function(item, fromTopic, toTopic) {
    
    var $postXHR = APIRequest.post({
      resource: `tips/${item.id}/topic_assignments/move`,
      data: {
        data: {
          from_topic: fromTopic.id,
          to_topic: toTopic.id
        }
      }
    });

    $postXHR.done(function(response, status, xhr) {
      APIRequest.showSuccessMessage(`Card has been moved to ${toTopic.attributes.title}`, 5);
    }).fail(function(xhr, status, error) {
      APIRequest.showErrorMessage(`Unable to move card into ${toTopic.attributes.title}`);
    });
  },

  dropItemOptionType: function(item, type, fromTopic, toTopic) {
    this.emitEventWithData(window.DROP_ITEM_OPTION_TOPIC_EVENT, {item, type, fromTopic, toTopic});
  },

  getItem: function() {
    return _pageItem;
  },

  setItem: function (item) {
    _pageItem = item;
    this.emitEventWithData(window.LOAD_EVENT, item);
  },

  emitEvent: function (eventType) {
    this.emit(eventType);
  },

  emitEventWithData: function (eventType, eventData) {
    this.emit(eventType, eventData);
  },

  addEventListener: function (eventType, callback) {
    this.on(eventType, callback);
  },

  removeEventListener: function (eventType, callback) {
    this.removeListener(eventType, callback);
  }
});

ItemPageStore.dispatchToken = AppDispatcher.register(function(payload) {
  switch (payload.actionType) {
    case 'ADD_ITEM_INTO_TOPIC':
      ItemPageStore.addItemIntoTopic(payload.item, payload.fromTopic, payload.toTopic);
      break;
    case 'MOVE_ITEM_FROM_TOPIC':
      ItemPageStore.moveItemFromTopic(payload.item, payload.fromTopic, payload.toTopic);
      break;
    case 'DROP_ITEM_OPTION_TYPE':
      ItemPageStore.dropItemOptionType(payload.item, payload.type, payload.fromTopic, payload.toTopic);
      break;

    default:
    // no op
  }
});

export default ItemPageStore;
