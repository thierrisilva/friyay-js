// The DataManager is instantiated by the App component and is a centralised 'overseer' of data requirements for components.
// Its purpose is to ensure the redux store always has the data in it our components need, without calling the server
// more often than required.
//
//What it DOES do:
//- allows us to predefine our data requirements using the withDataManager HOC
//- recognises duplicate simultaneous requirements and prevents multiple actions from dispatching
//- if the data we need is not in the store, it dispatches the appropriate async action to get the data and push it into the store
//- if the data we need IS in the store and is still fresh (i.e passes the 'test' for the requirement), the DM will recognise this and abstain from dispatching an action
//- returns a 'loadNext' function to get subsequent pages of the same data

// What it does NOT do:
// return records.  They are pushed into redux, and you get them from there as normal
// handle ALL data requirements.  There will still be cases for calling data directly, or dispatching actions directly.  The DataManager handles the most common cases

// We predefine 'requirements' that we want components to be able to use (see config).  A component advises
// the DataManager of a new or changed requirement by calling its 'iRequire' function with the appropriate attributes, and the
// DataManager will then 'test' the requirement to see if it needs to call new data or not.  A Component can also 'preregister' its
// requirements based on props using the withDataManager HOC (see commentary in that component in Components/HOCS/withDataManager)

import { getThisDomain, idFromSlug } from 'Lib/utilities';
import { stateMappings } from 'Src/newRedux/stateMappings';
import moment from 'moment';
import get from 'lodash/get';
import analytics, { createUserForMixpanelFromReduxUser } from 'Lib/analytics';

import cardRequirements from 'Src/newRedux/database/cards/dmRequirements';
import commentRequirements from 'Src/newRedux/database/comments/dmRequirements';
import peopleRequirements from 'Src/newRedux/database/people/dmRequirements';
import topicRequirements from 'Src/newRedux/database/topics/dmRequirements';
import { getDomains } from 'Src/newRedux/database/domains/thunks';
import { getGroups } from 'Src/newRedux/database/groups/thunks';
import { getLabelCategories } from 'Src/newRedux/database/labelCategories/thunks';
import { getLabelOrders } from 'Src/newRedux/database/labelOrders/thunks';
import { getLabels } from 'Src/newRedux/database/labels/thunks';
import { getNotifications } from 'Src/newRedux/database/notifications/thunks';
import { getPeople } from 'Src/newRedux/database/people/thunks';
import { getPeopleOrders } from 'Src/newRedux/database/peopleOrders/thunks';
import { getTopicOrders } from 'Src/newRedux/database/topicOrders/thunks';
import { getUser } from 'Src/newRedux/database/user/thunks';
import { setPageDetails } from 'Src/newRedux/interface/page/actions';

export let dataManager = null;

// The DataManager Config provides all the 'concerns' our components can register for (add more if required).  When a
// component calls iRequire() with an appropriate concern, eg:
//
// dataManager.iRequire({
//   subtopicsForTopic: {
//     topicId: '19'
//   }
// })
//
// -the DataManager will test the call against the test function in the config.  If it fails the test, it will dispatch
// the action listed, with the arguments provided.  actions are recorded as an array of 2 items, the action name, and the action argument object

const config = {
  ...cardRequirements,
  ...commentRequirements,
  ...peopleRequirements,
  ...topicRequirements
};

export const setupDataManager = () => (dispatch, getState) => {
  dataManager = new DataManager(config, dispatch, getState);
  return dataManager;
};

class DataManager {
  constructor(config, dispatch, getState) {
    this.config = config;
    this.dispatch = dispatch;
    this.getState = getState;
    this.callHistory = {};
  }

