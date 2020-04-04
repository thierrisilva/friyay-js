import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TipHiveLogo from '../shared/tiphive_logo';
import qs from 'querystringify';
import { slackAdd, slackLogin } from 'Src/newRedux/integrationFiles/slack/thunks';
import { getRedirectUriForSlack } from 'Lib/utilities';

class SlackAuthPage extends Component {

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }),
    location: PropTypes.shape({
      search: PropTypes.string,
    }),
    slackAdd: PropTypes.func,
    slackLogin: PropTypes.func,
  }

  componentDidMount() {
    const { code = '', state = '', isSubDomain = false } = qs.parse(this.props.location.search);
    const inviteAllusers = !!state.split('/')[2];
    if (!isSubDomain) {
      window.location.href = `${this.getRedirectUri(state)}/slack/auth?code=${code}&state=${state}&isSubDomain=yes`;
    }

    const redirectUri = getRedirectUriForSlack();

    if (code && state.indexOf('login') !== -1) {
      this.props.slackLogin(code, redirectUri);
    } else if (code && state.indexOf('integration') !== -1 ) {
      this.props.slackAdd(code, redirectUri, inviteAllusers);
    }
    this.props.history.push('/');
  }

  getRedirectUri = (state) => {
    const domain = state ? state.split('/')[1] : '';
    const { protocol, hostname, port } = window.location;
    const redirectUri = `${protocol}//${domain}${domain ? '.' : ''}${hostname}${port ? ':' + port : ''}`;
    // a work around to allow testing in staging
    if (window.appEnv == 'staging') return `${protocol}//${domain}.staging.tiphive.com`;
    return redirectUri;
  }

  render() {
    const state = qs.parse(this.props.location.search).state || '';
    return (
      <div className="container-fluid page-container-full">
        <div className="row">
          <div className="col-sm-12">
            <TipHiveLogo className="navbar-brand" />
          </div>
        </div>

        <div className="row">
          <div className="container">
            {
              state === 'login'
                ? <p className="text-center">Authorizing Slack Login...</p>
                : <p className="text-center">Authorizing Slack integration...</p>
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatch = {
  slackAdd,
  slackLogin,
};

export default connect(null, mapDispatch)(SlackAuthPage);
