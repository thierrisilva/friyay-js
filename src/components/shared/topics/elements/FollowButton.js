/* global vex */
import React, { Component } from 'react';
import { bool, object, func } from 'prop-types';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { toggleFollowTopic } from 'Src/newRedux/database/topics/thunks';
import analytics from 'Lib/analytics';

class FollowButton extends Component {
  static propTypes = {
    topic: object.isRequired,
    toggleFollowTopic: func.isRequired,
    userFollowsTopic: bool
  };

  handleFollowClick = e => {
    e.preventDefault();
    const { topic, userFollowsTopic, toggleFollowTopic } = this.props;
    const {
      id,
      attributes: { title }
    } = topic;

    if (userFollowsTopic) {
      vex.dialog.confirm({
        message: 'Are you sure you want to unfollow this topic?',
        callback: value => {
          if (value) {
            toggleFollowTopic(id);
            analytics.track('Unfollowed yay', { id, title });
          }
        }
      });
    } else {
      toggleFollowTopic(id);
      analytics.track('Followed yay', { id, title });
    }
  };

  render() {
    const { userFollowsTopic } = this.props;

    return (
      <span className="navbar-right dropdown">
        <a
          className="btn btn-link edit-link padding-4"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <i className="material-icons">more_vert</i>
        </a>
        <ul className="dropdown-menu">
          <li>
            <a onClick={this.handleFollowClick} className="almost-black">
              {userFollowsTopic ? 'Unfollow' : 'Follow'}
            </a>
          </li>
        </ul>
      </span>
    );
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  const userFollowedTopics = sm.user.relationships.following_topics.data;
  return {
    userFollowsTopic: userFollowedTopics.includes(props.topic.id)
  };
};

const mapDispatch = {
  toggleFollowTopic
};

export default connect(
  mapState,
  mapDispatch
)(FollowButton);
