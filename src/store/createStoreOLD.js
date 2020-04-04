/* global module, require */
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import makeRootReducer from '../reducers';
import { updateLocation } from 'Actions/location';

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk];

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = [];
  if (typeof __DEV__ != "undefined" && __DEV__) {
    const devToolsExtension = window.devToolsExtension;
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  );

  store.asyncReducers = {};

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  store.unsubscribeHistory = browserHistory.listen(updateLocation(store));

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const reducers = require('../reducers').default;
      store.replaceReducer(reducers(store.asyncReducers));
    });
  }

  return store;
};
