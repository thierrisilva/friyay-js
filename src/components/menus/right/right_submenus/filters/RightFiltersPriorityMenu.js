import React, { Component } from 'react';
import { connect } from 'react-redux';
import { array, func } from 'prop-types';

import { setPriorityLevelFilters } from 'Src/newRedux/filters/actions';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';

import Icon from 'Components/shared/Icon';
import PriorityLevelRow from 'Components/menus/right/right_submenus/elements/PriorityLevelRow';
import SubMenuHeader from 'Components/menus/right/right_submenus/elements/SubMenuHeader';

const RightFiltersPriorityMenu = ({
  priorityFilters,
  levels,
  setRightMenuOpenForMenu,
  setPriorityLevelFilters
}) => (
  <div className="right-submenu">
    <SubMenuHeader rootMenu="Filters" title="Priority Level Filter" />
    <div className="right-submenu_content">
      {levels.map(level => (
        <PriorityLevelRow
          key={level}
          isSelected={priorityFilters.includes(level)}
          onClick={() => {
            setPriorityLevelFilters(
              priorityFilters.includes(level)
                ? priorityFilters.filter(filter => {
                    return filter !== level;
                  })
                : priorityFilters.concat([level])
            );
          }}
          level={level}
        />
      ))}
    </div>
  </div>
);

RightFiltersPriorityMenu.propTypes = {
  priorityFilters: array.isRequired,
  levels: array.isRequired,
  setRightMenuOpenForMenu: func.isRequired
};

const mapState = (state, props) => ({
  priorityFilters: state._newReduxTree.filters.priorityFilters,
  levels: ['Highest', 'High', 'Medium', 'Low', 'Lowest']
});

const mapDispatch = {
  setPriorityLevelFilters,
  setRightMenuOpenForMenu
};

export default connect(
  mapState,
  mapDispatch
)(RightFiltersPriorityMenu);
