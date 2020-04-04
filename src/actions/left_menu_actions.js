import AppDispatcher from '../dispatchers/app_dispatcher';

var LeftMenuActions = {
  toggleMenu: function(isActive) {
    AppDispatcher.dispatch({
      actionType: isActive ? 'LEFT_MENU_OPEN' : 'LEFT_MENU_CLOSE'
    });
  },

  loadUsers: function(groupID, filterType) {
    AppDispatcher.dispatch({
      actionType: 'LOAD_USERS',
      groupID: groupID,
      filterType
    });
  }
};

export default LeftMenuActions;
