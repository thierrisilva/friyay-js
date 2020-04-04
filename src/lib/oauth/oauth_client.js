import ClientOAuth2 from 'client-oauth2';
import Cookies from 'js-cookie';

let oauthConfig = {
  dropbox: {
    key:      window.DROPBOX_APP_KEY,
    secret:   window.DROPBOX_APP_SECRET,
    authURI:  window.DROPBOX_APP_AUTHORIZATION_URI,
    tokenURI: window.DROPBOX_APP_ACCESS_TOKEN_URI,
    auth:     null
  },
  google: {
    key:      window.GOOGLE_APP_KEY,
    secret:   window.GOOGLE_APP_SECRET,
    authURI:  window.GOOGLE_APP_AUTHORIZATION_URI,
    tokenURI: window.GOOGLE_APP_ACCESS_TOKEN_URI,
    auth:     null
  },
  box: {
    key:      window.BOX_APP_KEY,
    secret:   window.BOX_APP_SECRET,
    authURI:  window.BOX_APP_AUTHORIZATION_URI,
    tokenURI: window.BOX_APP_ACCESS_TOKEN_URI,
    auth:     null
  },
  slack: {
    key:      window.SLACK_APP_KEY,
    secret:   window.SLACK_APP_SECRET,
    authURI:  window.SLACK_APP_AUTHORIZATION_URI,
    tokenURI: window.SLACK_APP_ACCESS_TOKEN_URI,
    auth:     null,
  }
};

const OAuthClient = {
  create(options) {
    let query = options.query ? {...options.query} : {};
    switch (options.provider) {
      case 'google':
        query = { access_type: 'offline' }; // request Google for a refresh token
        break;
    }

    oauthConfig[options.provider].auth = new ClientOAuth2({
      clientId:         oauthConfig[options.provider].key,
      clientSecret:     oauthConfig[options.provider].secret,
      authorizationUri: oauthConfig[options.provider].authURI,
      accessTokenUri:   oauthConfig[options.provider].tokenURI,
      redirectUri:      options.redirectUri || `https://oauth.${window.APP_DOMAIN}/auth/callback/${options.provider}`,
      scopes:           options.scopes || [],
      state:            options.state || null,
      query:            query
    });

    if (options.redirectTo) Cookies.set('oauthRedirectTo', options.redirectTo, { domain: `.${window.APP_DOMAIN}` });

    return oauthConfig[options.provider].auth;
  },

  ajaxRequest(options) {
    let _options = options || {};

    let cleanedData = null;
    if (_options['data']) {
      cleanedData = _options['method'] !== 'GET' && typeof _options['data'] !== 'string'
        ? JSON.stringify(_options['data']) : _options['data'];
    }

    let $requestXHR = $.ajax({
      url:         _options['url'],
      method:      _options['method'],
      dataType:    'json',
      contentType: 'application/json',
      crossDomain: true,
      headers:     { 'Authorization': `Bearer ${_options['accessToken']}` },
      beforeSend:  _options['beforeSend'],
      data:        cleanedData
    });

    if (options['done']) $requestXHR.done(options['done']);
    if (options['fail']) $requestXHR.fail(options['fail']);
  },

  get(options) {
    let _options = options || {};
    return this.ajaxRequest({
      url: _options['url'],
      data: _options['data'],
      method: 'GET',
      accessToken: _options['accessToken'],
      beforeSend: _options['beforeSend'],
      done: _options['done'],
      fail: _options['fail']
    });
  },

  post(options) {
    let _options = options || {};
    return this.ajaxRequest({
      url: _options['url'],
      data: _options['data'],
      method: 'POST',
      accessToken: _options['accessToken'],
      beforeSend: _options['beforeSend'],
      done: _options['done'],
      fail: _options['fail']
    });
  },

  put(options) {
    let _options = options || {};
    return this.ajaxRequest({
      url: _options['url'],
      data: _options['data'],
      method: 'PUT',
      accessToken: _options['accessToken'],
      beforeSend: _options['beforeSend'],
      done: _options['done'],
      fail: _options['fail']
    });
  },

  patch(options) {
    let _options = options || {};
    return this.ajaxRequest({
      url: _options['url'],
      data: _options['data'],
      method: 'PATCH',
      accessToken: _options['accessToken'],
      beforeSend: _options['beforeSend'],
      done: _options['done'],
      fail: _options['fail']
    });
  },

  delete(options) {
    let _options = options || {};
    return this.ajaxRequest({
      url: _options['url'],
      data: _options['data'],
      method: 'DELETE',
      accessToken: _options['accessToken'],
      beforeSend: _options['beforeSend'],
      done: _options['done'],
      fail: _options['fail']
    });
  }
};

export default OAuthClient;
