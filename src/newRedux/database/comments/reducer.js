import actionTypes from './actionEnum';
import merge from 'lodash/merge';
import omit from 'lodash/omit';

const defaultState = {}

const reducer = (state = defaultState, action) => {

  switch (action.type) {

    case actionTypes.add:
      return merge({ ...state}, action.payload );//using merge as records come without relationships from index route

    case actionTypes.change:
    case actionTypes.changeMany:
      return { ...state, ...action.payload };

    case actionTypes.delete:
      return omit( state, [ action.payload ] );

    case actionTypes.replace:
      return { ...omit( state, [ action.payload.replaceId ] ), ...action.payload.replacement };

    default:
      return state;
  };
};

export default reducer;
