import { setCardEditMode } from './actions';

export const cardEditMode = isEditMode => async (dispatch, getState) => {
  dispatch(setCardEditMode(isEditMode));
};
