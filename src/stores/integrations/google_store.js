import { ReduceStore } from 'flux/utils';
import OAuthClient from '../../lib/oauth/oauth_client';
import Cookies from 'js-cookie';

import IntegrationDispatcher from '../../dispatchers/integration_dispatcher';

class GoogleStore extends ReduceStore {
  constructor() {
    super(IntegrationDispatcher);
  }

  getInitialState() {
    return {
      folderID:       '',
      files:          [],
      nextPageToken:  null,
      newAccessToken: null,
      error:          null,
      sendingRequest: false
    };
  }

  refreshToken(state, action) {
    let newState = Object.assign({}, state);

    newState.newAccessToken = null;
    newState.sendingRequest = true;

    let authClient = OAuthClient.create({ provider: action.provider });

    let token = authClient.createToken(
      action.accessToken,
      action.refreshToken,
      'Bearer', {
        data: {
          grant_type: 'refresh_token'
        }
      });

    token.refresh().then((authorizedData) => {
      let refreshToken = authorizedData.refreshToken;
      let accessToken  = authorizedData.accessToken;

      Cookies.set(`${action.provider}RefreshToken`, refreshToken, {
        domain: `.${window.APP_DOMAIN}`,
        expires: 365
      });

      Cookies.set(`${action.provider}AccessToken`, accessToken, {
        domain: `.${window.APP_DOMAIN}`,
        expires: authorizedData.expires
      });

      IntegrationDispatcher.dispatch({
        type: 'GOOGLE_REFRESH_TOKEN_DONE',
        authorizedData: authorizedData
      });
    }).catch((error) => {
      IntegrationDispatcher.dispatch({
        type: 'GOOGLE_REFRESH_TOKEN_FAIL',
        error
      });
    });

    return newState;
  }

  refreshTokenDone(state, action) {
    let newState = Object.assign({}, state);

    newState.newAccessToken = action.access_token;
    newState.sendingRequest = false;

    return newState;
  }

  refreshTokenFail(state, action) {
    let newState = Object.assign({}, state);

    newState.error = action.error;
    newState.sendingRequest = false;

    return newState;
  }

  listFiles(state, action) {
    let newState = Object.assign({}, state);

    let fileListingURL = 'https://www.googleapis.com/drive/v3/files';

    let queryData = { corpora: 'user', orderBy: 'folder,name' };
    if (action.folderID && action.folderID !== '') {
      queryData['q'] = `'${action.folderID}' in parents`;

      if (action.folderID === 'root') {
        queryData['q'] += ' or sharedWithMe';
      }
    }

    if (action.nextPageToken) {
      queryData['pageToken'] = action.nextPageToken;
    }

    OAuthClient.get({
      accessToken: action.accessToken,
      url: fileListingURL,
      data: queryData,
      done: (response) => {
        IntegrationDispatcher.dispatch({
          type: 'GOOGLE_LIST_FILES_DONE',
          files: action.nextPageToken ? newState.files.concat(response.files) : response.files,
          nextPageToken: response.nextPageToken
        });
      },
      fail: (xhr, status, error) => {
        IntegrationDispatcher.dispatch({
          type: 'GOOGLE_LIST_FILES_FAIL',
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
    newState.nextPageToken = action.nextPageToken;
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

    Cookies.remove('googleAccessToken', { domain: `.${window.APP_DOMAIN}` });

    OAuthClient.get({
      accessToken: action.accessToken,
      url: 'https://accounts.google.com/o/oauth2/revoke',
      data: { token: action.accessToken },
      done: (response) => {
        IntegrationDispatcher.dispatch({
          type: 'GOOGLE_DISCONNECT_DONE',
          response
        });
      },
      fail: (xhr, status, error) => {
        IntegrationDispatcher.dispatch({
          type: 'GOOGLE_DISCONNECT_FAIL',
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
      case 'GOOGLE_LIST_FILES':
        return this.listFiles(state, action);

      case 'GOOGLE_LIST_FILES_DONE':
        return this.listFilesDone(state, action);

      case 'GOOGLE_LIST_FILES_FAIL':
        return this.listFilesFail(state, action);

      case 'GOOGLE_DISCONNECT':
        return this.disconnect(state, action);

      case 'GOOGLE_DISCONNECT_DONE':
        return this.disconnectDone(state, action);

      case 'GOOGLE_DISCONNET_FAIL':
        return this.disconnectFail(state, action);

      default:
        return state;
    }
  }
}

export default new GoogleStore();
