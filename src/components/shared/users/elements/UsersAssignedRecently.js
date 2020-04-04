import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { removeAssignFilter, setAssignFilter } from 'Actions/assignFilter';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import withUsers from 'Components/shared/users/withUsers';

const activeStyles = {
  border: '2px solid #f2ab13',
  boxSizing: 'content-box'
};

const baseStyles = {
  border: '2px solid transparent',
  boxSizing: 'content-box'
};

class UsersAssignedRecently extends Component {
  getAvatarStyle(userId) {
    if (userId === this.props.assignedTo) {
      return activeStyles;
    } else {
      return baseStyles;
    }
  }

  handleAvatarAction(userId) {
    if (userId === this.props.assignedTo) {
      this.props.removeAssignFilter();
    } else {
      this.props.setAssignFilter(userId);
    }
  }

  render() {
    return (
      <div className="users-assigned-recently">
        <UserAvatar
          user={this.props.appUser}
          margin={10}
          readonly
          size={28}
          style={this.getAvatarStyle(this.props.appUser.id)}
          onClick={() => this.handleAvatarAction(this.props.appUser.id)}
        />
        {this.props.users
          .filter(user => this.props.recentAssignees.find(id => id == user.id))
          .map(user => (
            <UserAvatar
              key={user.id}
              user={user}
              margin={10}
              readonly
              size={28}
              style={this.getAvatarStyle(user.id)}
              onClick={() => this.handleAvatarAction(user.id)}
            />
          ))}
      </div>
    );
  }
}

UsersAssignedRecently.propTypes = {
  appUser: PropTypes.object.isRequired,
  assignedTo: PropTypes.string,
  className: PropTypes.string,
  recentAssignees: PropTypes.array,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeAssignFilter: PropTypes.func.isRequired,
  setAssignFilter: PropTypes.func.isRequired
};

function mapState({ appUser, assignFilter }) {
  return {
    appUser: appUser,
    assignedTo: assignFilter.assignedTo,
    recentAssignees: assignFilter.recentAssignees
  };
}

const mapDispatch = { setAssignFilter, removeAssignFilter };

export default withUsers(connect(mapState, mapDispatch)(UsersAssignedRecently));
