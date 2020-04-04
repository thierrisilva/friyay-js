import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { removeAssignFilter, setAssignFilter } from 'Actions/assignFilter';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import withUsers from 'Components/shared/users/withUsers';

const defaultOption = { id: null, name: 'Anyone' };

class UserAssignedSelect extends Component {
  state = { showDropdown: false };

  handleOptionSelect(userId) {
    if (userId) {
      this.props.setAssignFilter(userId);
    } else {
      this.props.removeAssignFilter();
    }

    this.toggleDropdown();
  }

  handleOutsideClick = ev => {
    if (!this.dropdownRef.contains(ev.target)) {
      this.toggleDropdown();
    }
  };

  saveDropdownRef = ref => {
    this.dropdownRef = ref;
  };

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown }, () => {
      if (this.state.showDropdown) {
        document.addEventListener('click', this.handleOutsideClick, false);
      } else {
        document.removeEventListener('click', this.handleOutsideClick, false);
      }
    });
  };

  render() {
    const controlClassNames = classNames(
      this.props.className,
      'user-assigned-select'
    );

    const activeOption =
      this.props.assignedTo === this.props.appUser.id
        ? this.props.appUser
        : this.props.users.find(user => user.id === this.props.assignedTo) ||
          defaultOption;

    return (
      <div className={controlClassNames}>
        <div
          className="user-assigned-select__value"
          onClick={this.toggleDropdown}
        >
          {this.renderOption(activeOption)}
          <span className="user-assigned-select__arrow material-icons">
            {this.state.showDropdown ? 'arrow_drop_up' : 'arrow_drop_down'}
          </span>
        </div>
        {this.state.showDropdown && (
          <ul
            ref={this.saveDropdownRef}
            className="user-assigned-select__options"
          >
            {this.renderOption(defaultOption)}
            {this.renderOption(this.props.appUser)}
            {this.props.users.map(user => this.renderOption(user))}
          </ul>
        )}
      </div>
    );
  }

  renderOption(user) {
    return (
      <li
        key={user.id}
        className="user-assigned-select__option"
        onClick={() => this.handleOptionSelect(user.id)}
      >
        {user.id && <UserAvatar margin={10} readonly user={user} />}
        <span className="user-assigned-select__option-text">{user.name}</span>
      </li>
    );
  }
}

UserAssignedSelect.propTypes = {
  appUser: PropTypes.object.isRequired,
  assignedTo: PropTypes.string,
  className: PropTypes.string,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeAssignFilter: PropTypes.func.isRequired,
  setAssignFilter: PropTypes.func.isRequired
};

function mapState({ appUser, assignFilter }) {
  return {
    appUser: appUser,
    assignedTo: assignFilter.assignedTo
  };
}

const mapDispatch = { setAssignFilter, removeAssignFilter };

export default withUsers(connect(mapState, mapDispatch)(UserAssignedSelect));
