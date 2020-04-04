import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';
import ErrorBoundary from 'Components/shared/errors/ErrorBoundary';
import { stateMappings } from 'Src/newRedux/stateMappings';
import Icon from 'Components/shared/Icon';
import RightFiltersMenu from './RightFiltersMenu';
import RightIntegrationsMenu from './RightIntegrationsMenu';
import TipHiveBot from './bot/TipHiveBot';
import RightOrdersMenu from './RightOrdersMenu';
import RightViewsMenu from './RightViewsMenu';
import RightDesignMenu from './RightDesignMenu';
import MenuCloseSideBar from 'Components/menus/shared/MenuCloseSideBar';

const menuOptions = [
  'Views',
  'Filters',
  'Orders',
  'Design',
  'Bot',
  'Integrations'
];

const subMenuOptions = [
  'Filters_Status',
  'Filters_Labels',
  'Filters_Assigned To',
  'Filters_Completed Date',
  'Filters_Created By',
  'Filters_Created Date',
  'Filters_Due Date',
  'Filters_Start Date',
  'Filters_Priority Level',
  'Integrations_google',
  'Integrations_dropbox',
  'Integrations_box',
  'Integrations_slack',
  'Orders_Cards & yays',
  'Orders_Labels',
  'Orders_People',
  'Design_Sub'
];

class RightSubMenu extends Component {
  static propTypes = {
    displaySubmenu: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    setRightMenuOpenForMenu: PropTypes.func.isRequired,
    topicId: PropTypes.string
  };

  state = {
    submenu: this.props.displaySubmenu
  };

  componentDidUpdate = ({ displaySubmenu }) => {
    if (displaySubmenu !== this.props.displaySubmenu) {
      this.setState({ submenu: this.props.displaySubmenu });
    }
  };

  /**
   * Render the submenu.
   *
   * @return {DOM}
   */
  renderSubMenu = () => {
    const { displaySubmenu, setRightMenuOpenForMenu } = this.props;
    const { submenu } = this.state;

    return (
      <ErrorBoundary>
        <div
          className={`${
            menuOptions.includes(displaySubmenu) ||
            subMenuOptions.includes(displaySubmenu)
              ? 'right-submenu_option-container presented'
              : 'right-submenu_option-container'
          }`}
        >
          <Fragment>
            {submenu.includes('Views') && <RightViewsMenu />}
            {submenu.includes('Filters') && <RightFiltersMenu />}
            {submenu.includes('Orders') && <RightOrdersMenu />}
            {submenu.includes('Integrations') && <RightIntegrationsMenu />}
            {submenu.includes('Bot') && <TipHiveBot />}
            {submenu.includes('Design') && <RightDesignMenu />}
          </Fragment>
        </div>
        <MenuCloseSideBar left onClick={() => setRightMenuOpenForMenu(null)} />
      </ErrorBoundary>
    );
  };

  render() {
    const { setRightMenuOpenForMenu, topicId } = this.props;
    const { submenu } = this.state;
    const menu = menuOptions
      .filter(m => {
        if (m === 'Design') {
          if (topicId) {
            return m;
          }
        } else {
          return m;
        }
      })
      .filter(m => m);
    return (
      <div className="right-submenu with-border">
        {submenu === true && (
          <div className="right-submenu_header">
            <span>Options Menu</span>
          </div>
        )}
        {menu.map(option => (
          <a
            className="right-submenu_item option"
            key={option}
            onClick={() => setRightMenuOpenForMenu(option)}
          >
            <span>{option}</span>
            <Icon fontAwesome icon="caret-right" />
          </a>
        ))}
        {typeof submenu == 'string' && this.renderSubMenu()}
      </div>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);
  const {
    menus,
    page: { topicId }
  } = sm;
  return {
    topicId,
    displaySubmenu: menus.displayRightSubMenuForMenu
  };
};

const mapDispatch = {
  setRightMenuOpenForMenu
};

export default connect(
  mapState,
  mapDispatch
)(RightSubMenu);
