import React from 'react';
import PropTypes from 'prop-types';

const TopicInfoBar = ({ isFollowingTopic, handleFollowClick }) => (
  <div className="topic-info-bar">
    <a
      href="javascript:void(0)"
      className="btn btn-link topic-follow-link gray-link"
      onClick={handleFollowClick}
    >
      {isFollowingTopic ? 'UNFOLLOW' : 'FOLLOW'}
    </a>
  </div>
);

TopicInfoBar.propTypes = {
  isFollowingTopic: PropTypes.bool,
  handleFollowClick: PropTypes.func
};

export default TopicInfoBar;
