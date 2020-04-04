import { switchcaseF } from './utils';

import { 
  FILTER_TIP_BY_SLUG,
  RESET_TIP_FILTER,
  FILTER_TIP_BY_TOPIC
} from 'AppConstants';

const initialState = ({ id }) => id === -1;
const filterTipBySlug = payload =>
  ({ attributes: { slug } }) => slug === payload;
const filterTipByTopic = payload =>
  ({ relationships: { topics } }) => topics.some(({ id }) => id === payload);

const tipsFilter = (state = initialState, { type, payload }) => {
  switch (type) {
    case FILTER_TIP_BY_SLUG:
      return filterTipBySlug(payload);
    case FILTER_TIP_BY_TOPIC:
      return filterTipByTopic(payload);
    case RESET_TIP_FILTER:
      return initialState;
    default:
      return state;
  }
};

export default tipsFilter;