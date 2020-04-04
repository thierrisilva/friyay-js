import actionTypes from './actionEnum';

export const addUser = ( normalizedDetails ) => ({
  type: actionTypes.add,
  payload: normalizedDetails
});



export const changeUser = ({ attributes, relationships }) => ({
  type: actionTypes.change,
  payload: {
    attributes,
    relationships
  }
});


export const mergeUserAttributes = ({ attributes, relationships }) => ({
  type: actionTypes.merge,
  payload: {
    attributes,
    relationships
  }
});
