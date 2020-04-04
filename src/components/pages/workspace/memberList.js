import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ListItem from './listItem';
import APIRequest from 'Lib/ApiRequest';
import groupBy from 'lodash/groupBy';
import Icon from 'Components/shared/Icon';
import UsersInvitationPage from 'Components/pages/users_invitation_page';
import { dragItemTypes } from 'Src/components/shared/drag_and_drop/_index';

class MemberList extends Component {
  static propTypes = {
    domain: PropTypes.object,
    selectedGroup: PropTypes.object
  };

  state = {
    members: {},
    isFormOpen: false
  };

  toggleForm = () => {
    this.setState({ isFormOpen: !this.state.isFormOpen });
  };

  generateId() {
    const { domain, selectedGroup } = this.props;
    if (!domain) return;
    if (selectedGroup) {
      return `${domain.id}${selectedGroup.id}`;
    }
    return `${domain.id}all`;
  }

  loadMembersForGroup(domain) {
    const { selectedGroup } = this.props;
    let resource =
      'users?include=user_profile&filter[users]=all&page[size]=999';
    if (selectedGroup) {
      resource = `${resource}&filter[within_group]=${selectedGroup.id}`;
    }
    APIRequest.get({
      resource,
      domain
    })
      .done(response => {
        this.setState({
          members: { ...this.state.members, [this.generateId()]: response.data }
        });
      })
      .fail(function(xhr, status) {
        if (status !== 'abort') {
          APIRequest.showErrorMessage('Unable to load teams');
        }
      });
  }

  componentDidMount() {
    const { domain } = this.props;
    if (domain && !this.state.members[this.generateId()]) {
      this.loadMembersForGroup(domain);
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.domain && !this.props.domain) {
      return;
    }
    if (!prevProps.domain || prevProps.domain.id !== this.props.domain.id) {
      if (!this.state.members[this.generateId()]) {
        this.loadMembersForGroup(this.props.domain);
      }
    }
    if (!this.props.selectedGroup) {
      return;
    }
    if (
      !prevProps.selectedGroup ||
      prevProps.selectedGroup.id !== this.props.selectedGroup.id
    ) {
      if (!this.state.members[this.generateId()]) {
        this.loadMembersForGroup(this.props.domain);
      }
    }
  }

  render() {
    const { members, isFormOpen } = this.state;
    const { domain } = this.props;
    const groupedMember = groupBy(
      members[this.generateId()],
      member => member.attributes.current_domain_role
    );
    return (
      <Fragment>
        {domain &&
          (groupedMember['member'] || []).map(member => (
            <ListItem
              key={member.id}
              text={member.attributes.first_name}
              rounded
              itemType={dragItemTypes.PERSON}
              item={member}
              domain={domain}
            />
          ))}
        <div className="add-item-btn" onClick={this.toggleForm}>
          +Add Member
        </div>
        <div className="ws-guest-header">
          <Icon
            additionalClasses="dark-grey-icon-button"
            icon="person_outline"
            onClick={this.toggleMembers}
            tooltip="Member"
          />
          Guest
        </div>
        {domain &&
          (groupedMember['guest'] || []).map(member => (
            <ListItem
              key={member.id}
              text={member.attributes.first_name}
              rounded
              itemType={dragItemTypes.PERSON}
              item={member}
              domain={domain}
            />
          ))}
        <div className="add-item-btn" onClick={this.toggleForm}>
          +Add Guest
        </div>
        {isFormOpen && <UsersInvitationPage domain={domain} />}
      </Fragment>
    );
  }
}

export default MemberList;
