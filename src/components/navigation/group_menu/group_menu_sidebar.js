/* global window */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import Ability from 'Lib/ability';
import tiphive from 'Lib/tiphive';
import Loader from 'Components/shared/Loader';

class GroupMenuSidebar extends Component {
  static propTypes = {
    expanded: PropTypes.bool,
    isLoading: PropTypes.bool,
    params: PropTypes.object,
    groups: PropTypes.array,
    toggleExpandClick: PropTypes.func.isRequired,
    handleNewGroupClick: PropTypes.func.isRequired,
    handleGroupClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    expanded: false,
    isLoading: false
  };

  // static contextTypes = {
  //   addTourSteps: PropTypes.func.isRequired
  // };

  tourPoint = null;


  // componentDidMount() {
  //   /*
  //    * Add tour steps
  //    * Check if target is not null !important
  //    */
  //   if (this.tourPoint !== null) {
  //     this.context.addTourSteps({
  //       title: 'Groups',
  //       text: 'Create groups to have a convenient list of people to easily share with within your Hive',
  //       selector: '#tour-step-8',
  //       position: 'right'
  //     });
  //   }
  // }


  render() {
    const {
      props: {
        expanded,
        isLoading,
        groups,
        match: { params: { group_id: selectedGroupId }},
        toggleExpandClick,
        handleGroupClick,
        handleNewGroupClick
      }
    } = this;

    const canAdd = !tiphive.userIsGuest() ||
      Ability.can('create', 'groups', window.currentDomain);

    const toggleButton = expanded ? (
      <a>&nbsp;</a>
    ) : (
      <a onClick={toggleExpandClick}>
        <i className="fa fa-chevron-right" />
      </a>
    );

    let menuGroupsContent = null;

    if (isLoading) {
      menuGroupsContent = (
        <li role="presentation" className="group-menu-item-content">
          <Loader small />
        </li>
      );
    } else {
      menuGroupsContent = groups.map(({ attributes: { slug, title }, id }) => (
        <li
          role="presentation"
          className={classNames({
            'group-menu-item': true,
            active: slug === selectedGroupId
          })}
          key={`group-menu-item-${id}`}
        >
          <a
            className="text-center"
            onClick={() => handleGroupClick(slug)}
          >
            {title.slice(0, 1)}
          </a>
        </li>
      ));
    }

    return (
      <div className="group-menu-sidebar" id="group-menu-sidebar">
        <ul className="nav nav-pills nav-stacked group-menu-sidebar">
          <li role="presentation">{toggleButton}</li>
          {menuGroupsContent}
          {canAdd && (
            <li role="presentation" id="tour-step-8" ref={anchor => (this.tourPoint = anchor)}>
              <a
                className="link-tooltip-container"
                onClick={handleNewGroupClick}
              >
                <i className="glyphicon glyphicon-plus" />
                <div className="link-tooltip right">Add Team</div>
              </a>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default withRouter(GroupMenuSidebar);
