import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';

let _homePageItems = [];
let _homePageItemsPagination = null;
let loadItemsXHR = null;
let loadItemsByPageXHR = null;

const HomePageStore = Object.assign({}, EventEmitter.prototype, {
  loadItems: function(itemType) {
    var _this = this;

    itemType = itemType || 'tips';

    APIRequest.abort(loadItemsXHR);

    loadItemsXHR = APIRequest.get({
      resource: itemType
    });

    loadItemsXHR.done(function(response, status, xhr) {
      _homePageItems = response.data;
      _this.emitEvent(window.LOAD_EVENT);
    }).fail(function(xhr, status, error) {
      if (status !== 'abort') {
        APIRequest.showErrorMessage('Unable to load ' + itemType);
      }
    });
  },

  loadItemsByPage: function(itemType, pageNumber, pageSize, filterType, labelIDs) {
    var _this = this;

    itemType = itemType || 'tips';

    if (parseInt(pageNumber) === 1) {
      _this.clearItems();
    }

    APIRequest.abort(loadItemsByPageXHR);

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

    loadItemsByPageXHR = APIRequest.get({
      resource: itemType,
      data: {
        filter: filter,
        page: {
          number: pageNumber,
          size: pageSize
        }
      }
    });

    loadItemsByPageXHR.done(function(response, status, xhr) {
      $.each(response.data, function(i, item) {
        var currentItem = null;
        $.each(_homePageItems, function(j, homeItem) {
          if (homeItem && parseInt(homeItem.id) === parseInt(item.id)) {
            currentItem = homeItem;
            _homePageItems[j] = item;
          }
        });

        if (!currentItem) {
          _homePageItems.push(item);
        }
      });

      _homePageItemsPagination = response['meta'];
      _this.emitEvent(window.LOAD_EVENT);
    }).fail(function(xhr, status, error) {
      if (status !== 'abort') {
        APIRequest.showErrorMessage('Unable to load ' + itemType);
      }
    });
  },

  getItems: function() {
    return _homePageItems;
  },

  removeItem: function(itemId) {
    _homePageItems = _homePageItems.filter(item => item.id !== itemId);
    this.emitEvent(window.ITEM_REMOVE_EVENT);
  },

  getItemById: id =>
    _homePageItems.find(item => item.attributes.slug === id),

  setItemByIndex: (index, newItem) => {
    const item = _homePageItems[index] || {};
    if (item.id === newItem.id) {
      _homePageItems[index] = newItem;
    }
  },

  clearItems: function() {
    _homePageItems = [];
  },

  getItemsPagination: function() {
    return _homePageItemsPagination;
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

HomePageStore.dispatchToken = AppDispatcher.register(function(payload) {
  var itemType, pageNumber, pageSize, filterType, labelIDs;

  switch(payload.actionType) {
    case 'LOAD_ITEMS':
      itemType = payload.itemType;

      HomePageStore.loadItems(itemType);
      break;

    case 'REMOVE_ITEM':
      HomePageStore.removeItem(payload.itemId);
      break;

    case 'LOAD_ITEMS_BY_PAGE':
      itemType   = payload.itemType;
      pageNumber = payload.pageNumber;
      pageSize   = payload.pageSize;
      filterType = payload.filterType;
      labelIDs   = payload.labelIDs;

      HomePageStore.loadItemsByPage(itemType, pageNumber, pageSize, filterType, labelIDs);
      break;

    default:
    // no op
  }
});

export default HomePageStore;
