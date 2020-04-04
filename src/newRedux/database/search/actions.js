import actionTypes from './actionEnum';

/**
 * Save recent searches.
 *
 * @param {String} query
 */
export const addToRecentSearch = query => ({
  type: actionTypes.addRecentSearch,
  payload: { query }
});

export const loadingSearch = () => ({
  type: actionTypes.loadingSearch
});

export const loadSearchSuccess = searchResult => ({
  type: actionTypes.searchLoadSuccess,
  payload: { searchResult }
});

export const loadSearchFail = () => ({
  type: actionTypes.searchLoadFail
});

export const clearSearchResult = () => ({
  type: actionTypes.clearSearchResult
});

export const searchModalShow = () => ({
  type: actionTypes.showSearchModal
});

export const searchModalHide = () => ({
  type: actionTypes.hideSearchModal
});

export const setSearchCardsResult = searchCardsResult => ({
  type: actionTypes.setSearchCardsResult,
  payload: { searchCardsResult }
});

export const clearSearchCardsResult = () => ({
  type: actionTypes.clearSearchCardsResult
});
