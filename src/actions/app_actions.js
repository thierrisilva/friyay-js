import AppDispatcher from '../dispatchers/app_dispatcher';

var AppActions = {
  loadCurrentUser: function() {
    AppDispatcher.dispatch({
      actionType: 'LOAD_CURRENT_USER'
    });
  }
};

export default AppActions;
