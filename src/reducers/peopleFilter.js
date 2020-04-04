import { 
  FILTER_USER_BY_ID,
  RESET_USER_FILTER
} from 'AppConstants';

const initialState = ({ id }) => id === -1;
const filterUserById = payload =>
  ({ id }) => id === payload;

const peopleFilter = (state = initialState, { type, payload }) => {
  switch (type) {
    case FILTER_USER_BY_ID:
      return filterUserById(payload);
    case RESET_USER_FILTER:
      return initialState;
    default:
      return state;
  }
};

export default peopleFilter;