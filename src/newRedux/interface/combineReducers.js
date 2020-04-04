import { combineReducers } from 'redux';

import dock from './dock/reducer';
import menus from './menus/reducer';
import modals from './modals/reducer';
import page from './page/reducer';
import loadIndicator from './loadIndicators/reducer';
import views from './views/reducer';

const interfaceReducers = combineReducers({
  dock,
  modals,
  menus,
  page,
  loadIndicator,
  views
});

export default interfaceReducers;
