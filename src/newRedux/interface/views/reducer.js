import actionTypes from './actionEnum';

const defaultState = {
  header: 'STANDARD',
  topic: 'HEX',
  card: 'SMALL_GRID',
  topicDesignLoading: false
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.changeView:
      return { ...state, ...action.payload };
    case actionTypes.topicDesignLoader:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
