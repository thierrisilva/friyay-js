import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { registerUser, resetUser } from 'Actions/appUser';
import TipHiveLogo from 'Components/shared/tiphive_logo';
import Alert from 'Components/shared/alert';
import analytics from 'Lib/analytics';
import qs from 'querystringify';

class JoinPage extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  state = {
    errors: null,
    isLoading: false,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  onChange = ({ target: { value, name } }) =>
    this.setState(state => ({ ...state, [name]: value }));

  componentWillMount() {
    this.props.reset();
  }

  componentDidMount() {
    analytics.track('Join Page Visited');
    $('#app-container').css('height', '100%');

    const queryStrings = qs.parse(this.props.location.search);
    if (queryStrings.email) {
      this.setState(state => ({
        ...state,
        email: queryStrings.email.toLowerCase()
      }));
    }
  }

  handleSubmit = async e => {
    e.preventDefault();
    analytics.track('New User Submitted Registration');
    const {
      state: { firstName, lastName, email, password, confirmPassword },
      props: { register, history, location }
    } = this;

    const queryStrings = qs.parse(location.search);
    this.setState({ isLoading: true });

    const invitationToken = queryStrings.invitation_token;

    const { error, user, isLogged } = await register({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      invitationToken: invitationToken
    });

    this.setState({ isLoading: false });

    if (error) {
      analytics.track('New User Registration Contained Error', {
        errors: error
      });
      this.setState({ errors: error });
    }
    if (isLogged) {
      analytics.track('New User Successfully Registered', { user: user });
      const hasToken = invitationToken !== undefined;

      analytics.alias(user);
      if (hasToken) {
        analytics.track('New User Joined From Invitation');
        history.push('/');
      } else {
        analytics.track('New User Joined From Homepage');
        history.push('/introduction/prompt');
      }
    }
  };

  render() {
    const {
      state: {
        errors,
        isLoading,
        firstName,
        lastName,
        email,
        password,
        confirmPassword
      }
    } = this;

    return (
      <div className="container-fluid page-container-full">
        <div className="row no-gutter full-height width95">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 full-height">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop30 text-center">
                <TipHiveLogo />
              </div>
            </div>

            <div className="row">
              <div className="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 col-md-4 col-md-offset-4">
                <div className="join-section">
                  <h4 className="title">
                    <span className="yellowShade">Welcome!</span>
                    <span className="greenShade">&nbsp;Bienvenue!</span>
                    <span className="pinkShade">&nbsp;Hoi!</span>
                    <br />
                    <span className="blueShade">Ola!</span>
                    <span className="purpleShade">&nbsp;Bem Vinda!</span>
                  </h4>
                  <h4 className="title2">Let's get you an account.</h4>

                  <div className="row">
                    <div className="col-sm-12 col-xs-12 marginTop20 padding0">
                      <form method="post" onSubmit={this.handleSubmit}>
                        <div className="inputGroup">
                          {errors && (
                            <Alert
                              type="danger"
                              message={
                                errors.title ||
                                'There are errors that prevent this form from being submitted:'
                              }
                              errors={errors.detail}
                            />
                          )}
                          <input
                            type="file"
                            name="user[avatar]"
                            className="hidden"
                          />

                          <div className="form-group">
                            <input
                              type="text"
                              name="firstName"
                              className="form-control"
                              placeholder="First name"
                              tabIndex={1}
                              required
                              value={firstName}
                              onChange={this.onChange}
                            />
                            <span className="separator"> </span>
                          </div>

                          <div className="form-group">
                            <input
                              type="text"
                              name="lastName"
                              className="form-control"
                              placeholder="Last name"
                              tabIndex={2}
                              required
                              value={lastName}
                              onChange={this.onChange}
                            />
                            <span className="separator"> </span>
                          </div>

                          <div className="form-group">
                            <input
                              type="email"
                              name="email"
                              className="form-control"
                              placeholder="Email address"
                              tabIndex={3}
                              required
                              value={email}
                              onChange={this.onChange}
                            />
                            <span className="separator"> </span>
                          </div>

                          <div className="form-group">
                            <input
                              type="password"
                              name="password"
                              className="form-control"
                              placeholder="Password"
                              tabIndex={4}
                              required
                              value={password}
                              onChange={this.onChange}
                            />
                            <span className="separator"> </span>
                          </div>

                          <div className="form-group">
                            <input
                              type="password"
                              name="confirmPassword"
                              className="form-control"
                              placeholder="Confirm password"
                              tabIndex={5}
                              required
                              value={confirmPassword}
                              onChange={this.onChange}
                            />
                            <span className="separator" />
                          </div>
                        </div>

                        <div className="form-group">
                          <button
                            type="submit"
                            className=""
                            disabled={isLoading}
                          >
                            <p>
                              Create your account{' '}
                              <i className="fa fa-long-arrow-right" />
                            </p>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="form-more-actions text-center">
                <p className="">
                  By creating an account, you accept our
                  <a
                    href="http://about.friyay.io/terms-of-service.html"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    &nbsp;Terms of Service
                  </a>
                  .
                  <br />
                  Already have an account? <a href="/login">Log in</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatch = {
  register: registerUser,
  reset: resetUser
};

export default withRouter(
  connect(
    null,
    mapDispatch
  )(JoinPage)
);
