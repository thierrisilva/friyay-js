import actionTypes from './actionEnum';

const initialState = {
  deletingTopic: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.deletingTopic:
      return { ...state, deletingTopic: action.payload };
    default:
      return state;
  }
}
