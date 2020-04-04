import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import ActivityMenu from './activity_menu';
import { markAllRead, markAsRead, getLatest } from 'Actions/notifications';
import { identity } from 'ramda';

let notificationsPollingInterval;

const PAGE_TITLE = 'Friyay App';
const ALERT_FAVICON = '/favicon_alert.ico';
const REGULAR_FAVICON = '/favicon.ico';

class ActivityContainer extends Component {
  componentDidMount() {
    const {
      props: { notifications, isLoading, getLatestNotifications }
    } = this;

    if (notifications.length === 0 && !isLoading) {
      getLatestNotifications();
    }
  }

  componentWillUnmount() {
    if (notificationsPollingInterval) {
      clearInterval(notificationsPollingInterval);
    }
  }

  onMarkAsReadClick = () => this.props.markAllAsRead();

  onMarkOneReadClick = id => this.props.markOneAsRead(id);

  getPageTitle = () => {
    const {
      props: { hasUnread, notifications }
    } = this;
    const unreadCount = notifications
      .filter(identity)
      .filter(x => !x.attributes.read_at).length;
    return hasUnread ? `(${unreadCount})${PAGE_TITLE}` : PAGE_TITLE;
  };

  render() {
    const {
      props: { group, hasUnread, notifications }
    } = this;

    return (
      // didn't remember I already implemented stay-open class to keep dropdown stay open on click!
      <li className="dropdown stay-open" id="activity-dropdown">
        <a className="dropdown-toggle notification-link" data-toggle="dropdown">
          <i className="glyphicon glyphicon-bell" />{' '}
          {hasUnread && <span className="badge">&nbsp;</span>}
        </a>
        <Helmet>
          <title>{this.getPageTitle()}</title>
          <link rel="icon" href={hasUnread ? ALERT_FAVICON : REGULAR_FAVICON} />
        </Helmet>

        <ActivityMenu
          notifications={notifications}
          hasUnread={hasUnread}
          group={group}
          onMarkAsReadClick={this.onMarkAsReadClick}
          onMarkOneReadClick={this.onMarkOneReadClick}
        />
      </li>
    );
  }
}

ActivityContainer.propTypes = {
  group: PropTypes.object,
  markAllAsRead: PropTypes.func.isRequired,
  markOneAsRead: PropTypes.func.isRequired,
  getLatestNotifications: PropTypes.func.isRequired,
  notifications: PropTypes.array,
  loadsCount: PropTypes.number,
  isLoading: PropTypes.bool,
  hasUnread: PropTypes.bool
};

const mapState = ({
  notifications: { loadsCount, hasUnread, collection: notifications, isLoading }
}) => ({
  notifications,
  loadsCount,
  hasUnread,
  isLoading
});

const mapDispatch = {
  markAllAsRead: markAllRead,
  markOneAsRead: markAsRead,
  getLatestNotifications: getLatest
};

export default connect(
  mapState,
  mapDispatch
)(ActivityContainer);
