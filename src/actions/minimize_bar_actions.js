import AppDispatcher from '../dispatchers/app_dispatcher';

const MinimizeBarActions = {
  minimizeItem(item) {
    AppDispatcher.dispatch({
      type: 'MINIMIZE_ITEM',
      item
    });
  },

  unMinimizeItem(item) {
    AppDispatcher.dispatch({
      type: 'UNMINIMIZE_ITEM',
      item
    });
  },

  setDockOpenStation(value) {
    AppDispatcher.dispatch({
      type: 'TOGGLE_DOCK_STATION',
      value
    });
  }
};

export default MinimizeBarActions;