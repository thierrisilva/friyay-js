import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import UserInfoMenu from './user_info_menu';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
const moreIcon = (
  <div className="count-icon">
    <svg
      width="12px"
      height="16px"
      viewBox="0 0 4 14"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="TipFeed" stroke="none">
        <g id="Artboard" transform="translate(-356.000000, -459.000000)">
          <path
            d="M357.75,462.5 C358.7125,462.5 359.5,461.7125 359.5,460.75 C359.5,459.7875 358.7125,459 357.75,459 C356.7875,459 356,459.7875 356,460.75 C356,461.7125 356.7875,462.5 357.75,462.5 L357.75,462.5 Z M357.75,464.25 C356.7875,464.25 356,465.0375 356,466 C356,466.9625 356.7875,467.75 357.75,467.75 C358.7125,467.75 359.5,466.9625 359.5,466 C359.5,465.0375 358.7125,464.25 357.75,464.25 L357.75,464.25 Z M357.75,469.5 C356.7875,469.5 356,470.2875 356,471.25 C356,472.2125 356.7875,473 357.75,473 C358.7125,473 359.5,472.2125 359.5,471.25 C359.5,470.2875 358.7125,469.5 357.75,469.5 L357.75,469.5 Z"
            id="Shape"
          />
        </g>
      </g>
    </svg>
  </div>
);

export default class UserCard extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    handleFollowClick: PropTypes.func.isRequired,
    handleUnfollowClick: PropTypes.func.isRequired,
    isFollowingUser: PropTypes.bool.isRequired,
    groupId: PropTypes.string,
  };

  static defaultProps = {
    groupId: null
  };

  state = {
    showUserInfo: false
  };

  handleOptionMenuClick = () => {
    this.setState(state => ({
      ...state,
      showUserInfo: !state.showUserInfo
    }));
  };

  render() {
    const {
      props: { user, handleUnfollowClick, handleFollowClick, isFollowingUser, groupId },
      state: { showUserInfo }
    } = this;
    const { attributes, relationships } = user;
    const { name, avatar_url } = attributes;

    let followLink;

    if (isFollowingUser) {
      followLink = (
        <button
          className="btn-xs btn-link user-link"
          onClick={() => handleUnfollowClick(user)}
        >
          UNFOLLOW
        </button>
      );
    } else {
      followLink = (
        <button
          className="btn-xs btn-link user-link"
          onClick={() => handleFollowClick(user)}
        >
          FOLLOW
        </button>
      );
    }

    const activeClass = classNames({
      'user-card': true,
      followed: isFollowingUser
    });

    const goto = groupId !== null
      ? `/groups/${groupId}/users/${user.id}`
      : `/users/${user.id}`;


    let userCardContent = [
      <UserAvatar
        user={ user }
        readonly
        size={100}
        style={{
          borderRadius: 50,
          fontSize: 70
        }}
        key={`user-avatar-${user.id}`}
      />,
      <Link to={goto} key={`user-name-${user.id}`}>
        <h5>{name}</h5>
      </Link>
    ];

    if (showUserInfo) {
      userCardContent = <UserInfoMenu user={user} />;
    }

    const activeUserContentClass = classNames({
      'user-card-content': true,
      'active-user-info': showUserInfo
    });
    return (
      <div className={activeClass}>
        <div className={activeUserContentClass}>{userCardContent}</div>
        <div className="flex-r-center-spacebetween user-card-footer">
          <div className="flex-1 text-center ml40">{followLink}</div>
          <button className="btn btn-link" onClick={this.handleOptionMenuClick}>
            {moreIcon}
          </button>
        </div>
      </div>
    );
  }
}
