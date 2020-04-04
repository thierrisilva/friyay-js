import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import PushNotification from 'Lib/push_notification';
import NotificationActions from 'Src/actions/notification_actions';

import { stateMappings } from 'Src/newRedux/stateMappings';
import IconButton from 'Components/shared/buttons/IconButton';

import ReactDOMServer from 'react-dom/server';
import SearchPending from 'Components/pages/search_page/search_pending';
import SearchSuggestion from 'Components/pages/search_page/search_suggestion';
import SearchHeader from 'Components/pages/search_page/search_header';
import SearchNotFound from 'Components/pages/search_page/search_not_found';
import SearchEngine from 'Lib/search_engine';
import Tour from 'Lib/tour';
import { toggleLeftMenu } from 'Src/newRedux/interface/menus/thunks';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import ButtonMenuOpenDismiss from 'Components/shared/buttons/ButtonMenuOpenDismiss';
import NotificationIndicator from 'Components/shared/notifications/NotificationIndicator';
import { setEditCardModalOpen } from 'Src/newRedux/interface/modals/actions';
import Breadcrumbs from 'Src/components/navigation/breadcrumbs/Breadcrumbs';
import Icon from 'Src/components/shared/Icon';
import { logoutUser } from 'Actions/appUser';
import { showSearchModal } from 'Src/newRedux/database/search/thunks';
import { viewPerson } from 'Src/newRedux/database/people/thunks';
import { setEditUserModalOpen } from 'Src/newRedux/interface/modals/actions';
import SearchModal from './SearchModal';
import { ColouredDots } from '../../shared/Dots';
import { getUnreadNotifications } from 'Src/newRedux/database/notifications/selectors';
import WorkspaceModal from 'Components/pages/workspace';
import { yayDesign } from 'Src/lib/utilities';

class TopSearchBar extends Component {
  static propTypes = {
    displayLeftMenu: PropTypes.bool,
    setEditCardModalOpen: PropTypes.func.isRequired,
    toggleLeftMenu: PropTypes.func.isRequired,
    showSearchModal: PropTypes.func.isRequired,
    viewPerson: PropTypes.func.isRequired,
    currentUser: PropTypes.object.isRequired,
    unreadNotifications: PropTypes.array,
    rootUrl: PropTypes.string.isRequired,
    routerHistory: PropTypes.object.isRequired,
    setEditUserModalOpen: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
  };

  state = {
    displayMainFormModal: false,
    slug: null
  };

  componentDidMount() {
    const $searchInput = $('#search-input');

    if (localStorage.tourIntroductionFinished === undefined) {
      Tour.startIntroductionTour();
    }
    this.subscribeNotification();

    SearchEngine.clear();
    $searchInput.typeahead(null, {
      source: SearchEngine.ttAdapter(),
      limit: 20,
      display: item => item.name,
      templates: {
        pending(search) {
          const pendingHTML = ReactDOMServer.renderToString(
            <SearchPending search={search} />
          );
          return $(pendingHTML);
        },
        suggestion(item) {
          const suggestionHTML = ReactDOMServer.renderToString(
            <SearchSuggestion
              label={item.label}
              resource_type={item.resource_type}
              item={item.data}
            />
          );
          return $(suggestionHTML);
        },
        header(search) {
          const headerHTML = ReactDOMServer.renderToString(
            <SearchHeader search={search} />
          );
          return $(headerHTML);
        },
        notFound(search) {
          const notFoundHTML = ReactDOMServer.renderToString(
            <SearchNotFound search={search} />
          );
          return $(notFoundHTML);
        }
      }
    });

    $searchInput.bind(
      'typeahead:select',
      (
        e,
        {
          data: {
            attributes: { resource_type, slug }
          }
        }
      ) => {
        let resource = null;

        switch (resource_type) {
          case 'topics':
            resource = 'topics';
            break;

          case 'tips':
            resource = 'cards';
            break;

          case 'users':
          case 'domainmembers':
            resource = 'users';
            break;

          default:
            break;
        }
      }
    );
  }

  subscribeNotification = () => {
    const { currentUser } = this.props;
    const channelName =
      window.currentDomain.id != 0
        ? `${window.currentDomain.attributes.tenant_name}-activities`
        : 'public-activities';

    import('Src/sockets/activity_socket').then(activitySocket => {
      PushNotification.subscribe(
        currentUser.id,
        activitySocket.default,
        NotificationActions,
        channelName
      );
    });
  };

