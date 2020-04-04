import actionTypes from './actionEnum';

const defaultState = {
  ctrlKeyDown: false,
  priorityView: 'Vertical'
};
const setups = ['Vertical', 'Horizontal', 'HorizontalCardDetails'];

const getView = view => {
  const index = setups.findIndex(s => s === view);
  if (index + 1 > 2) {
    view = 0;
  } else {
    view = index + 1;
  }
  return view;
};
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.setUtilityValue:
      return { ...state, ...action.payload };
    case actionTypes.changePriorityView:
      return { ...state, priorityView: setups[getView(state.priorityView)] };

    default:
      return state;
  }
};

export default reducer;
