/* global vex */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { connect } from 'react-redux';
import { getMembers, updateRole, removeMember } from 'Actions/members';
import { getRoles } from 'Actions/roles';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import Loader from 'Components/shared/Loader';
import { PEOPLE_TABS as TABS } from 'Enums';
import { withRouter } from 'react-router-dom';
import inflection from 'inflection';
import { sortBy, compose, toLower, prop, filter, not, isNil } from 'ramda';
const sortByNameCaseInsensitive = compose(
  sortBy(compose(toLower, prop('name'))),
  filter(compose(not, isNil))
);

const noResultsStyle = {
  textAlign: 'center',
  margin: '1rem 0',
  fontStyle: 'italic'
};

const removeButtonStyle = {
  color: '#d43f3a'
};

const currentRoleStyle = {
  marginLeft: 5,
  fontStyle: 'italic',
  color: '#AAA',
  fontSize: 12
};

const rolesMap = [
  {
    id: 'admin',
    label: 'Administrator',
    type: TABS.ADMINS
  },
  {
    id: 'member',
    label: 'Member',
    type: TABS.MEMBERS
  },
  {
    id: 'guest',
    label: 'Guest',
    type: TABS.GUESTS
  },
  {
    id: 'me',
    label: 'Me',
    type: TABS.ME
  }
];

const getRoleName = roleId => {
  const role = rolesMap.find(({ id }) => id === roleId);

  return role !== undefined ? role.label : 'Pending';
};

const getNameWithSearch = (name, search = null) => {
  if (search === null) {
    return name;
  }
  const regex = new RegExp(search, 'gi');
  const escaped = regex.exec(name);
  const [match] = escaped;
  const { index } = escaped;
  const head = name.substring(0, index);
  const tail = name.substring(index + match.length);
  return [
    <span key="head">{head}</span>,
    <span key="match" style={{ color: '#f2ab13', fontWeight: 500 }}>
      {match}
    </span>,
    <span key="tail">{tail}</span>
  ];
};

class PeopleList extends Component {
  static propTypes = {
    areMembersLoading: PropTypes.bool,
    areRolesLoading: PropTypes.bool,
    roles: PropTypes.array.isRequired,
    members: PropTypes.array.isRequired,
    isRemovingMember: PropTypes.string,
    isUpdatingRole: PropTypes.string,
    getAllMembers: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    getAllRoles: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    currentUserId: PropTypes.string.isRequired,
    updateUserRole: PropTypes.func.isRequired
  };

  static defaultProps = {
    areMembersLoading: false,
    areRolesLoading: false,
    roles: [],
    members: [],
    isRemovingMember: null,
    isUpdatingRole: null
  };

  state = {
    filterType: TABS.ALL,
    search: null
  };

  componentDidMount() {
    const {
      props: {
        areMembersLoading,
        areRolesLoading,
        roles,
        members,
        getAllMembers,
        getAllRoles
      }
    } = this;

    if (!areRolesLoading && roles.length === 0) {
      getAllRoles();
    }

    if (!areMembersLoading && members.length === 0) {
      getAllMembers();
    }
  }

  onTabChange = filterType =>
    this.setState(state => ({ ...state, filterType }));

  onFilterChange = ({ target: { value } }) =>
    this.setState(state => ({ ...state, search: value || null }));

  updateRole = (currentRole, newRole, userId) => {
    const { props: { roles, members, update, updateUserRole } } = this;
    const roleExists = roles.findIndex(role => role === newRole) !== -1;

    if (roleExists) {
      const user = members.find(({ id }) => id === userId);
      const current = rolesMap.find(item => item.id === currentRole);
      const next = rolesMap.find(item => item.id === newRole);

      let unsafeMessage = `
        Are you sure to change role ${current.label} to ${next.label} for user ${user.name}?
      `;

      if (currentRole === 'guest' && newRole === 'member') {
        unsafeMessage = `
        Are you sure you want to change ${user.name} to be a Team Member?
        <br /><br />
        This will immediately give them access to any content that is shared with everyone
        on the team. Additionally, it will allow them to view all other team members' profiles.`;
      }

      if (newRole === 'admin') {
        unsafeMessage = `
        Are you sure you want to change ${user.name} to an Team Administrator?
        <br /><br />

        Administrators have all access to content shared with everyone, can assign other user roles,
        can edit any card shared with them, a team they belong to or everyone on the team.`;

      }

      vex.dialog.confirm({
        unsafeMessage,
        callback: async value => {
          if (value) {
            await update(userId, newRole);
            updateUserRole(userId, user.name, newRole, currentRole);
          }
        }
      });
    }
  };

  removeMember = (id, name) => {
    vex.dialog.confirm({
      message: `Are you sure to remove member ${name}?`,
      callback: async value => {
        if (value) {
          const {
            props: {
              params: { user_id = null, group_id = null } = {
                user_id: null,
                group_id: null
              },
              remove,
              history
            }
          } = this;

          await remove(id, name);
          if (user_id === id) {
            group_id !== null
              ? history.push(`/groups/${group_id}/users`)
              : history.push('/users');
          }
        }
      }
    });
  };

