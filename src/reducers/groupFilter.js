import { 
  FILTER_GROUP_BY_SLUG,
  RESET_GROUP_FILTER
} from 'AppConstants';

const initialState = ({ id }) => id === -1;

export default function tipsFilter(state = initialState, { type, payload }) {
  switch (type) {
    case FILTER_GROUP_BY_SLUG:
      return ({ attributes: { slug } }) => slug === payload;

    case RESET_GROUP_FILTER:
      return initialState;

    default:
      return state;
  }
}