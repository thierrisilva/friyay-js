import React from 'react';
import TipHiveLogo from '../shared/tiphive_logo';
import Auth from '../../lib/auth';
import createClass from 'create-react-class';

var SAMLAuthPage = createClass({
  componentDidMount: function() {
    var responseJSON = this.props.route.responseJSON;

    if (responseJSON) {
      var data = responseJSON.data;

      if (data.type === 'users') {
        var authToken = data.attributes.auth_token;

        Auth.setCookie('userID', data.id);
        Auth.setCookie('authToken', authToken);
        Auth.setUser(data);

        this.props.router.push('/');
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
            <p className="text-center">Authorizing...</p>
          </div>
        </div>
      </div>
    );
  }
});

export default SAMLAuthPage;
