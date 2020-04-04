import actionTypes from './actionEnum';
import merge from 'lodash/merge';
import omit from 'lodash/omit';

const defaultState = {};

switch (action.type) {

  case actionTypes.add:
    return merge({ ...state}, action.payload );

  case actionTypes.delete:
    return omit( state, [ action.payload ] );

  default:
    return state;
  }
