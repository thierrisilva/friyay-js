import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class UserInfoMenu extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired
  };

  render() {
    const {
      props: {
        user: {
          relationships: {
            user_profile: {
              data: {
                counters: {
                  total_tips,
                  total_likes_received,
                  total_user_followers
                }
              }
            }
          }
        }
      }
    } = this;

    return (
      <div className="user-info-menu">
        <div className="user-info-menu-row">
          <span>{total_tips} Cards</span>
        </div>
        <div className="user-info-menu-row">
          <span>{total_likes_received} likes received</span>
        </div>
        <div className="user-info-menu-row">
          <span>{total_user_followers} followers</span>
        </div>
      </div>
    );
  }
}

export default UserInfoMenu;
