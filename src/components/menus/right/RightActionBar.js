/* global $crisp, appEnv */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';
import { stateMappings } from 'Src/newRedux/stateMappings';
import viewConfig from 'Lib/config/views/views';
import get from 'lodash/get';
import { getRelevantViewForPage } from 'Src/newRedux/interface/views/selectors';
import { ButtonMenuOpenDismiss } from 'Components/shared/buttons/index';
import ChatButton from './elements/ChatButton';
import DockToggleButton from './elements/DockToggleButton';
import IconButton from 'Components/shared/buttons/IconButton';
import { toggleCardsSplitScreen } from 'Src/newRedux/interface/menus/actions.js';
import QSModal from 'Components/pages/quick_setup';

class RightActionBar extends Component {
  static propTypes = {
    viewKey: PropTypes.string,
    showBadgeOnBot: PropTypes.bool,
    cardsSplitScreen: PropTypes.bool,
    displaySubmenu: PropTypes.any,
    toggleCardsSplitScreen: PropTypes.func,
    setRightMenuOpenForMenu: PropTypes.func,
    topicId: PropTypes.string
  };
  state = {
    quickSetup: false
  };

  handleMenuButtonClick = () => {
    const { displaySubmenu, setRightMenuOpenForMenu } = this.props;
    setRightMenuOpenForMenu(!displaySubmenu);
  };

  getAdditionalClasses = activeMenu => {
    return `right-action-bar_button ${this.props.displaySubmenu == activeMenu &&
      'active'}`;
  };

  openActiveRightMenu = activeMenu => () => {
    const { setRightMenuOpenForMenu, displaySubmenu } = this.props;
    setRightMenuOpenForMenu(displaySubmenu === activeMenu ? null : activeMenu);
  };

  toggleQuickSetup = () => {
    this.setState({ quickSetup: !this.state.quickSetup });
  };

  render() {
    const {
      viewKey,
      displaySubmenu,
      showBadgeOnBot,
      cardsSplitScreen,
      toggleCardsSplitScreen,
      setRightMenuOpenForMenu,
      topicId
    } = this.props;
    const isUserProfileView = window.location.pathname.includes('users/');

    const isSplitLayoutDisabled = get(
      viewConfig.cards,
      `[${viewKey}].isSplitLayoutDisabled`,
      false
    );

    const tooltipOptions = { place: 'bottom' };

    return (
      <div className="right-action-bar">
        <ButtonMenuOpenDismiss
          additionalClasses="right-action-bar_button"
          dismissRight
          isOpen={displaySubmenu}
          onClick={this.handleMenuButtonClick}
        />
        <div
          className={`${isUserProfileView ? 'flex-point-8' : 'flex-1'} flex-c`}
        >
          <IconButton
            additionalClasses={this.getAdditionalClasses('Views')}
            color="#CCC"
            icon="view_carousel"
            tooltip="Views"
            tooltipOptions={tooltipOptions}
            onClick={this.openActiveRightMenu('Views')}
          />
          <IconButton
            additionalClasses={this.getAdditionalClasses('Filters')}
            color="#CCC"
            icon="filter_list"
            tooltip="Filters"
            tooltipOptions={tooltipOptions}
            onClick={this.openActiveRightMenu('Filters')}
          />
          <IconButton
            additionalClasses={this.getAdditionalClasses('Orders')}
            color="#CCC"
            icon="swap_vert"
            tooltip="Orders"
            tooltipOptions={tooltipOptions}
            onClick={this.openActiveRightMenu('Orders')}
          />
          <IconButton
            additionalClasses={classNames('right-action-bar_button', {
              active: !isSplitLayoutDisabled && cardsSplitScreen,
              'right-action-bar_button--disabled': isSplitLayoutDisabled
            })}
            color="#CCC"
            fontAwesome
            icon="columns"
            tooltip={
              isSplitLayoutDisabled
                ? 'Split View Disabled for Current view'
                : 'Split View'
            }
            tooltipOptions={tooltipOptions}
            onClick={() => !isSplitLayoutDisabled && toggleCardsSplitScreen()}
          />
          <IconButton
            additionalClasses={this.getAdditionalClasses('Bot')}
            color="#CCC"
            icon="android"
            tooltip="Bot"
            tooltipOptions={tooltipOptions}
            showBadge={showBadgeOnBot}
            onClick={this.openActiveRightMenu('Bot')}
          />
          <IconButton
            additionalClasses={this.getAdditionalClasses('Integrations')}
            color="#CCC"
            icon="power"
            tooltip="Integrations"
            tooltipOptions={tooltipOptions}
            onClick={this.openActiveRightMenu('Integrations')}
          />
          <IconButton
            additionalClasses={this.getAdditionalClasses('QuickSetup')}
            color="#CCC"
            icon="map"
            tooltip="Quick Setup"
            tooltipOptions={tooltipOptions}
            onClick={this.toggleQuickSetup}
          />
          {topicId && (
            <IconButton
              additionalClasses={
                'right-action-bar_button ' +
                (displaySubmenu == 'Design' ? 'active' : '')
              }
              color="#CCC"
              icon="color_lens"
              tooltip="Design"
              tooltipOptions={tooltipOptions}
              onClick={() =>
                setRightMenuOpenForMenu(
                  displaySubmenu == 'Design' ? null : 'Design'
                )
              }
            />
          )}
          <ChatButton />
          {this.state.quickSetup && (
            <QSModal toggleModal={this.toggleQuickSetup} />
          )}
        </div>
        <DockToggleButton />
      </div>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);
  const {
    menus,
    bot,
    page: { topicId }
  } = sm;
  return {
    displaySubmenu: menus.displayRightSubMenuForMenu,
    cardsSplitScreen: menus.cardsSplitScreen,
    showBadgeOnBot: bot.showBadge,
    viewKey: getRelevantViewForPage(state),
    topicId
  };
};

const mapDispatch = {
  setRightMenuOpenForMenu,
  toggleCardsSplitScreen
};

export default connect(
  mapState,
  mapDispatch
)(RightActionBar);
