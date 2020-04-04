import { combineReducers } from 'redux';

import database from './database/combineReducers';
import filters from './filters/reducer';
import routing from './routing/reducer';
import session from './session/reducer';
import ui from './interface/combineReducers';
import utilities from './utilities/reducer';
import bot from './bot/reducer';
import integrationFiles from './integrationFiles/combineReducers';

const newReduxReducers = combineReducers({
  database,
  filters,
  routing,
  session,
  ui,
  utilities,
  bot,
  integrationFiles,
});

export default newReduxReducers;
