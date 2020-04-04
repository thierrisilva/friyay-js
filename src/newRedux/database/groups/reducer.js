import actionTypes from './actionEnum';
import merge from 'lodash/merge';
import mergeWith from 'lodash/mergeWith';
import isArray from 'lodash/isArray';
import omit from 'lodash/omit';

const defaultState = {};

const reducer = (state = defaultState, action) => {

  switch (action.type) {

    case actionTypes.add:
    case actionTypes.change:
      return { ...mergeWith({ ...state}, action.payload,
        (stateValue, actionValue) => {
          if(isArray(actionValue)){
            return actionValue;
          }
        }
      ) };

    case actionTypes.delete:
      return omit( state, [ action.payload ] );

    case actionTypes.mergeFollows:
      return { ...merge( action.payload, state ) };

    case actionTypes.replace:
      return { ...omit( state, [ action.payload.replaceId ] ), ...action.payload.replacement };

    default:
      return state;
  };
};

export default reducer;
