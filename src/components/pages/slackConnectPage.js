import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

import LoginForm from './login_page/login_form';
import TipHiveLogo from '../shared/tiphive_logo';

import Auth from '../../lib/auth';
import Analytics from '../../lib/analytics';

class SlackConnectPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      pageLoadingEror: false,
      loginIsLoading: false,
      pageIsLoading: true,
      userExist: false,
      user: {},
    };
    this.renderContent = this.renderContent.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loginSuccess = this.loginSuccess.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();

    Auth.sweepUserData();

    var $loginForm = $(e.target);

    var email = $loginForm.find('#user_email').val().trim();
    var password = $loginForm.find('#user_password').val().trim();

    const { location: { query: { user_id, team_id } } } = this.props;

    this.setState({
      isLoading: true
    });

    var $loginXHR = APIRequest.post({
      resource: 'slack/connect',
      data: {
        email,
        password,
        user_id,
        team_id,
      },
    });

    $loginXHR.done((response, status, xhr) => {
      var user      = response.data;
      var authToken = user.attributes.auth_token;

      Auth.setCookie('authToken', authToken);
      Auth.setUser(user);
      Auth.setNotificationSettings(user);

      Auth.processAuthToken(this.loginSuccess);
    }).fail((xhr, status, error) => {
      Auth.sweepUserData();

      if (xhr.responseJSON && xhr.responseJSON.errors) {
        this.setState({
          errors: [xhr.responseJSON.errors.detail],
          loginIsLoading: false
        });
      } else {
        APIRequest.showErrorMessage(error);
      }
    });
  }

  loginSuccess(status) {
    if (status.isLogged) {
      Analytics.identify(window.currentUser);
      Analytics.track('Logged In');
      browserHistory.push('/');
    }
  }

  componentDidMount() {
    const { location: { query: { user_id, team_id } } } = this.props;
    APIRequest.post({
      resource: 'slack/get_user_details',
      data: {
        team_id,
        user_id,
      },
    }).done((response) => {
      const { data: { user, user_exist } } = response;
      this.setState({
        user,
        userExist: user_exist,
        pageIsLoading: false,
      });
    }).fail((xhr, status, error) => {
      this.setState({
        pageLoadingEror: true,
        pageIsLoading: false,
      });
    });
  }

  renderContent() {
    const { pageIsLoading, pageLoadingEror, user, userExist } = this.state;

    const scope = 'identity.basic,identity.email,identity.team,identity.avatar';
    const slackURL = `https://slack.com/oauth/authorize?scope=${scope}&client_id=${window.SLACK_APP_KEY}&state=login/${window.currentDomainName}&redirect_uri=${window.currentProtocol}://${window.APP_HOST}${window.APP_PORT ? ':' + window.APP_PORT : ''}/slack/auth`;

    if (pageLoadingEror) {
      return (
      <div className="col-sm-4 col-sm-offset-4">
        <p>An Error has occured please try again!</p>
      </div>
      );
    }
    if (pageIsLoading) {
      return (
        <div className="col-sm-4 col-sm-offset-4">
          <p>Page Loading Please wait</p>
        </div>
      );
    }
    if (userExist) {
      return (
        <div className="col-sm-8 col-sm-offset-4">
          <h3>A user is already connect with this account</h3>
          <p>Continue to <Link to="/login"><strong>Login</strong></Link></p>
        </div>
      );
    }

    return (
      <div className="col-sm-4 col-sm-offset-4 login-section">
        <h1 className="text-center form-heading">Login to connect your Slack</h1>
        <LoginForm errors={this.state.errors} handleSubmit={this.handleSubmit} isLoading={this.state.loginIsLoading}/>
        <div className="form-more-actions text-center">
          {
            user &&
            <div>
              <h3> If you have no account, Signup as </h3>
              <img src={user.profile_pic} alt={user.first_name} style={{ borderRadius: '50%' }}/>
              <p> {`${user.first_name} ${user.last_name}`}</p>
              <div style={{ margin: 'auto' }} className="text-center">
                <a href={slackURL}>
                  <img alt="Sign in with Slack" height="40" width="172" src="https://platform.slack-edge.com/img/sign_in_with_slack.png" srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x" />
                </a>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="container-fluid page-container-full">
        <div className="row">
          <div className="col-sm-12">
            <TipHiveLogo className="navbar-brand" />
          </div>
        </div>
        <div className="row">
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

export default SlackConnectPage;
