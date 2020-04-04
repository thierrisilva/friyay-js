import AppDispatcher from '../dispatchers/app_dispatcher';

const GroupMenuActions = {
  loadGroups() {
    AppDispatcher.dispatch({
      actionType: 'LOAD_GROUPS'
    });
  }
};

export default GroupMenuActions;
