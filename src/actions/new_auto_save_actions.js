import AppDispatcher from '../dispatchers/app_dispatcher';

const NewAutoSaveActions = {
  saveContent(autoSaveFields) {
    AppDispatcher.dispatch({
      type: 'SAVE_CONTENT',
      autoSaveFields
    });
  },

  clearContent(clearField) {
    AppDispatcher.dispatch({
      type: 'CLEAR_CONTENT',
      clearField
    });
  },
};

export default NewAutoSaveActions;