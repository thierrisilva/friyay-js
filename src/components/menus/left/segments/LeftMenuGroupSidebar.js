import React, { Component } from 'react';
import { connect } from 'react-redux';
import { array, object } from 'prop-types';
import tiphive from 'Lib/tiphive';

import { stateMappings } from 'Src/newRedux/stateMappings';
import { selectGroup } from 'Src/newRedux/database/groups/thunks';
import { getGroups } from 'Src/newRedux/database/groups/selectors';

import MainFormPage from 'Components/pages/MainFormPage';
import GroupUpdateFormPage from 'Components/pages/group_update_form_page';
import LeftMenuGroupMenu from './LeftMenuGroupMenu';
import IconButton from 'Components/shared/buttons/IconButton'

class LeftMenuGroupSidebar extends Component {

  static propTypes = {
    groups: array.isRequired,
    routerHistory: object,
  };

  constructor(props) {
    super(props);
    this.state = {
      displayGroupUpdateForm: null,
      displayMainForm: false,
      displayMenu: false
    };
  }

  handleDismissGroupUpdateForm = () => this.setState({ displayGroupUpdateForm: null });
  handleDismissMainForm = () => this.setState({ displayMainForm: false });
  handleDismissMenu = () => this.setState({ displayMenu: false });

  handlePresentGroupUpdateForm = ( group ) => this.setState({ displayGroupUpdateForm: group });
  handlePresentMainForm = () => this.setState({ displayMainForm: true });
  handlePresentMenu = () => this.setState({ displayMenu: true });

  handleSelectGroup = ( group ) => {
    this.props.selectGroup( group.attributes.slug )
    this.handleDismissMenu();
  }

  render() {
    const { groups, selectedGroupId } = this.props;
    const { displayGroupUpdateForm, displayMainForm, displayMenu } = this.state;

    return groups.length > 0 ? (
      <div className="left-menu-group-sidebar" id="group-menu">
        <a className='left-menu-group-sidebar_sidebar-element grey-icon-button' onClick={ this.handlePresentMenu }>
          <span className="material-icons">{ displayMenu ? '' : 'chevron_right'}</span>
        </a>
        { groups.map(group =>
          <div className='left-menu-group-sidebar_sidebar-element' key={`group-selector-${group.id}`} >
            <a
              className={`${group.id == selectedGroupId ? 'left-menu-group-sidebar_group-button selected' : 'left-menu-group-sidebar_group-button'} `}
              onClick={ () => this.handleSelectGroup( group ) } >
              {group.attributes.title.charAt(0)}
            </a>
          </div>
        )}
        <IconButton
          additionalClasses='left-menu-group-sidebar_sidebar-element'
          fontAwesome
          icon='plus'
          onClick={ this.handlePresentMainForm }  />

        <div className={ `${displayMenu ? 'left-menu-group-sidebar_group-menu in-focus' : 'left-menu-group-sidebar_group-menu'}` }>
          <LeftMenuGroupMenu
            groups={ groups }
            isOpen={ displayMenu }
            onAddGroup={ this.handlePresentMainForm }
            onDismissMenu={ this.handleDismissMenu }
            onEditGroup={ this.handlePresentGroupUpdateForm }
            onSelectGroup={ this.handleSelectGroup }
            selectedGroupId={ selectedGroupId }  />
        </div>

        {displayMainForm && (
          <MainFormPage
            selectedTab="group-pane"
            onClose={this.handleDismissMainForm}  />
        )}
        {!!displayGroupUpdateForm && (
          <GroupUpdateFormPage group={ displayGroupUpdateForm } onClose={ this.handleDismissGroupUpdateForm } />
        )}
      </div>
    ) : null;
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  return {
    groups: getGroups( state ),
    routerHistory: sm.routing.routerHistory,
    selectedGroupId: sm.page.groupId,
  }
}

const mapDispatch = {
  selectGroup
}


export default connect(mapState, mapDispatch)(LeftMenuGroupSidebar);
