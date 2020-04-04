import {
  FILTER_TIP_BY_SLUG,
  RESET_TIP_FILTER,
  FILTER_TIP_CARD_VIEW_BY_ID,
  RESET_FILTER_TIP_CARD_VIEW
} from 'AppConstants';

export const filterTipBySlug = slug => dispatch =>
  dispatch({
    type: FILTER_TIP_BY_SLUG,
    payload: slug
  });

export const resetTip = () => dispatch =>
  dispatch({
    type: RESET_TIP_FILTER
  });

export const filterTipCardViewById = id => dispatch =>
  dispatch({
    type: FILTER_TIP_CARD_VIEW_BY_ID,
    payload: id
  });

export const resetTipCardView = () => dispatch =>
  dispatch({
    type: RESET_FILTER_TIP_CARD_VIEW
  });
