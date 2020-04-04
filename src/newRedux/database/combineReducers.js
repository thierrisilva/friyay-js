import { combineReducers } from 'redux';

import cards from './cards/reducer';
import comments from './comments/reducer';
import domains from './domains/reducer';
import groups from './groups/reducer';
import labelCategories from './labelCategories/reducer';
import labelOrders from './labelOrders/reducer';
import labels from './labels/reducer';
import notifications from './notifications/reducer';
import people from './people/reducer';
import peopleOrders from './peopleOrders/reducer';
import topics from './topics/reducer';
import topicOrders from './topicOrders/reducer';
import user from './user/reducer';
import search from './search/reducer';

const dbReducers = combineReducers({
  cards,
  comments,
  domains,
  groups,
  labelCategories,
  labelOrders,
  labels,
  notifications,
  people,
  peopleOrders,
  topics,
  topicOrders,
  user,
  search,
});

export default dbReducers;
