/* global module, require */
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import makeRootReducer from '../reducers';
import { updateLocation } from 'Actions/location';

import { batchStoreEnhancer, batchMiddleware } from 'redux-batch-enhancer';

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [batchMiddleware, thunk];

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = [batchStoreEnhancer];
  if (typeof __DEV__ != 'undefined' && __DEV__) {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;
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

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const reducers = require('../reducers').default;
      store.replaceReducer(reducers(store.asyncReducers));
    });
  }

  return store;
};
