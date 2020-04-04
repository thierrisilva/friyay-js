import IntegrationDispatcher from '../dispatchers/integration_dispatcher';

const IntegrationActions = {
  refreshToken(provider, accessToken, refreshToken) {
    let dispatchType = null;

    switch (provider) {
      case 'google':
        dispatchType = 'GOOGLE_REFRESH_TOKEN';
        break;
      case 'box':
        dispatchType = 'BOX_REFRESH_TOKEN';
        break;
    }

    IntegrationDispatcher.dispatch({
      type: dispatchType,
      provider,
      accessToken,
      refreshToken
    });
  },

  listFiles(provider, accessToken, folderID, nextPageToken) {
    let dispatchType = null;

    switch (provider) {
      case 'dropbox':
        dispatchType = 'DROPBOX_LIST_FILES';
        break;
      case 'google':
        dispatchType = 'GOOGLE_LIST_FILES';
        break;
      case 'box':
        dispatchType = 'BOX_LIST_FILES';
        break;
    }

    IntegrationDispatcher.dispatch({
      type: dispatchType,
      provider,
      accessToken,
      folderID,
      nextPageToken
    });
  },

  disconnect(provider, accessToken) {
    let dispatchType = null;

    switch (provider) {
      case 'dropbox':
        dispatchType = 'DROPBOX_DISCONNECT';
        break;
      case 'google':
        dispatchType = 'GOOGLE_DISCONNECT';
        break;
      case 'box':
        dispatchType = 'BOX_DISCONNECT';
        break;
    }

    IntegrationDispatcher.dispatch({
      type: dispatchType,
      provider,
      accessToken
    });
  }
};

export default IntegrationActions;
