import React from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

// import { cancellablePromise } from 'Lib/utilities';
import { dataManager } from 'Src/dataManager/DataManager';

import LoadingIndicator from 'Components/shared/LoadingIndicator';
//
// The withDataManager HOC allows you to connect to the DataManager (found in Lib/) and the Redux store.  The withDataManager:
//
// - passes through your mapState and mapDispatch to connect to the Redux store, and returns the same props as Redux's 'connect' function
// - passes your predefined requirements to the DataManager and updates them if relevant props change in componentWillReceiveProps
// - injects dmData and dmLoading props into the wrapped component
//
// predefine your data requirements like this:

// const dataRequirements = ( props ) => ({
//   cardsForTopic: { topicId: props.topicId },
//   subtopicsForTopic: { topicId: props.topicId },
//   topic: { topicId: props.topicId },
// });
//
// if, for instance, the topicId prop changed, withDataManager will advise the DataManager, which will in turn test to see if it needs to call down new data
// from the server.  If it does, the dmLoading prop will be true while the data is waited on.  NOTE:  withDataManager and the DataManager itself don't return
// your data - they just make sure its in the store for you.
//
// the withDataManager also provides a 'dmRequestNextPageForRequirement' function prop.  Simply call it with the key for the requirement you want the next
// page of results for - dmLoading will change to true, and the data will be called and pushed into the redux store.

// For a good example of this in action (and using the MoreItemsLoader), look at components/menus/left/segments/LeftMenuTopicSegment

const withDataManager = (
  dataRequirements,
  mapState,
  mapDispatch,
  options = {}
) => WrappedComponent => {
  class DataManagerContainer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        dmInitialLoading: true,
        dmLoading: true,
        dmData: null
      };
    }

    isMounted_ = false;

    componentDidMount() {
      this.isMounted_ = true;
      const dReq = dataRequirements(this.props);
      this.handleInformDataManagerOfRequirements(dReq);
    }

    componentDidUpdate = async prevProps => {
      const existingDataRequirements = dataRequirements(prevProps);
      const newDataRequirements = dataRequirements(this.props);
      const dReq = {};

      for (let req in newDataRequirements) {
        const existingReq = existingDataRequirements[req];
        const newReq = newDataRequirements[req];

        if (
          Object.keys(newReq).some(
            key => !isEqual(existingReq[key], newReq[key])
          )
        ) {
          dReq[req] = newDataRequirements[req];
        }
      }

      if (Object.keys(dReq).length > 0) {
        this.handleInformDataManagerOfRequirements(dReq);
      }
    };

    componentWillUnmount() {
      this.isMounted_ = false;
    }

    handleInformDataManagerOfRequirements = async dReq => {
      this.setState({ dmLoading: true });
      const dmData = await dataManager.iRequire(dReq);
      if (this.isMounted_) {
        //TODO: MH: change this to use a cancellable promise instead and get rid of isMounted_
        this.setState(state => ({
          dmData: { ...state.dmData, ...dmData },
          dmInitialLoading: false,
          dmLoading: false
        }));
      }
    };

    handleRequestNextPageForRequirementKey = async key => {
      const dmData = this.state.dmData;
      if (dmData && dmData[key]) {
        const thisKeysUpdates = dmData[key].loadNext
          ? await dmData[key].loadNext()
          : dmData[key];
        if (this.isMounted_) {
          //TODO: MH: change this to use a cancellable promise instead
          this.setState(state => ({
            dmData: { ...state.dmData, ...thisKeysUpdates },
            dmLoading: false
          }));
        }
        return thisKeysUpdates;
      }
    };

    render() {
      const { dmData, dmInitialLoading, dmLoading } = this.state;

      return dmInitialLoading && !options.dontShowLoadingIndicator ? (
        <LoadingIndicator />
      ) : (
        <WrappedComponent
          dmData={dmData}
          dmLoading={dmLoading}
          dmRequestNextPageForRequirement={
            this.handleRequestNextPageForRequirementKey
          }
          {...this.props}
        />
      );
    }
  }

  DataManagerContainer.displayName = `withDataManager(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'})`;

  return connect(
    mapState,
    mapDispatch
  )(DataManagerContainer);
};

export default withDataManager;
