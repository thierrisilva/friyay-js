import { 
  ALL_TIPS,
  FOLLOWING_TIPS,
  LIKED_TIPS,
  STARRED_TIPS,
  MINE_TIPS,
  POPULAR_TIPS,
  RESET_FILTER
} from 'AppConstants';
import { CARD_FILTER_ENUM as FILTER } from 'Enums';
import { switchcaseF } from './utils';

// TODO: implement default filter for support domain and topic page
const initialState = {
  currentFilter: FILTER.ALL
};

const setCurrentFilter = currentFilter => state => ({ ...state, currentFilter });
const setAllTips = setCurrentFilter(FILTER.ALL);
const setFollowingTips = setCurrentFilter(FILTER.FOLLOWING);
const setLikedTips = setCurrentFilter(FILTER.LIKED);
const setStarredTips = setCurrentFilter(FILTER.STARRED);
const setMineTips = setCurrentFilter(FILTER.MINE);
const setPopularTips = setCurrentFilter(FILTER.POPULAR);

const rightBarFilter = (state = initialState, { type, payload }) =>
  switchcaseF({
    [ALL_TIPS]: setAllTips,
    [FOLLOWING_TIPS]: setFollowingTips,
    [LIKED_TIPS]: setLikedTips,
    [STARRED_TIPS]: setStarredTips,
    [MINE_TIPS]: setMineTips,
    [POPULAR_TIPS]: setPopularTips,
    [RESET_FILTER]: setFollowingTips
  })(state)(type)(state, payload);

export default rightBarFilter;