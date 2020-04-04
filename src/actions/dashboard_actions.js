import AppDispatcher from '../dispatchers/app_dispatcher';

var DashboardActions = {
  loadStats: function() {
    AppDispatcher.dispatch({
      actionType: 'LOAD_DASHBOARD'
    });
  }
};

export default DashboardActions;
