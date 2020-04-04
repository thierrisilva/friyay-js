/*  
 *  This is a temporary file until React Router 4 branch is accepted as standard 
 *  Look up for code ROUTER-CLEAN for what to clean once the branch is standard
 *  This file exports the created store, which is supposed to happen on App.js
 */

import createStore from './createStore';

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.___INITIAL_STATE__;
const store = createStore(initialState);

export default store;