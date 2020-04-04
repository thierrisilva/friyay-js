/* global window */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import Ability from 'Lib/ability';
import tiphive from 'Lib/tiphive';
import Loader from 'Components/shared/Loader';

class GroupMenuContent extends Component {
  static propTypes = {
    expanded: PropTypes.bool,
    isLoading: PropTypes.bool,
    params: PropTypes.object.isRequired,
    groups: PropTypes.array,
    handleEditGroupClick: PropTypes.func.isRequired,
    toggleExpandClick: PropTypes.func.isRequired,
    closeMenu: PropTypes.func.isRequired,
    handleNewGroupClick: PropTypes.func.isRequired,
    handleGroupClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    expanded: false,
    isLoading: false
  };

  handleGroupListClick = groupID => {
    this.props.closeMenu();
    this.props.handleGroupClick(groupID);
  };

  render() {
    const {
      props: {
        expanded,
        isLoading,
        groups,
        match: { params: { group_id: selectedGroupId }},
        toggleExpandClick,
        handleNewGroupClick,
        handleEditGroupClick
      }
    } = this;

    const contentClass = classNames({ 'group-menu-content': true, expanded });
    const canAdd =
      !tiphive.userIsGuest() ||
      Ability.can('create', 'groups', window.currentDomain);

    let menuGroupsContent = null;

    if (isLoading) {
      menuGroupsContent = (
        <li
          role="presentation"
          className="group-menu-item-content"
          key="group-menu-item-content-loader"
        >
          <Loader />
        </li>
      );
    } else {
      menuGroupsContent = groups.map(group => {
        const { attributes: { slug, title }, id } = group;

        return (
          <li
            role="presentation"
            className={classNames({
              'group-menu-item-content': true,
              active: slug === selectedGroupId
            })}
            key={`group-menu-item-content-${id}`}
          >
            <a
              className="text-center"
              onClick={() => this.handleGroupListClick(slug)}
            >
              {title}
            </a>
            {Ability.can('update', 'groups', window.currentDomain) && (
              <a
                className="pull-right"
                onClick={() => handleEditGroupClick(group)}
              >
                <i className="glyphicon glyphicon-cog" />
              </a>
            )}
          </li>
        );
      });
    }

    return (
      <div className={contentClass} id="group-menu-content">
        <ul className="nav nav-pills nav-stacked">
          <li role="presentation">
            <a onClick={toggleExpandClick}>
              Teams&nbsp;
              <span className="pull-right">
                <i className="fa fa-chevron-left" />
              </span>
            </a>
          </li>

          {menuGroupsContent}
          {canAdd && (
            <li role="presentation">
              <a onClick={handleNewGroupClick}>Add team</a>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default withRouter(GroupMenuContent);
