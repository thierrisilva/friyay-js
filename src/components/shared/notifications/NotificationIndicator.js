import React, { Component } from 'react';
import { array, bool } from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { getUnreadNotifications } from 'Src/newRedux/database/notifications/selectors';
import NotificationListing from './NotificationListing';
import { stateMappings } from 'Src/newRedux/stateMappings';
import {
  showNotificationModal,
  hideNotificationModal
} from 'Src/newRedux/database/notifications/thunks';

import ReactModal from 'react-modal';
import IconButton from 'Src/components/shared/buttons/MaterialIconButton';

const ALERT_FAVICON = '/favicon_alert.ico';
const REGULAR_FAVICON = '/favicon.ico';

class NotificationIndicator extends Component {
  constructor(props) {
    super(props);
    this.hideNotificationModal = props.hideNotificationModal;
    this.showNotificationModal = props.showNotificationModal;
  }

  handleClickNotification = e => {
    this.showNotificationModal();
  };

  handleClickClose = e => {
    e.preventDefault();
    this.hideNotificationModal();
  };

  render() {
    const { unreadNotifications, isModalShown } = this.props;
    const hasUnread = unreadNotifications.length > 0;

    return (
      <div
        className="notification-indicator_container dropdown stay-open"
        id="activity-dropdown"
      >
        {hasUnread && (
          <span className="notification-indicator_count">
            {unreadNotifications.length}
          </span>
        )}
        <a
          className="dropdown-toggle notification-indicator"
          data-toggle="dropdown"
          onClick={this.handleClickNotification}
        >
          <i className="glyphicon glyphicon-bell" />
          {hasUnread && <span className="badge">&nbsp;</span>}
        </a>
        <Helmet>
          <link rel="icon" href={hasUnread ? ALERT_FAVICON : REGULAR_FAVICON} />
        </Helmet>
        <div id="notification_modal">
          <ReactModal
            isOpen={isModalShown}
            contentLabel={'Notifications'}
            onRequestClose={this.handleClickClose}
            shouldCloseOnOverlayClick
            className="search-result-modal search-result-modal--notif-modal"
            overlayClassName="search-result-modal-overlay"
          >
            <div className="close-btn">
              <IconButton
                icon={'close'}
                fontAwesome
                onClick={this.handleClickClose}
              />
            </div>
            <NotificationListing />
          </ReactModal>
        </div>
      </div>
    );
  }
}

NotificationIndicator.propTypes = {
  unreadNotifications: array,
  isModalShown: bool
};

const mapState = (state, props) => ({
  unreadNotifications: getUnreadNotifications(state),
  isModalShown: stateMappings(state).notifications.isModalShown
});

const mapDispatchToProps = {
  hideNotificationModal,
  showNotificationModal
};

export default connect(
  mapState,
  mapDispatchToProps
)(NotificationIndicator);
