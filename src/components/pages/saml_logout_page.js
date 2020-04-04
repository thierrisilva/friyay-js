import React from 'react';
import TipHiveLogo from '../shared/tiphive_logo';
import APIRequest from '../../lib/ApiRequest';
import Auth from '../../lib/auth';
import createClass from 'create-react-class';

var SAMLLogoutPage = createClass({
  componentDidMount: function() {
    var _this = this;
    var responseJSON = this.props.route.responseJSON;

    if (responseJSON) {
      var transaction_id = localStorage.getItem('sso_logout_transaction_id');
      var samlResponse = responseJSON.SAMLResponse;

      if (samlResponse && transaction_id) {
        var $logoutXHR = APIRequest.post({
          resource: 'saml/logout',
          data: {
            SAMLResponse: samlResponse,
            transaction_id: transaction_id
          }
        });

        $logoutXHR.done(function(response, status, xhr) {
          Auth.logout(_this.props.router);
        });
      }
    }
  },

  render: function() {
    return (
      <div className="container-fluid page-container-full">
        <div className="row">
          <div className="col-sm-12">
            <TipHiveLogo className="navbar-brand" />
          </div>
        </div>

        <div className="row">
          <div className="container">
            <p className="text-center">Logging out...</p>
          </div>
        </div>
      </div>
    );
  }
});

export default SAMLLogoutPage;