  //dispatches an action when a particular requirement fails its test.  Also passed back as the function to get the next page of results
  dispatchActionForRequirement = async ({
    key,
    keyForRequirement,
    action,
    actionArguments
  }) => {
    const dispatcher = async () => {
      const data = await this.dispatch(action(actionArguments));
      const meta = data
        ? {
            currentPage: get(data, 'data.meta.current_page', 1),
            totalPages: get(data, 'data.meta.total_pages', 1),
            allLoaded:
              get(data, 'data.meta.current_page', null) >=
              get(data, 'data.meta.total_pages', null),
            loadNext: () =>
              this.dispatchActionForRequirement({
                key,
                keyForRequirement,
                action,
                actionArguments: {
                  ...actionArguments,
                  pageNumber: data.data.meta
                    ? Math.min(
                        data.data.meta.current_page + 1,
                        data.data.meta.total_pages
                      )
                    : 1
                }
              })
          }
        : {};
      return meta;
    };

    const dispatchedCall = dispatcher();
    this.callHistory[keyForRequirement] = {
      ...this.callHistory[keyForRequirement],
      lastCall: moment().unix(),
      inFlight: dispatchedCall
    };
    const meta = await dispatchedCall;
    this.callHistory[keyForRequirement] = {
      ...this.callHistory[keyForRequirement],
      ...meta,
      inFlight: false
    };
    return {
      [key]: this.callHistory[keyForRequirement]
    };
  };

  //Gets the data we want at launch time
  getLaunchData = async () => {
    await Promise.all([
      this.dispatch(getDomains()),
      this.dispatch(getGroups()),
      this.dispatch(getLabelCategories()),
      this.dispatch(getLabelOrders()),
      this.dispatch(getLabels()),
      this.dispatch(getNotifications()),
      this.dispatch(getPeople()),
      this.dispatch(getPeopleOrders()),
      this.dispatch(getTopicOrders()),
      this.dispatch(getUser())
    ]);

    // this.dispatch( setLaunchComplete( true ) );
  };

  //Assesses requirements against their tests, and either calls the dispatchActionForRequirement function, or returns the meta from the previous dispatch:
  iRequire = async (requirements, forceUpdate = false) => {
    const ensureDataInStoreForRequirement = async ({
      key,
      attributes,
      results,
      forceUpdate
    }) => {
      const keyForRequirement = this.config[key].key(attributes);
      const failTest = (key, attributes) =>
        !this.config[key].test({
          ...attributes,
          state: this.getState(),
          callHistory: this.callHistory[keyForRequirement]
        });
      if (forceUpdate || failTest(key, attributes)) {
        const action = this.config[key].action(attributes);
        await this.dispatchActionForRequirement({
          key,
          keyForRequirement,
          action: action[0],
          actionArguments: action[1]
        });
      }
      this.callHistory[keyForRequirement] &&
        this.callHistory[keyForRequirement].inFlight &&
        (await this.callHistory[keyForRequirement].inFlight); //if we pass the test, but the prev call is inflight, wait for it to resolve
      results[key] = this.callHistory[keyForRequirement];
    };

    const results = {};
    const asyncCalls = [];

    for (let reqtKey in requirements) {
      asyncCalls.push(
        ensureDataInStoreForRequirement({
          key: reqtKey,
          attributes: requirements[reqtKey],
          results,
          forceUpdate
        })
      );
    }

    await Promise.all(asyncCalls);
    return results;
  };

  //triggered by props changes in the 'App' component to keep redux informed of current url params so we don't have to use withRouter)
  updateReduxOnPageChange = ({
    page,
    match: {
      params: { groupSlug, topicSlug, personId }
    }
  }) => {
    //TODO: MH: Change Selected View to Default View for topic/page
    const topicId = idFromSlug(topicSlug);
    const domains = Object.values(stateMappings(this.getState()).domains);
    const domainId = getThisDomain(domains) ? getThisDomain(domains).id : null;

    this.dispatch(
      setPageDetails({
        domainId: domainId ? '' + domainId : null,
        groupId: groupSlug ? idFromSlug(groupSlug) : null,
        page: page,
        personId: personId ? '' + personId : null,
        rootUrl: groupSlug ? `/groups/${groupSlug}` : '/',
        topicId: topicId ? '' + topicId : null,
        topicSlug: topicSlug
      })
    );

    const currentUser = stateMappings(this.getState()).user;
    analytics.identify(createUserForMixpanelFromReduxUser(currentUser));
    switch (page) {
      case 'home':
        analytics.track('Card Feed Visited');
        break;
      case 'topics':
        analytics.track('Topic Feed Visited');
        break;
      case 'topic':
        analytics.track('Topic Visited', { topic: topicSlug });
        break;
      case 'user':
        analytics.track('User Visited', { user: personId });
        break;
      default:
        return null;
    }
  };
}
