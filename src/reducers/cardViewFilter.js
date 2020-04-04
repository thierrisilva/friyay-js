import { 
  FILTER_TIP_CARD_VIEW_BY_ID,
  RESET_FILTER_TIP_CARD_VIEW
} from 'AppConstants';

const initialState = tip => tip.id === -1;

export default function tipsFilter(state = initialState, { type, payload }) {
  switch (type) {
    case FILTER_TIP_CARD_VIEW_BY_ID:
      return ({ id }) => id === payload;

    case RESET_FILTER_TIP_CARD_VIEW:
      return initialState;

    default:
      return state;
  }
}