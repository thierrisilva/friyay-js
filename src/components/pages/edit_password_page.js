import React from 'react';
import { Link } from 'react-router-dom';

import EditPasswordForm from './edit_password_page/edit_password_form';
import TipHiveLogo from '../shared/tiphive_logo';

import APIRequest from '../../lib/ApiRequest';
import Auth from '../../lib/auth';
import createClass from 'create-react-class';
import qs from 'querystringify';

import { failure } from 'Utils/toast';

var EditPasswordPage = createClass({
  getInitialState: function() {
    return { errors: [] };
  },

  componentDidMount: function() {
    const { props: { location: { search }, history } } = this;
    const queryStrings = qs.parse( search );
    const resetPasswordToken = queryStrings.reset_password_token;

    // var resetPasswordToken = this.props.location.query.reset_password_token;
    if (!resetPasswordToken || resetPasswordToken === undefined || resetPasswordToken === null) {
      // APIRequest.showErrorMessage('You should not come to this page without a reset password token.');
      failure('You should not come to this page without a reset password token.');
      history.push('/login');
    }
  },

  handleSubmit: function(e) {
    var _this = this;
    e.preventDefault();

    const { props: { location: { search }, history } } = this;
    const queryStrings = qs.parse( search );
    const resetPasswordToken = queryStrings.reset_password_token;

    var $resetPasswordForm = $(e.target);

    var userNewPassword = $resetPasswordForm.find('#user_password').val().trim();
    var userNewPasswordConfirmation = $resetPasswordForm.find('#user_password_confirmation').val().trim();

    var $resetPasswordXHR = APIRequest.put({
      resource: 'passwords',
      data: {
        user: {
          reset_password_token: resetPasswordToken,
          password: userNewPassword,
          password_confirmation: userNewPasswordConfirmation
        }
      }
    });

    $resetPasswordXHR.done(function(response, status, xhr) {
      APIRequest.showSuccessMessage('Your password has been changed successfully. You are now signed in.');

      var authToken = response.data.attributes.auth_token;
      Auth.setCookie('authToken', authToken);

      Auth.processAuthToken(function(status) {
        if (status.isLogged) {
          _this.props.history.push('/');
        }
      });
    }).fail(function(xhr, status, error) {
      _this.setState({ errors: xhr.responseJSON.errors });
    });
  },

  render: function() {
    var signUpAction;
    if (!window.isSubdomain) {
      signUpAction = <p>Need an account? <Link to="/join"><strong>Sign up</strong></Link></p>;
    }

    return (
      <div className="container-fluid page-container-full">
        <div className="row">
          <div className="col-sm-12">
            <TipHiveLogo className="navbar-brand" />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-4 col-sm-offset-4 login-section">
            <h1 className="text-center form-heading">Reset password</h1>
            <EditPasswordForm errors={this.state.errors} handleSubmit={this.handleSubmit} />
            <div className="form-more-actions text-center">
              {signUpAction}
              <p>Already have an account? <Link to="/login"><strong>Sign in</strong></Link></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default EditPasswordPage;
