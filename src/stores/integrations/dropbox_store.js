import { ReduceStore } from 'flux/utils';
import OAuthClient from '../../lib/oauth/oauth_client';
import Cookies from 'js-cookie';

import IntegrationDispatcher from '../../dispatchers/integration_dispatcher';

class DropboxStore extends ReduceStore {
  constructor() {
    super(IntegrationDispatcher);
  }

  getInitialState() {
    return {
      folderID:       '',
      files:          [],
      nextPageToken:  null,
      error:          null,
      sendingRequest: false
    };
  }

  listFiles(state, action) {
    let newState = Object.assign({}, state);

    OAuthClient.post({
      accessToken: action.accessToken,
      url: 'https://api.dropboxapi.com/2/files/list_folder',
      data: { path: action.folderID },
      done: (response) => {

        IntegrationDispatcher.dispatch({
          type: 'DROPBOX_LIST_FILES_DONE',
          files: response.entries
        });
      },
      fail: (xhr, status, error) => {
        IntegrationDispatcher.dispatch({
          type: 'DROPBOX_LIST_FILES_FAIL',
          error
        });
      }
    });

    newState.folderID = action.folderID;
    newState.sendingRequest = true;

    return newState;
  }

  listFilesDone(state, action) {
    let newState = Object.assign({}, state);

    newState.files = action.files;
    newState.sendingRequest = false;

    return newState;
  }

  listFilesFail(state, action) {
    let newState = Object.assign({}, state);

    newState.error = action.error;
    newState.sendingRequest = false;

    return newState;
  }

  disconnect(state, action) {
    let newState = Object.assign({}, state);

    Cookies.remove('dropboxAccessToken', { domain: `.${window.APP_DOMAIN}` });

    OAuthClient.post({
      accessToken: action.accessToken,
      url: 'https://api.dropboxapi.com/2/auth/token/revoke',
      data: 'null',
      done: (response) => {
        IntegrationDispatcher.dispatch({
          type: 'DROPBOX_DISCONNECT_DONE',
          response
        });
      },
      fail: (xhr, status, error) => {
        IntegrationDispatcher.dispatch({
          type: 'DROPBOX_DISCONNECT_FAIL',
          error
        });
      }
    });

    return newState;
  }

  disconnectDone(state, action) {
    let newState = Object.assign({}, state);

    newState.files = [];

    return newState;
  }

  disconnectFail(state, action) {
    let newState = Object.assign({}, state);

    return newState;
  }

  reduce(state, action) {
    switch (action.type) {
      case 'DROPBOX_LIST_FILES':
        return this.listFiles(state, action);

      case 'DROPBOX_LIST_FILES_DONE':
        return this.listFilesDone(state, action);

      case 'DROPBOX_LIST_FILES_FAIL':
        return this.listFilesFail(state, action);

      case 'DROPBOX_DISCONNECT':
        return this.disconnect(state, action);

      case 'DROPBOX_DISCONNECT_DONE':
        return this.disconnectDone(state, action);

      case 'DROPBOX_DISCONNET_FAIL':
        return this.disconnectFail(state, action);

      default:
        return state;
    }
  }
}

export default new DropboxStore();
