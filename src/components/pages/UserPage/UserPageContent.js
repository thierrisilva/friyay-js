import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import UserInfoSection from './UserInfoSection';
import ItemsContainer from 'Components/shared/items_container';

export default class UserPageContent extends PureComponent {
  static defaultProps = {
    user: null,
    items: []
  };

  static propTypes = {
    user: PropTypes.object.isRequired,
    items: PropTypes.array,
    isFollowing: PropTypes.bool,
    handleFollowClick: PropTypes.func.isRequired,
    handleUserSettingsClick: PropTypes.func.isRequired,
    isCurrentUser: PropTypes.bool,
  };

  render() {
    const {
      props: {
        user,
        items,
        isFollowing,
        handleFollowClick,
        handleUserSettingsClick,
        isCurrentUser
      }
    } = this;

    return (
      <div className="user-page">
        <UserInfoSection
          isCurrentUser={isCurrentUser}
          user={user}
          isFollowing={isFollowing}
          handleFollowClick={handleFollowClick}
          handleUserSettingsClick={handleUserSettingsClick}
        />

        <ItemsContainer items={items} userId={user.id} />
      </div>
    );
  }
}
