import React, { Component } from 'react';
import PropTypes from 'prop-types';

import OAuthClient from '../../lib/oauth/oauth_client';

import Cookies from 'js-cookie';

class AuthCallbackPage extends Component {
  constructor(props) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    let { match: { params: { provider } } } = this.props;

    let authClient = OAuthClient.create({ provider: provider });

    authClient.code.getToken(window.location.href).then((authorizedData) => {
      let accessToken  = authorizedData.accessToken;
      let refreshToken = authorizedData.refreshToken;

      // Refresh current access token if refresh token is available
      if (refreshToken) {
        authorizedData.refresh().then(function (updatedData) {
          // store refreshToken to DB?
          Cookies.set(`${provider}RefreshToken`, refreshToken, {
            domain: `.${window.APP_DOMAIN}`,
            expires: 365
          });

          if (updatedData !== authorizedData) {
            accessToken = updatedData.accessToken;
          }
        });
      }

      // store accessToken to DB?
      Cookies.set(`${provider}AccessToken`, accessToken, {
        domain: `.${window.APP_DOMAIN}`,
        expires: authorizedData.expires
      });

      // should redirect user back to original URL
      let oauthRedirectTo = Cookies.get('oauthRedirectTo');

      if (oauthRedirectTo) {
        window.location.href = oauthRedirectTo;
        Cookies.remove('oauthRedirectTo', { domain: `.${window.APP_DOMAIN}` });
      } else {
        window.location.href = `//${window.APP_DOMAIN}`;
      }

    });
  }

  render() {
    let oauthRedirectTo = Cookies.get('oauthRedirectTo');

    let returnURL = oauthRedirectTo ? oauthRedirectTo : `//${window.APP_DOMAIN}`;

    return (
      <div id="app-container">
        <div className="container">
          <div className="col-sm-12">
            <h4 className="text-center text-muted">
              <p>Checking OAuth2 authorization code, please wait... <img src="/images/ajax-loader.gif" /></p>
            </h4>
            <p className="text-center text-muted">
              Waited for too long? <a href={returnURL}>Click here to go back</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

AuthCallbackPage.propTypes = {
  location: PropTypes.object,
  params: PropTypes.object
};

export default AuthCallbackPage;
