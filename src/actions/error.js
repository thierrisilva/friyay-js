import uniqueId from 'lodash/uniqueId';
import { failure } from 'Utils/toast';

let getCancel = null;
let cancelId = null;

export function handleCancelRequest() {
  if (getCancel !== null) {
    getCancel(`CANCEL_REQUEST ${cancelId}`);
    getCancel = null;
    cancelId = null;
  }
}

export function handleAPICancelToken(c) {
  getCancel = c;
  cancelId = uniqueId();
}

export function handleAPICatch(err) {
  // TODO: Detail full error if comes from server
  if (err.message.includes('CANCEL_REQUEST')) {
    throw new Error('CANCEL_REQUEST');
  }

  if (err.response.status === 500) {
    throw new Error('UNKNOWN_ERROR');
  }
}

export function handleCatch(error, dispatch, dispatchType, resource, alertMessage) {
  if (error.message !== 'CANCEL_REQUEST') {
    console.error(error);
    
    dispatch({
      type: dispatchType,
      payload: error
    });
    
    failure(alertMessage || `Unable to ${resource}`);
  }
}

export function handleFinally() {
  getCancel = null;
}