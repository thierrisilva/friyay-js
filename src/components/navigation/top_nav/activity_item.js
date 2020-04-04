import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import ItemPage from '../../pages/item_page';
import StringHelper from '../../../helpers/string_helper';
import { withRouter } from 'react-router';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import { filterTipBySlug } from 'Actions/tipsFilter';

const timeToText = time => {
  const today = moment();
  const actionDate = moment(time);
  const diff = actionDate.diff(today, 'days');

  if (diff === 0) {
    return actionDate.fromNow();
  }

  if (diff === 1) {
    return `at ${actionDate.format('h:mma')} ${actionDate.fromNow()}`;
  }

  return `${actionDate.format('h:mma')} ${actionDate.format('M/D')}`;
};

class ActivityItem extends Component {
  static propTypes = {
    notification: PropTypes.object.isRequired,
    group: PropTypes.object,
    onMarkOneReadClick: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    filterBySlug: PropTypes.func.isRequired
  };

  state = {
    isItemPageOpen: false,
    slug: null
  };

  closeItemPage = () =>
    this.setState(state => ({ ...state, isItemPageOpen: false, slug: null }));

  actionToText = (action, notifiable) => {
    switch (action) {
      case 'someone_comments_on_tip':
      case 'someone_mentioned_on_comment': {
        const tip = notifiable.data.tip;
        const topic_title = tip && tip.data.topic && tip.data.topic.data.title;

        return (
          <span>
            commented on {tip.data.title}{' '}
            {topic_title ? `for ${topic_title}` : ''}
          </span>
        );
      }
      case 'someone_commented_on_tip_user_commented': {
        const tip = notifiable.data.tip;
        const topic_title = tip && tip.data.topic && tip.data.topic.data.title;

        return (
          <span>
            commented on {tip.data.title} that you have commented on
            {topic_title ? ` for ${topic_title}` : ''}
          </span>
        );
      }
      case 'someone_likes_tip':
        return 'liked your Card';
      case 'someone_shared_topic_with_me':
        return 'shared a yay';
      case 'someone_adds_topic':
        return 'adds a new yay';
      default:
        return 'does something unsupported';
    }
  };

  renderDetailInfo = (action, notifiable) => {
    switch (action) {
      case 'someone_comments_on_tip':
      case 'someone_commented_on_tip_user_commented':
      case 'someone_mentioned_on_comment':
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: StringHelper.truncate(notifiable.data.body, 180)
            }}
          />
        );
      case 'someone_likes_tip':
        return (
          <div>
            {notifiable.data.title} in {notifiable.data.topic.data.title}
          </div>
        );
      case 'someone_shared_topic_with_me':
      case 'someone_adds_topic':
        return StringHelper.truncate(notifiable.data.title, 180);
      default:
        return <div>Something happens, we didn&apos;t track what</div>;
    }
  };

  handleNotificationClick = () => {
    const {
      props: {
        notification: {
          attributes: { action },
          relationships: { notifiable },
          id
        },
        onMarkOneReadClick,
        router
      }
    } = this;

    switch (action) {
      case 'someone_comments_on_tip':
      case 'someone_mentioned_on_comment':
      case 'someone_commented_on_tip_user_commented':
        this.popupTip(notifiable.data.tip.data.slug);
        break;
      case 'someone_likes_tip':
        this.popupTip(notifiable.data.slug);
        break;
      case 'someone_shared_topic_with_me':
      case 'someone_adds_topic':
        router.push(`/yays/${notifiable.data.slug}`);
        break;
    }

    onMarkOneReadClick(id);
  };

  popupTip = slug => {
    this.props.filterBySlug(slug);
    history.pushState(null, '', `/cards/${slug}`);
    this.setState(state => ({ ...state, isItemPageOpen: true, slug }));
  };

  render() {
    const {
      state: { isItemPageOpen, slug },
      props: {
        group,
        notification: {
          attributes: { read_at, time, action },
          relationships: { notifier, notifiable }
        }
      }
    } = this;

    // TODO: replace with avatar url
    let url = null;
    let name = null;

    let notifierInfo = null;
    let notifierId = null;
    if (notifier && notifier.data) {
      notifierInfo = notifier.data.name;
      name = notifier.data.name;
      notifierId = notifier.data.id;
      if (notifier.data.avatar_url && notifier.data.avatar_url.length > 0) {
        url = notifier.data.avatar_url;
      }
    } else {
      notifierInfo = <span>Someone</span>;
    }

    const actionDesc = (
      <span className="media-action text-muted">
        {this.actionToText(action, notifiable)} {timeToText(time)}
      </span>
    );

    const activityItemClass = classNames({
      'activity-item': true,
      unread: !read_at
    });

    return (
      <li className={activityItemClass} style={{ cursor: 'pointer' }}>
        <div
          className="media notification-content"
          onClick={this.handleNotificationClick}
        >
          <div className="media-left">
            <UserAvatar userId={notifierId} readonly size={30} margin={0} />
          </div>
          <div className="media-body">
            <h5 className="media-heading">
              {notifierInfo} {actionDesc}
            </h5>
            {this.renderDetailInfo(action, notifiable)}
          </div>
        </div>
        {isItemPageOpen && (
          <ItemPage group={group} onClose={this.closeItemPage} slug={slug} />
        )}
      </li>
    );
  }
}

const mapDispatch = {
  filterBySlug: filterTipBySlug
};

export default connect(
  undefined,
  mapDispatch
)(withRouter(ActivityItem));
