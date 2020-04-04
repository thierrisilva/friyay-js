import actionTypes from './actionEnum';

const defaultState = {
  cardsInDock: [],
  displayDock: false
};

const reducer = (state = defaultState, action) => {

  switch (action.type) {

    case actionTypes.setDockOpen:
      return { ...state, displayDock: action.payload };

    case actionTypes.setDockContents:
      return { ...state, cardsInDock: action.payload };

    default:
      return state;
  };
};

export default reducer;
