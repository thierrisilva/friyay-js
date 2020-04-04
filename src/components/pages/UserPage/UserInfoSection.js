import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';

export default class UserInfoSection extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    isFollowing: PropTypes.bool,
    handleFollowClick: PropTypes.func.isRequired,
    handleUserSettingsClick: PropTypes.func.isRequired,
    isCurrentUser: PropTypes.bool
  };

  render() {
    const {
      props: {
        user,
        // : {
        //   attributes: { name },
        //   relationships: {
        //     user_profile: {
        //       data: {
        //         description,
        //         avatar_url,
        //         counters: {
        //           total_tips,
        //           total_comments,
        //           total_likes,
        //           total_likes_received,
        //           total_user_followers
        //         }
        //       }
        //     }
        //   }
        // },
        isFollowing,
        isCurrentUser,
        handleFollowClick,
        handleUserSettingsClick
      }
    } = this;

    const { name, description, avatar_url, counters = {} } = user.attributes;
    const { total_tips = 0, total_comments = 0, total_likes = 0, total_likes_received = 0, total_user_followers = 0 } = counters;

    let followLink = (
      <a className="user-follow-link ml15" onClick={handleFollowClick}>
        {isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
      </a>
    );

    if (isCurrentUser) {
      followLink = (
        <span>
          <a
            className="glyphicon glyphicon-cog edit-link ml15"
            onClick={handleUserSettingsClick}
          />
        </span>
      );
    }

    return (
      <div className="container-fluid" style={{backgroundColor: 'white'}}>
        <div className="row user-info-section">
          <div className="user-info-avatar pull-left">
            <UserAvatar
              readonly
              size={100}
              style={{
                borderRadius: 50,
                fontSize: 70,
                cursor: 'default'
              }}
              user={ user }
            />
          </div>

          <div className="user-info-text pull-left">
            <div className="user-info-text-content">
              <h3>{ name }</h3>
              {followLink}
            </div>
            <small className="user-info-desc">{ description }</small>
          </div>
        </div>
        <div className="row user-info-counts">
          <ul className="list-inline">
            <li>
              <span>{total_tips} Cards</span>
            </li>
            <li>
              <span>{total_user_followers} Followers</span>
            </li>
            <li>
              <span>{total_comments} Comments</span>
            </li>
            <li>
              <span>{total_likes_received} Likes received</span>
            </li>
            <li>
              <span>{total_likes} Likes given</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
