import { combineReducers } from 'redux';

import userDetails from './userDetails/reducer';
import userProfile from './userProfile/reducer';

const userReducer = combineReducers({
  userDetails,
  userProfile
});

export default userReducer;
