import { ReduceStore } from 'flux/utils';
import OAuthClient from '../../lib/oauth/oauth_client';
import Cookies from 'js-cookie';

import IntegrationDispatcher from '../../dispatchers/integration_dispatcher';

class BoxStore extends ReduceStore {
  constructor() {
    super(IntegrationDispatcher);
  }

  getInitialState() {
    return {
      folderID:       0,
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
          grant_type: 'authorization_code'
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
        type: 'BOX_REFRESH_TOKEN_DONE',
        authorizedData: authorizedData
      });
    }).catch((error) => {
      IntegrationDispatcher.dispatch({
        type: 'BOX_REFRESH_TOKEN_FAIL',
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

    let fileListingURL = `https://api.box.com/2.0/folders/${action.folderID}/items`;

    let queryData = {};
    if (action.nextPageToken) {
      queryData['offset'] = action.nextPageToken;
    }

    OAuthClient.get({
      accessToken: action.accessToken,
      url: fileListingURL,
      data: queryData,
      done: (response) => {

        IntegrationDispatcher.dispatch({
          type: 'BOX_LIST_FILES_DONE',
          files: action.nextPageToken ? newState.files.concat(response.entries) : response.entries,
          nextPageToken: response.offset > 0 ? response.offset : null
        });
      },
      fail: (xhr, status, error) => {
        IntegrationDispatcher.dispatch({
          type: 'BOX_LIST_FILES_FAIL',
          error
        });
      }
    });

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

    Cookies.remove('boxAccessToken', { domain: `.${window.APP_DOMAIN}` });

    OAuthClient.get({
      accessToken: action.accessToken,
      url: 'https://api.box.com/oauth2/revoke',
      data: { token: action.accessToken },
      done: (response) => {
        IntegrationDispatcher.dispatch({
          type: 'BOX_DISCONNECT_DONE',
          response
        });
      },
      fail: (xhr, status, error) => {
        IntegrationDispatcher.dispatch({
          type: 'BOX_DISCONNECT_FAIL',
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
      case 'BOX_LIST_FILES':
        return this.listFiles(state, action);

      case 'BOX_LIST_FILES_DONE':
        return this.listFilesDone(state, action);

      case 'BOX_LIST_FILES_FAIL':
        return this.listFilesFail(state, action);

      case 'BOX_DISCONNECT':
        return this.disconnect(state, action);

      case 'BOX_DISCONNECT_DONE':
        return this.disconnectDone(state, action);

      case 'BOX_DISCONNET_FAIL':
        return this.disconnectFail(state, action);

      default:
        return state;
    }
  }
}

export default new BoxStore();
