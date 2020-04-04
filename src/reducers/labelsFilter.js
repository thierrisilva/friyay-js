import { 
  ADD_LABEL_FILTER,
  REMOVE_LABEL_FILTER,
  REMOVE_ALL_LABEL_FILTER
} from 'AppConstants';
import isEmpty from 'lodash/isEmpty';

const initialState = [];

export default function labelsFilter(state = initialState, { type, payload }) {
  switch (type) {
    case ADD_LABEL_FILTER:
      return [...state, ...(Array.isArray(payload) ? payload : [payload])]
          .filter(id => !isEmpty(id));

    case REMOVE_LABEL_FILTER:
      return state.filter(item => item !== payload);

    case REMOVE_ALL_LABEL_FILTER:
      return [];

    default:
      return state;
  }
}