  getPossibleRoles = (currentRole, userId) => {
    const roleExists =
      this.props.roles.findIndex(role => role === currentRole) !== -1;

    if (roleExists) {
      return rolesMap
        .filter(item => item.id !== currentRole)
        .filter(item => item.id !== 'guest' && item.id !== 'me')
        .map(item => (
          <li key={`${item.id}_item`}>
            <a
              href="#"
              onClick={() => this.updateRole(currentRole, item.id, userId)}
            >
              Make {item.label}
            </a>
          </li>
        ));
    } else {
      return [];
    }
  };

  render() {
    const {
      state: { filterType, search },
      props: {
        areMembersLoading,
        areRolesLoading,
        roles,
        members,
        isRemovingMember,
        isUpdatingRole,
        user,
        currentUserId
      }
    } = this;

    const rolesTabs = rolesMap
      .filter(({ id }) => roles.includes(id))
      .map(({ label, type }) => (
        <li
          className={cx({ active: filterType === type })}
          onClick={() => this.onTabChange(type)}
          key={`role_${type}`}
        >
          <a href="#" role="tab">
            {inflection.pluralize(label)}
          </a>
        </li>
      ));

    let filtered = sortByNameCaseInsensitive([...members, user]);
    let noResults = 'No users';

    if (search !== null) {
      filtered = members.filter(member =>
        new RegExp(search, 'gi').test(member.name)
      );
      noResults = [noResults, `matching ${search}`].join(' ');
    }

    if (filterType !== TABS.ALL) {
      filtered = filtered.filter(member => {
        switch (filterType) {
          case TABS.ADMINS:
            return member.current_role === 'admin' || member.current_role === 'me';
          case TABS.MEMBERS:
            return member.current_role === 'member';
          case TABS.GUESTS:
            return member.current_role === 'guest';
          case TABS.PENDING:
            return member.current_role === null;
          default:
            return true;
        }
      });
    }

    filtered = filtered.map(member => {
      let icon = null;

      if (isRemovingMember === member.id || member.id === isUpdatingRole) {
        icon = (
          <div className="navbar-right">
            <i className="fa fa-circle-o-notch fa-spin" />
          </div>
        );
      } else if (member.id !== currentUserId) {
        icon = (
          <div className="navbar-right" style={{ position: 'relative' }}>
            <button className="dropdown-toggle" data-toggle="dropdown">
              <i className="glyphicon glyphicon-cog" />
            </button>
            <ul className="dropdown-menu">
              {this.getPossibleRoles(member.current_role, member.id)}
              <li key={`remove_item_${member.id}`}>
                <a
                  href="#"
                  onClick={() => this.removeMember(member.id, member.name)}
                  style={removeButtonStyle}
                >
                  Remove from Workspace
                </a>
              </li>
            </ul>
          </div>
        );
      }

      return (
        <li
          key={`user_${member.id}`}
          className={cx({
            blocked:
              member.id === isRemovingMember || member.id === isUpdatingRole
          })}
        >
          <UserAvatar userId={member.id} />
          <p style={{ margin: 0 }}>
            {getNameWithSearch(member.name, search)}
            {filterType === TABS.ALL && (
              <span style={currentRoleStyle}>
                {getRoleName(member.current_role)}
              </span>
            )}
          </p>
          {icon}
        </li>
      );
    });

    let toDisplay = <ul className="user-list">{filtered}</ul>;

    if (areMembersLoading) {
      toDisplay = (
        <div className="text-center mt20">
          <Loader />
        </div>
      );
    } else if (filtered.length === 0) {
      toDisplay = (
        <p className="text-muted" style={noResultsStyle}>
          {noResults}
        </p>
      );
    }

    if (areRolesLoading) {
      return (
        <div className="people-list">
          <div className="text-center mt30">
            <Loader />
          </div>
        </div>
      );
    }

    return (
      <div className="people-list">
        <ul className="nav nav-tabs" role="tablist">
          <li
            className={cx({ active: filterType === TABS.ALL })}
            onClick={() => this.onTabChange(TABS.ALL)}
          >
            <a href="#" role="tab">
              All
            </a>
          </li>
          {rolesTabs}
        </ul>

        <div className="user-filter">
          <div className="input-filter">
            <i className="glyphicon glyphicon-search" />
            <input
              placeholder="Search for a user"
              onChange={this.onFilterChange}
            />
          </div>
        </div>
        {toDisplay}
      </div>
    );
  }
}

const mapState = ({
  roles: { isLoading: areRolesLoading, collection: roles },
  members: {
    isLoading: areMembersLoading,
    collection: members,
    isRemovingMember,
    isUpdatingRole
  },
  appUser: { name, id, avatar }
}) => ({
  areMembersLoading,
  areRolesLoading,
  roles,
  members,
  isRemovingMember,
  isUpdatingRole,
  user: {
    name,
    id,
    avatar_url: avatar,
    current_role: 'me'
  },
  currentUserId: id
});
const mapDispatch = {
  getAllMembers: getMembers,
  update: updateRole,
  remove: removeMember,
  getAllRoles: getRoles
};

export default withRouter( connect(mapState, mapDispatch)(PeopleList));
