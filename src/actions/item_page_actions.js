import AppDispatcher from '../dispatchers/app_dispatcher';

var ItemPageActions = {
  loadItem: function(itemID, itemType) {
    AppDispatcher.dispatch({
      actionType: 'LOAD_ITEM',
      itemID: itemID,
      itemType: itemType
    });
  },

  likeItem: function(itemID, itemType) {
    AppDispatcher.dispatch({
      actionType: 'LIKE_ITEM',
      itemID: itemID,
      itemType: itemType
    });
  },

  unlikeItem: function(itemID, itemType) {
    AppDispatcher.dispatch({
      actionType: 'UNLIKE_ITEM',
      itemID: itemID,
      itemType: itemType
    });
  },

  starItem: function(itemID, itemType) {
    AppDispatcher.dispatch({
      actionType: 'STAR_ITEM',
      itemID: itemID,
      itemType: itemType
    });
  },

  unstarItem: function(itemID, itemType) {
    AppDispatcher.dispatch({
      actionType: 'UNSTAR_ITEM',
      itemID: itemID,
      itemType: itemType
    });
  },

  deleteItem: function(itemID, itemType, disableListener) {
    AppDispatcher.dispatch({
      actionType: 'DELETE_ITEM',
      itemID: itemID,
      itemType: itemType,
      disableListener
    });
  },

  archiveItem: function(itemId, itemType, disableListener) {
    AppDispatcher.dispatch({
      actionType: 'ARCHIVE_ITEM',
      itemID: itemId,
      itemType: itemType,
      disableListener
    });
  },

  deleteItemLocal: function(itemID) {
    AppDispatcher.dispatch({
      actionType: 'DELETE_ITEM_LOCAL',
      itemID: itemID,
    });
  },

  reorderTopicItem: function(itemID, precedingTipsIDs, topicID) {
    AppDispatcher.dispatch({
      actionType: 'REORDER_TOPIC_ITEM',
      itemID,
      precedingTipsIDs,
      topicID
    });
  },
  setItem: item =>
    AppDispatcher.dispatch({
      actionType: 'SET_ITEM_LOCAL',
      item,
    })
};

export default ItemPageActions;
