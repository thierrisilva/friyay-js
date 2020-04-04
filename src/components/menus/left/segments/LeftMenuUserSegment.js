import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tiphive from 'lib/tiphive';
import { connect } from 'react-redux';
import { logoutUser } from 'Actions/appUser';
import UserAvatar from 'Src/components/shared/users/elements/UserAvatar';
import UserUpdateFormPage from 'Src/components/pages/user_update_form_page';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { setEditUserModalOpen } from 'Src/newRedux/interface/modals/actions';
import { viewPerson } from 'Src/newRedux/database/people/thunks';

const IDEAS_URL = `${window.SUPPORT_URL}/yays/${window.IDEAS_TOPIC_ID}`;
const WELCOME_URL = `${window.SUPPORT_URL}/yays/${window.WELCOME_TOPIC_ID}`;

class LeftMenuUserSegment extends Component {
  static propTypes = {};

  handleSSOLogout = e => {
    e.preventDefault();
    this.props.router.push('/saml/init_logout');
  };

  handleChatClick = e => {
    e.preventDefault();

    $crisp.push(['do', 'chat:open']);
    $crisp.push(['do', 'chat:show']);

    $crisp.push([
      'on',
      'chat:closed',
      () => {
        $crisp.push(['do', 'chat:hide']);
        $crisp.push(['off', 'chat:closed']);
      }
    ]);
  };

  handleLogout = async () => {
    await this.props.logout();
    this.props.routerHistory.push('/login');
  };

  render() {
    if (tiphive.isSupportDomain()) {
      return null;
    }

    const { logout, user, setEditUserModalOpen, showTourButton } = this.props;

    return (
      <div className="left-menu-user">
        <div className="flex-r-center-spacebetween left-menu-user-nav pl10 full-width">
          <ul className="nav navbar-nav">
            <li>
              <UserAvatar
                user={user}
                showName
                canClick
                onClick={viewPerson(user.id)}
              />
            </li>
          </ul>

          <ul className="user-nav-right hidden">
            <li className="dropdown">
              <a
                className="dropdown-toggle user-dropdown-toggle"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="fa fa-caret-up" />
              </a>
              <ul className="dropdown-menu user-dropdown-menu">
                {showTourButton && [
                  <li key="handle-show-tour-link">
                    <a>
                      {/* <a onClick={handleShowTour}> */}
                      <i className="glyphicon glyphicon-road" /> Show Tour
                    </a>
                  </li>,
                  <li
                    key="handle-show-tour-divider"
                    role="separator"
                    className="menu-divider"
                  />
                ]}
                {window.APP_ENV === 'production' && [
                  <li key="handle-chat-link">
                    <a href="#javascript" onClick={this.handleChatClick}>
                      <i className="fa fa-comments" /> Chat With Us!
                    </a>
                  </li>,
                  <li
                    key="handle-chat-separator"
                    role="separator"
                    className="menu-divider"
                  />
                ]}
                {/* Hid links while new support comes live
                  <li>
                    <a
                      href={`${window.SUPPORT_URL}/yays/${
                        window.SUPPORT_TOPIC_ID
                      }`}
                      target="_blank"
                    >
                      <i className="glyphicon glyphicon-cloud" /> Support
                    </a>
                  </li>
                  <li role="separator" className="menu-divider" />
                  <li>
                    <a href={WELCOME_URL} target="_blank">
                      <i className="glyphicon glyphicon-cloud" /> Welcome Topic
                    </a>
                  </li>
                  <li role="separator" className="menu-divider" />
                  <li>
                    <a to={IDEAS_URL} target="_blank">
                      <i className="glyphicon glyphicon-cloud" /> Topic Ideas
                    </a>
                  </li>
                  <li role="separator" className="menu-divider" />
                */}
                <li>
                  <a onClick={() => setEditUserModalOpen(true)}>
                    <i className="glyphicon glyphicon-cog" /> Settings
                  </a>
                </li>
                <li role="separator" className="menu-divider" />
                <li>
                  <a onClick={this.handleLogout}>
                    <i className="glyphicon glyphicon-log-out" /> Logout
                  </a>
                </li>
                <li className="hide">
                  <a onClick={this.handleSSOLogout}>
                    <i className="glyphicon glyphicon-log-out" /> SSO Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  return {
    routerHistory: sm.routing.routerHistory,
    user: sm.user
  };
};

const mapDispatch = {
  logout: logoutUser,
  setEditUserModalOpen,
  viewPerson
};
export default connect(
  mapState,
  mapDispatch
)(LeftMenuUserSegment);
