import React from 'react';
import TipHiveLogo from '../shared/tiphive_logo';
import APIRequest from '../../lib/ApiRequest';
import createClass from 'create-react-class';

var SAMLInitPage = createClass({
  componentDidMount: function() {
    var $ssoInitXHR = APIRequest.get({
      resource: 'saml/init'
    });

    $ssoInitXHR.done(function(response, status, xhr) {
      window.location.href = response.auth_request;
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
            <p className="text-center">Authorizing...</p>
          </div>
        </div>
      </div>
    );
  }
});

export default SAMLInitPage;
