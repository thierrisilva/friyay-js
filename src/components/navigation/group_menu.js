import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GroupMenuSidebar from './group_menu/group_menu_sidebar';
import GroupMenuContent from './group_menu/group_menu_content';
import MainFormPage from '../pages/MainFormPage';
import GroupUpdateFormPage from '../pages/group_update_form_page';
import tiphive from 'Lib/tiphive';
import { not } from 'ramda';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { filterGroupBySlug } from 'Actions/groupFilter';

class GroupMenu extends Component {
  static propTypes = {
    groups: PropTypes.array.isRequired,
    isLoading: PropTypes.bool,
    router: PropTypes.object.isRequired,
    filterBySlug: PropTypes.func.isRequired,
  };

  state = {
    expanded: false,
    isMainFormOpen: false,
    group: null,
    isGroupFormOpen: false
  };

  toggleExpandClick = e => {
    e.preventDefault();
    this.setState(state => ({ ...state, expanded: not(this.state.expanded) }));
  };

  closeMenu = () => this.setState(state => ({ ...state, expanded: false }));

  handleNewGroupClick = e => {
    e.preventDefault();
    tiphive.hideAllModals();
    this.setState(state => ({ ...state, isMainFormOpen: true }));
  };

  closeMainForm = () =>
    this.setState(state => ({ ...state, isMainFormOpen: false }));

  handleEditGroup = (group = null) => {
    if (group !== null) {
      tiphive.hideAllModals();
      this.setState(state => ({ ...state, isGroupFormOpen: true, group }));
    }
  };

  closeGroupForm = () =>
    this.setState(state => ({ ...state, isGroupFormOpen: false, group: null }));

  handleGroupClick = slug => {
    this.props.filterBySlug(slug);
    this.props.router.push(`/groups/${slug}`);
  }

  render() {
    const {
      state: { expanded, isMainFormOpen, group, isGroupFormOpen },
      props: { groups, isLoading }
    } = this;

    return (
      <div className="group-menu" id="group-menu">
        <GroupMenuSidebar
          expanded={expanded}
          isLoading={isLoading}
          groups={groups}
          toggleExpandClick={this.toggleExpandClick}
          handleNewGroupClick={this.handleNewGroupClick}
          handleGroupClick={this.handleGroupClick}
        />
        <GroupMenuContent
          expanded={expanded}
          isLoading={isLoading}
          groups={groups}
          toggleExpandClick={this.toggleExpandClick}
          handleNewGroupClick={this.handleNewGroupClick}
          closeMenu={this.closeMenu}
          handleEditGroupClick={this.handleEditGroup}
          handleGroupClick={this.handleGroupClick}
        />
        {isMainFormOpen && (
          <MainFormPage
            selectedTab="group-pane"
            onClose={this.closeMainForm}
          />
        )}
        {isGroupFormOpen && (
          <GroupUpdateFormPage group={group} onClose={this.closeGroupForm} />
        )}
      </div>
    );
  }
}



const mapDispatch = {
  filterBySlug: filterGroupBySlug
};

export default connect(undefined, mapDispatch)(withRouter(GroupMenu));
