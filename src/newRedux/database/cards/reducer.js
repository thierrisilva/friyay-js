import actionTypes from './actionEnum';
import omit from 'lodash/omit';
import merge from 'lodash/merge';

const defaultState = {}

const reducer = (state = defaultState, action) => {

  switch (action.type) {

    case actionTypes.add:
    case actionTypes.change:
      return { ...state, ...action.payload };

    case actionTypes.delete:
      return omit( state, [ action.payload ] );

    case actionTypes.replace: {
      const newState = { ...state };
      const replacement = merge(newState[action.payload.replaceId], action.payload.replacement[action.payload.replaceId]);
      return { ...omit( state, [ action.payload.replaceId ] ), ...replacement };
    }
    
    default:
      return state;
  }
};

export default reducer;
