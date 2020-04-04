import React, { Component } from 'react';
import TipHiveLogo from '../shared/tiphive_logo';
import { connect } from 'react-redux';
import { logoutUser } from 'Actions/appUser';
import { withRouter } from 'react-router';

class PageContainerFull extends Component {
  handleLogout = async () => {
    await this.props.logoutUser();
    const { history } = this.props;
    history.push('/login');
  };

  render = function() {
    return (
      <div className="container-fluid page-container-full">
        <div className="row">
          <div className="col-sm-12">
            <TipHiveLogo className="navbar-brand" />
            <a onClick={this.handleLogout} className="logout">
              <i className="glyphicon glyphicon-log-out" /> Logout
            </a>
          </div>
        </div>

        {this.props.children}

        <div id="primary-dialog" />
        <div id="secondary-dialog" />
      </div>
    );
  };
}

const mapDispatch = { logoutUser };

export default connect(
  undefined,
  mapDispatch
)(withRouter(PageContainerFull));
