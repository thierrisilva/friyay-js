import { ReduceStore } from 'flux/utils';

import AppDispatcher from '../dispatchers/app_dispatcher';

class NewAutoSaveStore extends ReduceStore {
  constructor() {
    super(AppDispatcher);
  }

  getInitialState() {
    return {
      autoSaveFields: this.getSetStoreToLocal() || {}
    };
  }

  getSetStoreToLocal(value) {
    if (value) {
      localStorage.setItem('newtiphiveAutoSaveStore', JSON.stringify(value));
    } else {
      return JSON.parse(localStorage.getItem('newtiphiveAutoSaveStore'));
    }
  }

  saveContent(state, action) {
    let newState = Object.assign({}, state);

    newState.autoSaveFields = action.autoSaveFields;
    this.getSetStoreToLocal(newState.autoSaveFields);
    return newState;
  }

  clearContent(state, action) {
    let newState = Object.assign({}, state);

    delete newState.autoSaveFields[action.clearField];
    localStorage.removeItem('newtiphiveAutoSaveStore');
    return newState;
  }

  reduce(state, action) {
    switch (action.type) {
      case 'SAVE_CONTENT':
        return this.saveContent(state, action);
      
      case 'CLEAR_CONTENT':
        return this.clearContent(state, action);

      default:
        return state;
    }
  }
}

export default new NewAutoSaveStore();