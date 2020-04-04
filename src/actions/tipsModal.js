import {
  SET_TIP_EDIT_ACTIVE,
  SET_TIP_EDIT_HIDDEN,
  SET_TIP_MODAL_ACTIVE,
  SET_TIP_MODAL_HIDDEN,
  TOGGLE_TIP_RELATED,
  SET_TIP_CREATE_ACTIVE,
  SET_TIP_CREATE_HIDDEN
} from 'AppConstants';

export const setModalActive = () => dispatch =>
  dispatch({
    type: SET_TIP_MODAL_ACTIVE
  });

export const setModalHidden = () => dispatch =>
  dispatch({
    type: SET_TIP_MODAL_HIDDEN
  });

export const setEditActive = () => dispatch =>
  dispatch({
    type: SET_TIP_EDIT_ACTIVE
  });

export const setEditHidden = () => dispatch =>
  dispatch({
    type: SET_TIP_EDIT_HIDDEN
  });

export const setCreateActive = (topicId, parentTipId) => dispatch =>
  dispatch({
    type: SET_TIP_CREATE_ACTIVE,
    payload: { topicId, parentTipId }
  });

export const setCreateHidden = () => dispatch =>
  dispatch({
    type: SET_TIP_CREATE_HIDDEN
  });

export const toggleRelated = () => dispatch =>
  dispatch({
    type: TOGGLE_TIP_RELATED
  });
