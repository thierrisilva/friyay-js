import actionTypes from './actionEnum';

const defaultState = {
  routerHistory: null
};

const reducer = (state = defaultState, action) => {

  switch (action.type) {

    case actionTypes.setHistory:
      return { ...state, routerHistory: action.payload };

    default:
      return state;
  };
};

export default reducer;
