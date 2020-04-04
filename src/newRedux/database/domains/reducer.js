import actionTypes from './actionEnum';
import omit from 'lodash/omit';

const defaultState = {}

const reducer = (state = defaultState, action) => {

  switch (action.type) {

    case actionTypes.add:
    case actionTypes.change:
      return { ...state, ...action.payload };

    case actionTypes.delete:
      return omit( state, [ action.payload ] );

    case actionTypes.replace:
      return { ...omit( state, [ action.payload.replaceId ] ), ...action.payload.replacement };

    case actionTypes.update:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};

export default reducer;
