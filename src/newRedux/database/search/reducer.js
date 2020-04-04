import actionTypes from './actionEnum';

const initialState = {
  isLoading: false,
  recentSearches: [],
  searchResult: [],
  searchCardsResult: 'ALL',
  isModalShown: false
};

const addRecentSearch = (state, action) => {
  const { payload } = action;
  const { query } = payload;
  const recentSearches = state.recentSearches.slice();
  // TODO: Persist to the server
  // TODO: Cache search result
  if (query.trim() !== '') {
    recentSearches.push(query);
  }
  return Object.assign({}, state, {
    recentSearches,
    isLoading: true
  });
};

const searchLoading = (state, action) => {
  return Object.assign({}, state, {
    isLoading: true
  });
};

const searchLoadSuccess = (state, action) => {
  const { payload } = action;
  const { searchResult } = payload;

  return Object.assign({}, state, {
    searchResult,
    isLoading: false
  });
};

const searchLoadFail = (state, action) => {
  return Object.assign({}, state, {
    isLoading: false
  });
};

const clearSearchResult = (state, action) => {
  return Object.assign({}, state, {
    searchResult: []
  });
};

const showSearchModal = (state, action) => {
  return Object.assign({}, state, {
    isModalShown: true
  });
};

const hideSearchModal = (state, action) => {
  return Object.assign({}, state, {
    isModalShown: false
  });
};

const setSearchCardsResult = (state, action) => {
  const { payload } = action;
  const { searchCardsResult } = payload;

  return Object.assign({}, state, {
    searchCardsResult
  });
};

const clearSearchCardsResult = (state, action) => {
  return Object.assign({}, state, {
    searchCardsResult: 'ALL'
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.addRecentSearch:
      return addRecentSearch(state, action);

    case actionTypes.loadingSearch:
      return searchLoading(state, action);

    case actionTypes.searchLoadSuccess:
      return searchLoadSuccess(state, action);

    case actionTypes.searchLoadFail:
      return searchLoadFail(state, action);

    case actionTypes.clearSearchResult:
      return clearSearchResult(state, action);

    case actionTypes.showSearchModal:
      return showSearchModal(state, action);

    case actionTypes.hideSearchModal:
      return hideSearchModal(state, action);

    case actionTypes.setSearchCardsResult:
      return setSearchCardsResult(state, action);

    case actionTypes.clearSearchCardsResult:
      return clearSearchCardsResult(state, action);

    default:
      return state;
  }
};

export default reducer;
