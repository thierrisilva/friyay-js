import actionTypes from './actionEnum';
import merge from 'lodash/merge';
import omit from 'lodash/omit';

const defaultState = {};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.add:
    case actionTypes.change:
      return merge(state, action.payload);

    case actionTypes.merge:
      return { ...merge(action.payload, state) }; //merge profiles into user details

    case actionTypes.delete:
      return omit(state, [action.payload]);

    case actionTypes.replace:
      return {
        ...omit(state, [action.payload.replaceId]),
        ...action.payload.replacement
      };

    default:
      return state;
  }
};

export default reducer;
