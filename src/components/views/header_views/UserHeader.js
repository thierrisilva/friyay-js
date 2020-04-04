import React, { PureComponent } from 'react';
import get from 'lodash/get';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import { setLeftSubtopicMenuOpenForTopic } from 'Src/newRedux/interface/menus/actions';
import { toggleFollowUser } from 'Src/newRedux/database/people/thunks';
import { setEditUserModalOpen } from 'Src/newRedux/interface/modals/actions';
import { stateMappings } from 'Src/newRedux/stateMappings';
import ButtonMenuOpenDismiss from 'Components/shared/buttons/ButtonMenuOpenDismiss';
import withDataManager from 'Src/dataManager/components/withDataManager';
import IconButton from 'Components/shared/buttons/IconButton';

import { getPerson } from 'Src/newRedux/database/people/thunks';
import { updateUser } from 'Actions/appUser';

class UserHeader extends PureComponent {
  //
  // componentWillReceiveProps({ person, profile }) {
  //   if ( person.id !== this.props.person.id && !profile.data.counters ) {
  //     getPerson({ personId: person.id })
  //   }
  // }
  constructor(props) {
    super(props);

    this.state = {
      resourceCapacity: get(props, 'person.attributes.resource_capacity', '')
    };
  }

  handleCapacityChange = ev => {
    this.setState({ resourceCapacity: ev.target.value });
  };

  handleCapacityPress = ev => {
    const isEnterKey = ev.keyCode === 13;
    const value = this.state.resourceCapacity;
    const isValidValue = value && value >= 0 && value <= 168;

    if (isEnterKey && isValidValue) {
      this.props.updateUser({
        id: this.props.personId,
        resourceCapacity: Number(value)
      });
    }
  };

  render() {
    const {
      setEditUserModalOpen,
      toggleFollowUser,
      person,
      personIsUser,
      userFollows
    } = this.props;

    if (!person) {
      return null;
    }

    const { name, description, counters } = person.attributes;
    const {
      total_tips = 0,
      total_comments = 0,
      total_likes = 0,
      total_likes_received = 0,
      total_user_followers = 0
    } = counters || {};
    const isFollowing = userFollows.includes(person.id);

    return (
      <div className="user-header">
        <div className="user-header_avatar-container">
          <UserAvatar
            readonly
            size={100}
            style={{
              borderRadius: 50,
              fontSize: 70,
              cursor: 'default'
            }}
            user={person}
          />
        </div>
        <div className="user-header_content-container">
          <div className="user-header_content-row">
            <h3 className="user-header_title">{name}</h3>
            {personIsUser ? (
              <IconButton
                fontAwesome
                icon="cog"
                onClick={() => setEditUserModalOpen(true)}
              />
            ) : (
              <a
                className="grey-link"
                onClick={() => toggleFollowUser(person.id, !isFollowing)}
              >
                {isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
              </a>
            )}
          </div>
          {description && (
            <div className="user-header_content-row">
              <small className="user-info-desc">{description}</small>
            </div>
          )}
          <div className="user-header_content-row">
            <span className="user-header_capacity-label">Available</span>
            <input
              className="user-header_capacity"
              disabled={!personIsUser}
              min="0"
              max="168"
              placeholder="0"
              type="number"
              value={this.state.resourceCapacity}
              onChange={this.handleCapacityChange}
              onKeyDown={this.handleCapacityPress}
            />
            <span className="user-header_capacity-label">hours / week</span>
          </div>
          <div className="user-header_content-row">
            <div className="user-header_counts">
              <span className="user-header_count">{total_tips} Cards</span>
              <span className="user-header_count">
                {total_user_followers} Followers
              </span>
              <span className="user-header_count">
                {total_comments} Comments
              </span>
              <span className="user-header_count">
                {total_likes_received} Likes received
              </span>
              <span className="user-header_count">
                {total_likes} Likes given
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  const personId = sm.page.personId;
  return {
    displayLeftSubtopicMenuForTopic: sm.menus.displayLeftSubtopicMenuForTopic,
    personId: personId,
    person: sm.people[personId],
    personIsUser: sm.user.id == personId,
    userFollows: sm.user.relationships.following_users.data
  };
};

const mapDispatch = {
  setLeftSubtopicMenuOpenForTopic,
  setEditUserModalOpen,
  toggleFollowUser,
  updateUser
};

const dataRequirements = props => ({
  person: { personId: props.personId }
});

export default withDataManager(dataRequirements, mapState, mapDispatch)(
  UserHeader
);
