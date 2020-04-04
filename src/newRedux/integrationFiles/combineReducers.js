import { combineReducers } from 'redux';

import dropbox from './dropbox/reducer';
import box from './box/reducer';
import google from './google-drive/reducer';
import slack from './slack/reducer';

const integrationReducers = combineReducers({
  dropbox,
  box,
  google,
  slack,
});

export default integrationReducers;
