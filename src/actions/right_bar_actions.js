import AppDispatcher from '../dispatchers/app_dispatcher';

const RightBarActions = {
  expand() {
    AppDispatcher.dispatch({
      type: 'EXPAND_ACTION_BAR'
    });
  },

  close() {
    AppDispatcher.dispatch({
      type: 'CLOSE_ACTION_BAR'
    });
  },

  setContentProvider(provider) {
    AppDispatcher.dispatch({
      type: 'SET_CONTENT_PROVIDER',
      provider
    });
  },

  activateRightBar() {
    AppDispatcher.dispatch({
      type: 'ACTIVATE_RIGHT_BAR'
    });
  },
};

export default RightBarActions;
