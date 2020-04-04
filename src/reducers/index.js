import { combineReducers } from 'redux';
import location from './location';
import tips from './tips';
import tipsFilter from './tipsFilter';
import tipsModal from './tipsModal';
import relatedTips from './relatedTips';
import cardViewFilter from './cardViewFilter';
import labels from './labels';
import labelsFilter from './labelsFilter';
import minimizeBar from './minimizeBar';
import notifications from './notifications';
import tipsView from './tipsView';
import version from './version';
import comments from './comments';
import labelsPanel from './labelsPanel';
import rightBarFilter from './rightBarFilter';
import people from './people';
import appUser from './appUser';
import peopleFilter from './peopleFilter';
import topics from './topics';
import menu from './menu';
import groups from './groups';
import groupFilter from './groupFilter';
import roles from './roles';
import members from './members';
import topic from './topic';
import subTopicsPanel from './subTopicsPanel';
import autoSave from './autoSave';
import labelsCategory from './labelsCategory';

import assignFilter from './assignFilter';

//Note:  Building new redux tree on a branch in the current redux store:
import _newReduxTree from '../newRedux/combineReducers';

export const makeRootReducer = asyncReducers =>
  combineReducers({
    _newReduxTree,
    assignFilter,
    location,
    tips,
    tipsFilter,
    tipsModal,
    relatedTips,
    cardViewFilter,
    labels,
    labelsFilter,
    minimizeBar,
    notifications,
    tipsView,
    version,
    comments,
    labelsPanel,
    rightBarFilter,
    people,
    appUser,
    peopleFilter,
    topics,
    // menu,
    groups,
    groupFilter,
    roles,
    members,
    topic,
    subTopicsPanel,
    autoSave,
    labelsCategory,
    ...asyncReducers
  });

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return;

  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
