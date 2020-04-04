import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopicViewFilter from 'Components/pages/topic_page/topic_view_filter';
import LabelsFilterPanel from 'Components/shared/labels_filter_panel';
import RightActionBar from './RightActionBar';
import RightSubMenu from './right_submenus/RightSubMenu';
import Icon from 'Src/components/shared/Icon';

class RightActionBarContainer extends Component {
  render() {
    const { displaySubmenu } = this.props;
    return (
      <div
        className={`right-action-bar-container ${
          displaySubmenu ? 'expanded' : ''
        }`}
      >
        <Icon
          icon="chevron-left"
          fontAwesome
          className="right-action-bar-expander"
        />
        <div
          className={`right-action-bar-container_submenu-outer-container ${
            displaySubmenu ? 'in-focus' : ''
          }`}
        >
          <RightSubMenu />
        </div>
        <RightActionBar />
      </div>
    );
  }
}

const mapState = (state, props) => ({
  displaySubmenu: state._newReduxTree.ui.menus.displayRightSubMenuForMenu
});

export default connect(mapState)(RightActionBarContainer);
