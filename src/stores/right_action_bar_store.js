import { ReduceStore } from 'flux/utils';

import AppDispatcher from '../dispatchers/app_dispatcher';

class RightActionBarStore extends ReduceStore {
  constructor() {
    super(AppDispatcher);
  }

  getInitialState() {
    return {
      rightBarActivated: true,
      contentExpanded:   false,
      contentProvider:   null
    };
  }

  expandActionBar(state, action) {
    let newState = Object.assign({}, state);

    newState.contentExpanded = true;

    return newState;
  }

  closeActionBar(state, action) {
    let newState = Object.assign({}, state);

    newState.contentExpanded = false;

    return newState;
  }

  setContentProvider(state, action) {
    let newState = Object.assign({}, state);

    newState.contentProvider = action.provider;

    return newState;
  }

  activateRightBar(state, action) {
    let newState = Object.assign({}, state);

    newState.rightBarActivated = true;

    return newState;
  }

  reduce(state, action) {
    switch (action.type) {
      case 'EXPAND_ACTION_BAR':
        return this.expandActionBar(state, action);

      case 'CLOSE_ACTION_BAR':
        return this.closeActionBar(state, action);

      case 'SET_CONTENT_PROVIDER':
        return this.setContentProvider(state, action);

      case 'ACTIVATE_RIGHT_BAR':
        return this.activateRightBar(state, action);

      default:
        return state;
    }
  }
}

export default new RightActionBarStore();
