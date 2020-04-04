import actionTypes from './actionEnum';

export const setDockOpen = ( isOpen ) => ({
  type: actionTypes.setDockOpen,
  payload: isOpen
});

export const setDockContents = ( arrayOfCardIds ) => ({
  type: actionTypes.setDockContents,
  payload: arrayOfCardIds
});
