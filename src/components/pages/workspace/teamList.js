import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ListItem from './listItem';
import APIRequest from 'Lib/ApiRequest';
import MainFormPage from '../main_form_page';
import {
  dragItemTypes,
  GenericDropZone
} from 'Src/components/shared/drag_and_drop/_index';

class TeamList extends Component {
  static propTypes = {
    domain: PropTypes.object,
    selectedGroup: PropTypes.object,
    onSelectGroup: PropTypes.func
  };

  state = {
    groups: {},
    isFormOpen: false
  };

  toggleFrom = () => {
    this.setState({ isFormOpen: !this.state.isFormOpen });
  };

  loadGroupsForDomain(domain) {
    APIRequest.get({
      resource: 'groups',
      domain
    })
      .done(response => {
        this.setState({
          groups: { ...this.state.groups, [domain.id]: response.data }
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
    if (domain && !this.state.groups[domain.id]) {
      this.loadGroupsForDomain(domain);
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.domain && !this.props.domain) {
      return;
    }
    if (!prevProps.domain || prevProps.domain.id !== this.props.domain.id) {
      if (!this.state.groups[this.props.domain.id]) {
        this.loadGroupsForDomain(this.props.domain);
      }
    }
  }

  handleDrop = ({ dropZoneProps, draggedItemProps }) => {
    APIRequest.post({
      resource: `groups/${dropZoneProps.item.id}/group_memberships`,
      domain: this.props.domain,
      data: { data: { id: draggedItemProps.item.id, type: 'users' } }
    });
  };

  render() {
    const { groups, isFormOpen } = this.state;
    const { selectedGroup, onSelectGroup, domain } = this.props;
    return (
      <Fragment>
        {domain &&
          (groups[domain.id] || []).map(group => (
            <GenericDropZone
              key={group.id}
              itemType={[dragItemTypes.PERSON]}
              onDrop={this.handleDrop}
              item={group}
            >
              <ListItem
                key={group.id}
                text={group.attributes.title}
                onExpand={() => onSelectGroup(group)}
                selected={selectedGroup && group.id === selectedGroup.id}
                itemType={dragItemTypes.TEAM}
                item={group}
                domain={domain}
              />
            </GenericDropZone>
          ))}
        <div className="add-item-btn" onClick={this.toggleFrom}>
          +Add Team
        </div>
        {isFormOpen && (
          <MainFormPage
            selectedTab="group-pane"
            onClose={this.toggleFrom}
            domain={domain}
          />
        )}
      </Fragment>
    );
  }
}

export default TeamList;
