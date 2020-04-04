import actionTypes from './actionEnum';
import merge from 'lodash/merge';
import omit from 'lodash/omit';

const defaultState = {}

const reducer = (state = defaultState, action) => {

  switch (action.type) {

    case actionTypes.add:
      return { ...state, ...action.payload };

    case actionTypes.change:
      return {
        ...state,
        attributes: {
          ...state.attributes,
          ...action.payload.attributes
        },
        relationships: {
          ...state.relationships,
          ...action.payload.relationships
        }};

    case actionTypes.merge:
      return merge({ ...state }, action.payload );

    default:
      return state;
  };
};

export default reducer;
