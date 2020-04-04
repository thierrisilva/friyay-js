import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';

let _pageItem = null;

const ItemPageStore = Object.assign({}, EventEmitter.prototype, {
  loadItem: function (itemID, itemType) {
    var _this = this;

    var $loadXHR = APIRequest.get({
      resource: itemType + '/' + itemID
    });

    $loadXHR.done(function ({ data }, status, xhr) {
      _pageItem = data;
      _this.emitEventWithData(window.LOAD_EVENT, data);
    }).fail(function (xhr, status, error) {
      _this.emitEvent(window.ITEM_LOAD_FAILED);
      APIRequest.showErrorMessage(`${error}: Unable to load ${itemType}`);
    });
  },

  likeItem: function (itemID, itemType) {
    var _this = this;

    var $loadXHR = APIRequest.post({
      resource: itemType + '/' + itemID + '/like'
    });

    $loadXHR.done(function (response, status, xhr) {
      _this.emitEventWithData(window.ITEM_LIKE_EVENT, response);
    });
  },

  unlikeItem: function (itemID, itemType) {
    var _this = this;

    var $loadXHR = APIRequest.post({
      resource: itemType + '/' + itemID + '/unlike'
    });

    $loadXHR.done(function (response, status, xhr) {
      _this.emitEventWithData(window.ITEM_UNLIKE_EVENT, response);
    });
  },

  starItem: function (itemID, itemType) {
    var _this = this;

    var $loadXHR = APIRequest.post({
      resource: itemType + '/' + itemID + '/star'
    });

    $loadXHR.done(function (response, status, xhr) {
      _this.emitEventWithData(window.ITEM_STAR_EVENT, response);
    });
  },

  unstarItem: function (itemID, itemType) {
    var _this = this;

    var $loadXHR = APIRequest.post({
      resource: itemType + '/' + itemID + '/unstar'
    });

    $loadXHR.done(function (response, status, xhr) {
      _this.emitEventWithData(window.ITEM_UNSTAR_EVENT, response);
    });
  },

  deleteItem: function (itemID, itemType, disableListener) {
    var _this = this;

    var $deleteXHR = APIRequest.delete({
      resource: itemType + '/' + itemID
    });

    $deleteXHR.done(function (response, status, xhr) {
      _pageItem = null;
      if (!disableListener) {
        _this.emitEventWithData(window.DESTROY_EVENT, itemID);
      }
      APIRequest.showSuccessMessage('Item deleted');
    }).fail(function (xhr, status, error) {
      APIRequest.showErrorMessage('Unable to delete item');
    });
  },

  archiveItem: function(itemId, itemType, disableListener) {
    var _this = this;
    var $archiveXHR = APIRequest.post({ 
      resource: itemType + '/' + itemId + '/' + 'archive',
    });
    $archiveXHR.done(function (response, status, xhr) {
      _pageItem = null;
      if (!disableListener) {
        _this.emitEvent(window.ITEM_ARCHIVE_EVENT);
      }
      APIRequest.showSuccessMessage('Item archived');
    }).fail(function (xhr, status, error) {
      APIRequest.showErrorMessage('Unable to archive item');
    });
  },

  deleteItemLocal: function (itemID) {
    this.emitEventWithData(window.DELETE_ITEM_LOCAL, itemID);
  },

  reorderTopicItem: function(itemID, precedingTipsIDs, topicID) {
        
    var $postXHR = APIRequest.post({
      resource: `tips/${itemID}/reorder`,
      data: {
        data: {
          topic_id: topicID,
          preceding_tips: precedingTipsIDs
        }
      }
    });

    $postXHR.done(function(response, status, xhr) {
      APIRequest.showSuccessMessage('Card position changed');
    }).fail(function(xhr, status, error) {
      APIRequest.showErrorMessage('Unable to change card position');
    });
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
  var itemID, itemType, disableListener, topicID, precedingTipsIDs;

  switch (payload.actionType) {
    case 'LOAD_ITEM':
      itemID = payload.itemID;
      itemType = payload.itemType;
      ItemPageStore.loadItem(itemID, itemType);
      break;

    case 'LIKE_ITEM':
      itemID = payload.itemID;
      itemType = payload.itemType;
      ItemPageStore.likeItem(itemID, itemType);
      break;

    case 'UNLIKE_ITEM':
      itemID = payload.itemID;
      itemType = payload.itemType;
      ItemPageStore.unlikeItem(itemID, itemType);
      break;

    case 'STAR_ITEM':
      itemID = payload.itemID;
      itemType = payload.itemType;
      ItemPageStore.starItem(itemID, itemType);
      break;

    case 'UNSTAR_ITEM':
      itemID = payload.itemID;
      itemType = payload.itemType;
      ItemPageStore.unstarItem(itemID, itemType);
      break;

    case 'DELETE_ITEM':
      itemID = payload.itemID;
      itemType = payload.itemType;
      disableListener = payload.disableListener;
      ItemPageStore.deleteItem(itemID, itemType, disableListener);
      break;

    case 'ARCHIVE_ITEM':
      itemID = payload.itemID;
      itemType = payload.itemType;
      disableListener = payload.disableListener;
      ItemPageStore.archiveItem(itemID, itemType, disableListener);
      break;

    case 'DELETE_ITEM_LOCAL':
      itemID = payload.itemID;
      ItemPageStore.deleteItemLocal(itemID);
      break;

    case 'REORDER_TOPIC_ITEM':
      itemID   = payload.itemID;
      precedingTipsIDs   = payload.precedingTipsIDs;
      topicID   = payload.topicID;
      ItemPageStore.reorderTopicItem(itemID, precedingTipsIDs, topicID);
      break;
    case 'SET_ITEM_LOCAL':
      ItemPageStore.setItem(payload.item);
      break;
      
    default:
    // no op
  }
});

export default ItemPageStore;
