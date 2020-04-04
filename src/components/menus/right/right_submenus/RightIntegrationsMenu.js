/* global vex */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import inflection from 'inflection';
import Cookies from 'js-cookie';
import classNames from 'classnames';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';
import { listFiles as listDropboxFiles } from 'Src/newRedux/integrationFiles/dropbox/thunks';
import { listFiles as listGoogleFiles } from 'Src/newRedux/integrationFiles/google-drive/thunks';
import { listFiles as listBoxFiles } from 'Src/newRedux/integrationFiles/box/thunks';
import IconButton from 'Components/shared/buttons/IconButton';
import RightIntegrationsList from './integrations/RightIntegrationsList';
import RightSlackIntegrationsMenu from './integrations/RightSlackIntegrationsMenu';
import OAuthClient from 'Lib/oauth/oauth_client';

class RightIntegrationsMenu extends React.Component {

  static propTypes = {
    provider: PropTypes.string,
    displaySubmenu: PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),
    setRightMenuOpenForMenu: PropTypes.func,
  }

  handleSystemClick = (e, provider) => {
    e.preventDefault();
    this.handleIntegrationClick(provider);
  }

  handleIntegrationClick = async (provider) => {
    let refreshToken = Cookies.get(`${provider}RefreshToken`);
    let accessToken  = Cookies.get(`${provider}AccessToken`);

    let currentProvider = this.props.provider;

    if (currentProvider === provider) {
      this.props.setRightMenuOpenForMenu(null);
      return;
    }

    let pathname = window.location.href;
    let authClient = null;
    let grantType  = null;

    switch (provider) {
      case 'dropbox':
        authClient = OAuthClient.create({ provider, redirectTo: pathname });
        break;
      case 'google':
        grantType = 'refresh_token';
        authClient = OAuthClient.create({
          provider,
          scopes: [
            'https://www.googleapis.com/auth/drive'
          ],
          redirectTo: pathname
        });
        break;
      case 'box':
        grantType = 'authorization_code';
        authClient = OAuthClient.create({ provider, redirectTo: pathname });
        break;
    }

    // initiate OAuth procedure if accessToken is not present
    if (!accessToken && authClient) {
      let authURL = authClient.code.getUri();
      let providerName = inflection.capitalize(provider);
      let confirmMessage = `No valid ${providerName} connection found. Start connecting with ${providerName}?`;

      return vex.dialog.confirm({
        message: confirmMessage,
        callback: (value) => { if (value) window.location.href = authURL; },
      });
    }

    // refresh token if refreshToken is available
    if (!accessToken && refreshToken) {

      let token = authClient.createToken(
        accessToken,
        refreshToken,
        'Bearer',
        { data: { grant_type: grantType }}
      );

      const authorizedData = await token.refresh();

      Cookies.set(`${provider}RefreshToken`, authorizedData.refreshToken, {
        domain: `.${window.APP_DOMAIN}`,
        expires: 365
      });

      Cookies.set(`${provider}AccessToken`, authorizedData.accessToken, {
        domain: `.${window.APP_DOMAIN}`,
        expires: authorizedData.expires
      });

      accessToken  = Cookies.get(`${provider}AccessToken`);
    }

    if (accessToken) this.handleIntegrationExpansion(provider, accessToken);
  }

  handleIntegrationExpansion(provider, accessToken) {
    const { setRightMenuOpenForMenu, listGoogleFiles, listDropboxFiles, listBoxFiles, list } = this.props; // eslint-disable-line

    let defaultFolderID = { dropbox: '', 'box': 0, 'google': 'root' }[provider];

    const listFilesMethods = {
      'google': listGoogleFiles,
      'dropbox': listDropboxFiles,
      'box': listBoxFiles,
    };

    listFilesMethods[provider](accessToken, defaultFolderID, null);

    setRightMenuOpenForMenu(`Integrations_${provider}`);
  }

  render() {
    const { displaySubmenu, setRightMenuOpenForMenu } = this.props;
    let dropboxAccessToken = Cookies.get('dropboxAccessToken');
    let googleAccessToken  = Cookies.get('googleAccessToken');
    let boxAccessToken     = Cookies.get('boxAccessToken');
    let slackAccessToken   = Cookies.get(`${window.currentDomainName}-slackAccessToken`);

    let dropboxIconClass = classNames('mr10', 'fa', 'fa-dropbox', 'icon', { connected: !!dropboxAccessToken });
    let googleIconClass  = classNames('mr10', 'fa', 'fa-google', 'icon', { connected: !!googleAccessToken });

    let boxImageSrc = boxAccessToken ? '/images/icon-box-com-active.png' : '/images/icon-box-com.png';
    if (displaySubmenu == 'Integrations') {

      return (
        <div className="right-submenu">
          <div className="right-submenu_header">
            <IconButton
              fontAwesome
              icon="caret-left"
              onClick={() => this.props.setRightMenuOpenForMenu(true)}
            />
            <span className="ml5">Integrations</span>
          </div>
          {window.APP_ENV === 'on-the-moon' && (
            <a className="right-submenu_item option" onClick={e => this.handleSystemClick(e, 'box')}>
              <span>Box</span>
              <img className="mr10" src={boxImageSrc} />
            </a>
          )}
          <a
            href="https://chrome.google.com/webstore/detail/tiphive/lodocoecpbmojcpgglfmjmdfgkejonfd"
            className="right-submenu_item option"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="chrome-extension-heading">Chrome Extension</span>
            <img
              src="/images/chromewebstore.png"
              className="chrome-icon"
            />
          </a>
          <a className="right-submenu_item option" onClick={e => this.handleSystemClick(e, 'dropbox')}>
            <span>Dropbox</span>
            <i className={dropboxIconClass} />
          </a>
          <a className="right-submenu_item option" onClick={e => this.handleSystemClick(e, 'google')}>
            <span>Google Drive</span>
            <i className={googleIconClass} />
          </a>
          <a className="right-submenu_item option" onClick={() => setRightMenuOpenForMenu('Integrations_slack')}>
            <span>Slack</span>
            {!slackAccessToken
              ? <i className='mr10 fa fa-slack' />
              : <img src="/images/Slack_Mark_Web.png" alt="slack-mark" className="slack-icon" />
            }
          </a>
        </div>
      );
    } else {
      return (
        <div className={`${ typeof displaySubmenu == 'string' && displaySubmenu.includes('Integrations_') ? 'right-submenu_option-container presented' : 'right-submenu_option-container'}`}>
          { displaySubmenu == 'Integrations_google' && <RightIntegrationsList provider='google' /> }
          { displaySubmenu == 'Integrations_dropbox' && <RightIntegrationsList provider='dropbox' /> }
          { displaySubmenu == 'Integrations_box' && <RightIntegrationsList provider='box' /> }
          { displaySubmenu == 'Integrations_slack' && <RightSlackIntegrationsMenu /> }
        </div>);
    }
  }
}

const mapState = (state) => ({
  displaySubmenu: state._newReduxTree.ui.menus.displayRightSubMenuForMenu,
});

const mapDispatch = {
  setRightMenuOpenForMenu,
  listDropboxFiles,
  listGoogleFiles,
  listBoxFiles,
};

export default connect(mapState, mapDispatch)(RightIntegrationsMenu);
