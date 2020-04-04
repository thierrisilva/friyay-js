import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

export default class HexaTopicItem extends PureComponent {
  static propTypes = {
    topic: PropTypes.object,
    handleFollowClick: PropTypes.func,
    handleUnfollowClick: PropTypes.func,
    isFollowingTopic: PropTypes.bool,
    topicFollowUnfollow: PropTypes.object,
    groupId: PropTypes.string
  };

  static defaultProps = {
    groupId: null
  };

  render() {
    const {
      topic,
      handleUnfollowClick,
      handleFollowClick,
      isFollowingTopic,
      topicFollowUnfollow,
      groupId
    } = this.props;

    let followLink;
    let btnClass = 'btn-xs btn-link topic-link';
    const { id, isLoading } = topicFollowUnfollow;
    if (isFollowingTopic) {
      btnClass = classNames(btnClass, 'topic-unfollow-link');

      let infollowText = 'UNFOLLOW';
      if (id === topic.id && isLoading) {
        infollowText = 'UNFOLLOWING...';
      }

      followLink = (
        <button
          className={btnClass}
          onClick={() => handleUnfollowClick(topic.id)}
        >
          {infollowText}
        </button>
      );
    } else {
      btnClass = classNames(btnClass, 'topic-follow-link');

      let followText = 'FOLLOW';
      if (id === topic.id && isLoading) {
        followText = 'FOLLOWING...';
      }

      followLink = (
        <button
          className={btnClass}
          onClick={() => handleFollowClick(topic.id)}
        >
          {followText}
        </button>
      );
    }

    const activeClass = classNames({ hex: true, followed: isFollowingTopic });
    const goto =
      groupId !== null
        ? `/groups/${groupId}/yays/${topic.attributes.slug}`
        : `/yays/${topic.attributes.slug}`;

    return (
      <div className={activeClass}>
        <Link to={goto} />
        <div className="corner-1" />
        <div className="corner-2" />
        <div className="inner" style={{ height: '100%' }}>
          <h5
            style={{
              display: 'table',
              width: '100%',
              marginTop: 0,
              height: '100%'
            }}
          >
            <div
              style={{
                width: '100%',
                display: 'table-cell',
                verticalAlign: 'middle'
              }}
            >
              {topic.attributes.title}
            </div>
          </h5>
        </div>
        {followLink}
      </div>
    );
  }
}
