import React from 'react';
import Cookies from 'js-cookie';
import TipHiveLogo from '../shared/tiphive_logo';
import createClass from 'create-react-class';

var SAMLInitLogoutPage = createClass({
  componentDidMount: function() {
    var $ssoInitXHR = APIRequest.post({
      resource: 'saml/logout',
      data: {
        slo: true,
        email: localStorage.userEmail
      }
    });

    $ssoInitXHR.done(function(response, status, xhr) {
      Cookies.set('sso_logout_transaction_id', response.transaction_id);
      localStorage.sso_logout_transaction_id = response.transaction_id;
      window.location.href = response.logout_request;
    }).fail(function(xhr, status, error) {

    });
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

export default SAMLInitLogoutPage;
