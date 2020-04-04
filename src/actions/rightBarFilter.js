import { 
  ALL_TIPS,
  FOLLOWING_TIPS,
  LIKED_TIPS,
  STARRED_TIPS,
  MINE_TIPS,
  POPULAR_TIPS
} from 'AppConstants';

export const filterByAllTips = () =>
  dispatch => dispatch({ type: ALL_TIPS });

export const filterByFollowingTips = () =>
  dispatch => dispatch({ type: FOLLOWING_TIPS });

export const filterByLikedTips = () =>
  dispatch => dispatch({ type: LIKED_TIPS });

export const filterByStarredTips = () =>
  dispatch => dispatch({ type: STARRED_TIPS });

export const filterByMineTips = () =>
  dispatch => dispatch({ type: MINE_TIPS });

export const filterByPopularTips = () =>
  dispatch => dispatch({ type: POPULAR_TIPS });

export const resetFilter = () =>
  dispatch => dispatch({ type: FOLLOWING_TIPS });



