import {
  addToRecentSearch,
  loadSearchFail,
  loadSearchSuccess,
  searchModalHide,
  searchModalShow,
  setSearchCardsResult
} from './actions';
import { fetchSearchResult } from 'Src/newRedux/database/search/apiCall';

export const search = query => {
  return async (dispatch, getState) => {
    try {
      dispatch(addToRecentSearch(query));
      const result = await fetchSearchResult(query);
      dispatch(loadSearchSuccess(result.data.data));
      return result;
    } catch (err) {
      dispatch(loadSearchFail());
      console.error(err);
    }
  };
};

export const showSearchModal = () => {
  return (dispatch, getState) => {
    dispatch(searchModalShow());
  };
};

export const hideSearchModal = () => {
  return (dispatch, getState) => {
    dispatch(searchModalHide());
  };
};

export const searchCardsResult = query => {
  return async (dispatch, getState) => {
    try {
      let result = await fetchSearchResult(query);
      let cardsTitle = '';
      result = result.data.data;
      result.forEach(item => {
        cardsTitle += item.attributes.name;
      });
      dispatch(setSearchCardsResult(cardsTitle));
      return result;
    } catch (err) {
      dispatch(loadSearchFail());
      console.error(err);
    }
  };
};
