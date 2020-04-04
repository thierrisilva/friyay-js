import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ActivityItem from './activity_item';
import moment from 'moment';
import differenceBy from 'lodash/differenceBy';
import flatten from 'lodash/flatten';

const actionTypes = {
  comment: 'someone_comments_on_tip',
  commented: 'someone_commented_on_tip_user_commented',
  mention: 'someone_mentioned_on_comment',
  like: 'someone_likes_tip',
  share_hive: 'someone_shared_topic_with_me',
  add_hive: 'someone_adds_topic'
};

class ActivityMenu extends Component {
  static propTypes = {
    notifications: PropTypes.array.isRequired,
    hasUnread: PropTypes.bool.isRequired,
    group: PropTypes.object,
    onMarkAsReadClick: PropTypes.func.isRequired,
    onMarkOneReadClick: PropTypes.func.isRequired
  };

  state = {
    selectedNotificationType: 'all'
  };

  componentDidMount() {
    $('.activity-header a[data-toggle="tooltip"]').tooltip();
    $('#activity-menu').isolatedScroll();
  }

  onHeaderItemClick = selectedNotificationType =>
    this.setState(state => ({ ...state, selectedNotificationType }));

  renderMenuHeader = () => {
    const {
      props: { hasUnread, onMarkAsReadClick },
      state: { selectedNotificationType: selected }
    } = this;

    const markAsReadClass = classnames({
      'btn btn-default btn-sm pull-right': true,
      disabled: hasUnread === false
    });

    return (
      <li className="dropdown-header activity-header">
        <a className="first" onClick={() => this.onHeaderItemClick('all')}>
          All activity
        </a>
        <a
          className={classnames({ active: selected === 'moment' })}
          onClick={() => this.onHeaderItemClick('comment')}
          title="Someone commented on a card"
          data-toggle="tooltip"
          data-placement="bottom"
        >
          <i className="fa fa-comment-o" />
        </a>
        <a
          className={classnames({ active: selected === 'commented' })}
          onClick={() => this.onHeaderItemClick('commented')}
          title="Someone commented on a card you commented on"
          data-toggle="tooltip"
          data-placement="bottom"
        >
          <i className="fa fa-commented-o" />
        </a>
        <a
          className={classnames({ active: selected === 'mention' })}
          onClick={() => this.onHeaderItemClick('mention')}
          title="Someone mentioned you"
          data-toggle="tooltip"
          data-placement="bottom"
        >
          <i className="fa fa-at" />
        </a>
        <a
          className={classnames({ active: selected === 'like' })}
          onClick={() => this.onHeaderItemClick('like')}
          title="Someone liked your card"
          data-toggle="tooltip"
          data-placement="bottom"
        >
          <i className="fa fa-heart-o" />
        </a>
        <a
          className={classnames({ active: selected === 'share_hive' })}
          onClick={() => this.onHeaderItemClick('share_hive')}
          title="Someone share a topic"
          data-toggle="tooltip"
          data-placement="bottom"
        >
          <i className="fa fa-share-alt" />
        </a>
        <a
          className={classnames({ active: selected === 'add_hive' })}
          onClick={() => this.onHeaderItemClick('add_hive')}
          title="Someone added a new Topic"
          data-toggle="tooltip"
          data-placement="bottom"
        >
          <span>&#x2b21;</span>
        </a>

        {hasUnread && (
          <a className={markAsReadClass} onClick={onMarkAsReadClick}>
            Mark all as read
          </a>
        )}
      </li>
    );
  };

  renderNotifications = () => {
    const {
      props: { notifications, group, onMarkOneReadClick },
      state: { selectedNotificationType: type }
    } = this;

    const noActivity = (
      <li className="dropdown-header">
        <a>There is no activity.</a>
      </li>
    );

    if (notifications.length === 0) {
      return noActivity;
    }

    let filtered = notifications;

    if (type !== 'all') {
      filtered = notifications.filter(
        item => item.attributes.action === actionTypes[type]
      );
    }

    const today = moment().subtract(0, 'days').utc().format('YYYY-MM-DD');
    const yesterday = moment().subtract(1, 'days').utc().format('YYYY-MM-DD');

    const todayN = filtered.filter(item => item.attributes.date === today);
    const yesterdayN = filtered.filter(item => item.attributes.date === yesterday);
    const olderN = differenceBy(
      filtered,
      [...todayN, ...yesterdayN],
      'id'
    );

    let renderElements = [];

    if (todayN.length > 0) {
      renderElements = flatten([
        <li className="dropdown-header" key="header-today">
          New ({todayN.length})
        </li>,
        <li role="separator" className="divider" key="separator-today-b" />,
        todayN.map(item => [
          <ActivityItem
            notification={item}
            key={`notification-item-${item.id}`}
            group={group}
            onMarkOneReadClick={onMarkOneReadClick}
          />,
          <li
            role="separator"
            className="divider"
            key={`separator-e-${item.id}`}
          />
        ])
      ]);
    }

    if (yesterdayN.length > 0) {
      renderElements = flatten([
        ...renderElements,
        <li className="dropdown-header" key="header-yesterday">
          Yesterday ({yesterdayN.length})
        </li>,
        <li role="separator" className="divider" key="separator-yesterday-b" />,
        yesterdayN.map(item => [
          <ActivityItem
            notification={item}
            key={`notification-item-${item.id}`}
            group={group}
            onMarkOneReadClick={onMarkOneReadClick}
          />,
          <li
            role="separator"
            className="divider"
            key={`separator-e-${item.id}`}
          />
        ])
      ]);
    }

    if (olderN.length > 0) {
      renderElements = flatten([
        ...renderElements,
        <li className="dropdown-header" key="header-older">
          Older ({olderN.length})
        </li>,
        <li role="separator" className="divider" key="separator-older-b" />,
        olderN.map(item => [
          <ActivityItem
            notification={item}
            key={`notification-item-${item.id}`}
            group={group}
            onMarkOneReadClick={onMarkOneReadClick}
          />,
          <li
            role="separator"
            className="divider"
            key={`separator-e-${item.id}`}
          />
        ])
      ]);
    }

    if (renderElements.length === 0) {
      return noActivity;
    }

    return renderElements;
  };

  render() {
    return (
      <ul className="dropdown-menu activity-menu" id="activity-menu">
        {this.renderMenuHeader()}
        <li role="separator" className="divider" />
        {this.renderNotifications()}
      </ul>
    );
  }
}

export default ActivityMenu;
