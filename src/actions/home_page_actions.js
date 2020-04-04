import AppDispatcher from '../dispatchers/app_dispatcher';

const HomePageActions = {
  loadItems: function(itemType) {
    AppDispatcher.dispatch({
      actionType: 'LOAD_ITEMS',
      itemType: itemType
    });
  },

  loadItemsByPage: function(itemType, pageNumber, pageSize, filterType, labelIDs) {
    if (!pageNumber) {
      pageNumber = 1;
    }

    if (!pageSize) {
      pageSize = window.ITEMS_PER_PAGE;
    }

    AppDispatcher.dispatch({
      actionType: 'LOAD_ITEMS_BY_PAGE',
      itemType: itemType,
      pageNumber: parseInt(pageNumber),
      pageSize: parseInt(pageSize),
      filterType: filterType,
      labelIDs: labelIDs
    });
  },

  removeItem: itemId =>
    AppDispatcher.dispatch({
      actionType: 'REMOVE_ITEM',
      itemId
    }),
};

export default HomePageActions;