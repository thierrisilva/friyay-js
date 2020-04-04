import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser, resetUser } from 'Actions/appUser';
import { slackCheck } from 'Src/newRedux/integrationFiles/slack/thunks';
import TipHiveLogo from 'Components/shared/tiphive_logo';
import Alert from 'Components/shared/alert';
import analytics, { createUserForMixpanelFromReduxUser } from 'Lib/analytics';
import Auth from 'Lib/auth';
import { setLaunchComplete } from 'Src/newRedux/session/actions';
import { getRedirectUriForSlack } from 'Lib/utilities';

class LoginPage extends Component {
  static propTypes = {
    reset: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    error: PropTypes.shape({
      title: PropTypes.string,
      details: PropTypes.array
    }),
    isLoading: PropTypes.bool,
    history: PropTypes.object.isRequired,
    slackCheck: PropTypes.func,
    slack: PropTypes.shape({}),
    domain: PropTypes.shape({})
  };

  state = {
    email: '',
    password: ''
  };

  async componentDidMount() {
    this.props.reset();
    this.props.slackCheck();
    this.props.setLaunchComplete(false);
    const destination = await Auth.validateToken('');
    if (destination != '/login') {
      this.redirectIfSubdomain();
    }
  }

  onChange = ({ target: { name, value } }) =>
    this.setState(state => ({ ...state, [name]: value }));

  redirectIfSubdomain = () => {
    const { history } = this.props;
    if (window.isSubdomain === false) {
      history.push('/choose_domain');
    } else {
      history.push('/');
    }
  };

  handleSubmit = async e => {
    e.preventDefault();

    const {
      props: { reset, login },
      state: { email, password }
    } = this;

    reset();
    const { isLogged, user } = await login({ email, password });

    if (isLogged) {
      analytics.identify(createUserForMixpanelFromReduxUser(user));
      analytics.track('Logged In');

      this.redirectIfSubdomain();
    }
  };

  render() {
    const {
      props: {
        error: { title, details },
        isLoading,
        slack: { hasSlack }
      }
    } = this;

    let loginHeader = <h1 className="text-center form-heading">Login</h1>;
    let signUpAction = null;

    const scope = 'identity.basic,identity.email,identity.team,identity.avatar';

    const slackURL = `https://slack.com/oauth/authorize?scope=${scope}&client_id=${
      window.SLACK_APP_KEY
    }&state=login/${
      window.currentDomainName
    }&redirect_uri=${getRedirectUriForSlack()}`;

    if (window.isSubdomain) {
      loginHeader = (
        <h1 className="text-center form-heading">
          Login to
          <br />
          <small>{window.currentHost}</small>
        </h1>
      );
    } else {
      signUpAction = (
        <p>
          Need an account?{' '}
          <a href="/join">
            <strong>Sign up</strong>
          </a>
        </p>
      );
    }

    return (
      <div className="container-fluid page-container-full">
        <div className="row">
          <div className="col-sm-12 text-center pt15">
            <TipHiveLogo />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12 login-section">
            {loginHeader}

            <form
              method="post"
              className="concise"
              action="#"
              onSubmit={this.handleSubmit}
            >
              {(title || details.length > 0) && (
                <Alert
                  type="danger"
                  message={
                    title ||
                    'There are errors that prevent this form from being submitted:'
                  }
                  errors={details}
                />
              )}
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  onChange={this.onChange}
                  className="form-control"
                  placeholder="Email address"
                  defaultValue={Auth.getCookie('user_email')}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  onChange={this.onChange}
                  className="form-control"
                  placeholder="Password"
                  required
                />
              </div>

              <div
                className="form-group mt20"
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <input
                  style={{ width: 100 }}
                  disabled={isLoading}
                  type="submit"
                  name="submit"
                  className="btn btn-default btn-block text-center"
                  value={isLoading ? 'Sending...' : 'Login'}
                />
              </div>
            </form>

            <div className="form-more-actions text-center">
              {signUpAction}
              <p>
                Forgot password?{' '}
                <Link to="/forgot_password">
                  <strong>Reset</strong>
                </Link>
              </p>
            </div>

            {hasSlack && (
              <div className="form-more-actions text-center">
                <h2 className="text-center form-heading"> OR </h2>
                <a href={slackURL}>
                  <img
                    alt="Sign in with Slack"
                    height="40"
                    width="172"
                    src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
                    srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
                  />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  error: state.appUser.error,
  isLoading: state.appUser.isLoading,
  slack: state._newReduxTree.integrationFiles.slack
});

const mapDispatch = {
  login: loginUser,
  reset: resetUser,
  slackCheck,
  setLaunchComplete
};

export default connect(
  mapState,
  mapDispatch
)(LoginPage);
