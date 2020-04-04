import React from 'react';
import { Link } from 'react-router-dom';

import TipHiveLogo from '../shared/tiphive_logo';
import ForgotPasswordForm from './forgot_password_page/forgot_password_form';
import APIRequest from '../../lib/ApiRequest';
import createClass from 'create-react-class';

var ForgotPasswordPage = createClass({
  getInitialState: function() {
    return { errors: [] };
  },

  handleSubmit: function(e) {
    var _this = this;
    const { props: { location: { search }, history } } = this;
    e.preventDefault();
    var $resetPasswordForm = $(e.target);

    var userEmail = $resetPasswordForm.find('#user_email').val().trim();

    var $resetPasswordXHR = APIRequest.post({
      resource: 'passwords',
      data: {
        user: {
          email: userEmail
        }
      }
    });

    $resetPasswordXHR.done(function(response, status, xhr) {
      APIRequest.showSuccessMessage(response['message']);
      // _this.props.router.push('/login');
      history.push('/login');
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
            <h1 className="text-center form-heading">Forgot password</h1>
            <ForgotPasswordForm errors={this.state.errors} handleSubmit={this.handleSubmit} />
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

export default ForgotPasswordPage;
