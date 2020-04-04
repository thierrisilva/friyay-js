import {
  SET_AUTO_SAVE_CONTENT,
  CLEAR_AUTO_SAVE_CONTENT
} from 'AppConstants';

export const saveMainTipContent = ({ type, value }) => (dispatch, getState) => {
  const { autoSave: { mainTip } } = getState();
  const newSave = {
    ...mainTip,
    [type]: value
  };

  try {
    localStorage.setItem('auto_save_content', JSON.stringify(newSave));
  } catch (err) {
    console.error(err);
  }

  dispatch({ 
    type: SET_AUTO_SAVE_CONTENT,
    payload: newSave
  });
};

export const clearMainTipContent = () => dispatch => {
  try {
    localStorage.removeItem('auto_save_content');
  } catch (err) {
    console.error(err);
  }

  dispatch({ type: CLEAR_AUTO_SAVE_CONTENT });
};