  handleToggleLeftMenu = () =>
    this.props.toggleLeftMenu(!this.props.displayLeftMenu);

  handleToggleMainFormModal = () =>
    this.setState(state => ({
      displayMainFormModal: !state.displayMainFormModal
    }));

  /**
   * On click search event handler.
   *
   * @param {Event} e
   * @return {Void}
   */
  handleClickSearch = e => {
    e.preventDefault();
    this.props.showSearchModal();
  };

  handleSSOLogout = e => {
    e.preventDefault();
    this.props.router.push('/saml/init_logout');
  };

  handleLogout = async () => {
    await this.props.logout();
    this.props.routerHistory.push('/login');
  };

  render() {
    const {
      displayLeftMenu,
      setEditCardModalOpen,
      unreadNotifications,
      currentUser,
      viewPerson,
      rootUrl,
      active_design = {},
      setEditUserModalOpen
    } = this.props;

    const notifDotClass =
      unreadNotifications && unreadNotifications.length ? 'hasUnread' : '';
    const peopleUrl = (rootUrl == '/' ? '' : rootUrl) + '/users';
    const userUrl = peopleUrl + `/${currentUser.id}`;
    const { workspace_font_color } = active_design;

    return (
      <div
        className={`top-search-bar ${
          displayLeftMenu ? 'top-search-bar-radius' : ''
        }`}
        id="topSearchBar"
      >
        <div className="top-bar-left-menu">
          <ButtonMenuOpenDismiss
            color={workspace_font_color}
            isOpen={displayLeftMenu}
            onClick={this.handleToggleLeftMenu}
            additionalClasses="dark-grey-icon-button"
          />
          <WorkspaceModal color={workspace_font_color} />
          <Breadcrumbs />
        </div>

        <div className="top-bar-right-menu dots-layer-container">
          <ColouredDots
            color={workspace_font_color}
            className={notifDotClass}
            unreadCount={unreadNotifications.length}
          />
          <button
            className="btn-like-search-form link-tooltip-container"
            onClick={this.handleClickSearch}
          >
            <Icon
              color={workspace_font_color || '#63a0c3'}
              icon="search"
              fontAwesome
            />
            <div className="link-tooltip bottom">Search</div>
          </button>
          <div className="top-search-bar_right-button notif-bell">
            <NotificationIndicator />
          </div>
          <div className="top-search-bar_right-button">
            <Link to={peopleUrl} className="icon-users">
              <Icon
                color={workspace_font_color}
                icon="user"
                fontAwesome
                additionalClasses={'icon-people'}
              />
              <Icon
                color={workspace_font_color}
                icon="user"
                fontAwesome
                containerClasses={'icon-right'}
                additionalClasses={'icon-people'}
              />
            </Link>
          </div>
          <div className="top-search-bar_right-button dropdown">
            <ul className="user-nav-right">
              <li className="dropdown">
                <a
                  className="dropdown-toggle user-dropdown-toggle"
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <UserAvatar
                    user={currentUser}
                    margin={0}
                    size={18}
                    tooltipText={false}
                  />
                </a>
                <ul className="dropdown-menu user-dropdown-menu-bottom">
                  <li>
                    <Link to={userUrl}>
                      <i className="glyphicon glyphicon-user" /> Profile
                    </Link>
                  </li>
                  <li role="separator" className="menu-divider" />
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
                </ul>
              </li>
            </ul>
          </div>
          <div className="top-search-bar_right-button">
            <IconButton
              icon="add_box"
              color={workspace_font_color || '#6bc289'}
              onClick={() => setEditCardModalOpen(true)}
            />
          </div>
        </div>
        <SearchModal />
      </div>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);
  const { menus, user, page, topics, routing } = sm;
  const active_design = yayDesign(page.topicId, topics[page.topicId]);

  return {
    active_design,
    displayLeftMenu: menus.displayLeftMenu,
    currentUser: user,
    routerHistory: routing.routerHistory,
    unreadNotifications: getUnreadNotifications(state),
    rootUrl: page.rootUrl
  };
};

const mapDispatch = {
  setEditCardModalOpen,
  setEditUserModalOpen,
  logout: logoutUser,
  toggleLeftMenu,
  showSearchModal,
  viewPerson
};

export default connect(
  mapState,
  mapDispatch
)(TopSearchBar);
