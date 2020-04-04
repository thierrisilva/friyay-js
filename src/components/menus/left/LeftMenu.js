import classNames from 'classnames';
import React, { PureComponent } from 'react';
import { bool, func } from 'prop-types';
import { connect } from 'react-redux';

import ErrorBoundary from 'Components/shared/errors/ErrorBoundary';
import LeftMenuDomainSegment from './segments/LeftMenuDomainSegment';
import LeftMenuGroupIndicator from './segments/LeftMenuGroupIndicator';
import LeftMenuPeopleSegment from './segments/LeftMenuPeopleSegment';
import LeftMenuTopicSegment from './segments/LeftMenuTopicSegment';
import LeftMenuUserSegment from './segments/LeftMenuUserSegment';
import MenuCloseSideBar from 'Components/menus/shared/MenuCloseSideBar';
import { toggleLeftMenu } from 'Src/newRedux/interface/menus/thunks';
import { stateMappings } from 'Src/newRedux/stateMappings';
import WorkspacesMenu from 'Src/components/menus/left/WorkspacesMenu';

class LeftMenu extends PureComponent {
  static propTypes = {
    displayMenu: bool,
    toggleLeftMenu: func.isRequired
  };

  constructor(props) {
    super(props);
    this.toggleLeftMenu = props.toggleLeftMenu;
    this.handleDismissMenu = this.handleDismissMenu.bind(this);
    this.handleDismissMenu(); // Keep left menu closed by default
  }

  handleDismissMenu = () => {
    this.toggleLeftMenu(false);
  };

  render() {
    const { displayMenu } = this.props;
    const leftMenuFocusClass = classNames({ 'in-focus': displayMenu });

    return (
      <div className={`left-menu-root-container ${leftMenuFocusClass}`}>
        <WorkspacesMenu />
        <div className={`left-menu ${leftMenuFocusClass}`} id="left-menu">
          <ErrorBoundary>
            <LeftMenuDomainSegment />
          </ErrorBoundary>
          <div className="left-menu_content-container">
            <div className="left-menu_content relative">
              <ErrorBoundary>
                <LeftMenuGroupIndicator />
              </ErrorBoundary>
              <ErrorBoundary>
                <LeftMenuTopicSegment />
              </ErrorBoundary>
              <ErrorBoundary>
                <LeftMenuPeopleSegment />
              </ErrorBoundary>
            </div>
          </div>
          <MenuCloseSideBar right onClick={this.handleDismissMenu} />
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  displayMenu: stateMappings(state).menus.displayLeftMenu
});

const mapDispatch = { toggleLeftMenu };

export default connect(
  mapState,
  mapDispatch
)(LeftMenu);
