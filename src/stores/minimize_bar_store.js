import { ReduceStore } from 'flux/utils';
import AppDispatcher from '../dispatchers/app_dispatcher';

const dockStationToggleStr = 'isDockStationShowing';
const dockStationStoreStr = 'MinimizeDock';

class MinimizeBarStore extends ReduceStore {
  constructor() {
    super(AppDispatcher);
  }

  getInitialState() {
    const storedMinimizeDock = localStorage.getItem(dockStationStoreStr);
    const isDockStationShowing = localStorage.getItem(dockStationToggleStr) || false;
    const minimizeList = storedMinimizeDock && JSON.parse(storedMinimizeDock);
    return {
      minimizeList: minimizeList || [],
      show: isDockStationShowing
    };
  }

  minimizeItem(state, action) {
    let { minimizeList } = state;

    let containsItem = minimizeList.some(function (item) {
      return item.id === action.item.id;
    });

    if(containsItem) {
      return state;
    } else {
      const minimizeListData = minimizeList.concat(action.item);
      // store local Minimize Dock
      localStorage.setItem(dockStationStoreStr, JSON.stringify(minimizeListData));
      return Object.assign({}, state, {
        minimizeList: minimizeListData
      });
    }
  }

  unMinimizeItem(state, action) {
    let { minimizeList } = state;

    let newList = minimizeList.filter((item) => {
      return item.id !== action.item.id;
    });
    // update Minimize Dock local store
    localStorage.setItem(dockStationStoreStr, JSON.stringify(newList));
    return Object.assign({}, state, {
      minimizeList: newList
    });
  }

  setDockOpenStation(state, action) {
    const { value } = action;
    if (value) {
      localStorage.setItem(dockStationToggleStr, 'true');
    } else {
      localStorage.setItem(dockStationToggleStr, 'false');
    }
    return Object.assign({}, state, {
      show: action.value
    });
  }

  reduce(state, action) {
    switch (action.type) {
      case 'MINIMIZE_ITEM':
        return this.minimizeItem(state, action);
      case 'UNMINIMIZE_ITEM':
        return this.unMinimizeItem(state, action);
      case 'TOGGLE_DOCK_STATION':
        return this.setDockOpenStation(state, action);
      default:
        return state;
    }
  }
}

export default new MinimizeBarStore();
