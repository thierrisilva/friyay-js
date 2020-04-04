import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { stateMappings } from 'Src/newRedux/stateMappings';

import { changeView } from 'Src/newRedux/interface/views/actions';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';
import {
  toggleIncludeArchivedFilter,
  toggleIncludeSubtopicCardsFilter,
  toggleIncludeNestedCardsFilter,
  toggleIncludeCompletedCardsFilter,
  toggleIncludeUnCompletedCardsFilter
} from 'Src/newRedux/filters/thunks';

import IconButton from 'Components/shared/buttons/IconButton';
import Icon from 'Components/shared/Icon';
import RightFiltersAssignedMenu from './filters/RightFiltersAssignedMenu';
import RightFiltersCompletedDateMenu from './filters/RightFiltersCompletedDateMenu';
import RightFiltersCreatedDateMenu from './filters/RightFiltersCreatedDateMenu';
import RightFiltersCreatorMenu from './filters/RightFiltersCreatorMenu';
import RightFiltersDueDateMenu from './filters/RightFiltersDueDateMenu';
import RightFiltersStartDateMenu from './filters/RightFiltersStartDateMenu';
import RightFiltersStatusMenu from './filters/RightFiltersStatusMenu';
import RightFiltersLabelMenu from './filters/RightFiltersLabelMenu';
import RightFiltersPriorityMenu from './filters/RightFiltersPriorityMenu';

const filters = [
  'Status',
  'Labels',
  'Created By',
  'Assigned To',
  'Created Date',
  'Start Date',
  'Due Date',
  'Completed Date',
  'Priority Level'
];

const RightFiltersMenu = (
  {
    displaySubmenu,
    includeArchivedCards,
    includeSubtopicCards,
    includeNestedCards,
    includeCompletedCards,
    includeUnCompletedCards,
    setRightMenuOpenForMenu,
    toggleIncludeArchivedFilter,
    toggleIncludeSubtopicCardsFilter,
    toggleIncludeNestedCardsFilter,
    toggleIncludeCompletedCardsFilter,
    toggleIncludeUnCompletedCardsFilter
  } // eslint-disable-line
) => (
  <div className="right-submenu">
    <div className="right-submenu_header">
      <IconButton
        fontAwesome
        icon="caret-left"
        onClick={() => setRightMenuOpenForMenu(true)}
      />
      <span className="ml5">Filters</span>
    </div>
    {Object.values(filters).map(filter => (
      <a
        className="right-submenu_item option"
        key={filter}
        onClick={() => setRightMenuOpenForMenu(`${displaySubmenu}_${filter}`)}
      >
        <span>{filter}</span>
        <Icon fontAwesome icon="caret-right" />
      </a>
    ))}
    <a
      className="right-submenu_item option"
      onClick={toggleIncludeArchivedFilter}
    >
      <span>Include Archived Cards?</span>
      <Icon
        fontAwesome
        icon={includeArchivedCards ? 'check-square' : 'square'}
      />
    </a>
    <a
      className="right-submenu_item option"
      onClick={toggleIncludeSubtopicCardsFilter}
    >
      <span>Include Cards from yays?</span>
      <Icon
        fontAwesome
        icon={includeSubtopicCards ? 'check-square' : 'square'}
      />
    </a>
    <a
      className="right-submenu_item option"
      onClick={toggleIncludeNestedCardsFilter}
    >
      <span>Include Nested Cards?</span>
      <Icon fontAwesome icon={includeNestedCards ? 'check-square' : 'square'} />
    </a>
    <a
      className="right-submenu_item option"
      onClick={toggleIncludeCompletedCardsFilter}
    >
      <span>Include completed Cards?</span>
      <Icon
        fontAwesome
        icon={includeCompletedCards ? 'check-square' : 'square'}
      />
    </a>
    <a
      className="right-submenu_item option"
      onClick={toggleIncludeUnCompletedCardsFilter}
    >
      <span>Include uncompleted Cards?</span>
      <Icon
        fontAwesome
        icon={includeUnCompletedCards ? 'check-square' : 'square'}
      />
    </a>
    <div
      className={`${
        typeof displaySubmenu == 'string' && displaySubmenu.includes('Filters_')
          ? 'right-submenu_option-container presented'
          : 'right-submenu_option-container'
      }`}
    >
      {displaySubmenu == 'Filters_Assigned To' && <RightFiltersAssignedMenu />}
      {displaySubmenu == 'Filters_Created By' && <RightFiltersCreatorMenu />}
      {displaySubmenu == 'Filters_Created Date' && (
        <RightFiltersCreatedDateMenu />
      )}
      {displaySubmenu == 'Filters_Due Date' && <RightFiltersDueDateMenu />}
      {displaySubmenu == 'Filters_Start Date' && <RightFiltersStartDateMenu />}
      {displaySubmenu == 'Filters_Completed Date' && (
        <RightFiltersCompletedDateMenu />
      )}
      {displaySubmenu == 'Filters_Status' && <RightFiltersStatusMenu />}
      {displaySubmenu == 'Filters_Labels' && <RightFiltersLabelMenu />}
      {displaySubmenu == 'Filters_Priority Level' && (
        <RightFiltersPriorityMenu />
      )}
    </div>
  </div>
);

RightFiltersMenu.propTypes = {
  includeArchivedCards: PropTypes.bool,
  includeSubtopicCards: PropTypes.bool,
  includeNestedCards: PropTypes.bool,
  includeCompletedCards: PropTypes.bool,
  includeUnCompletedCards: PropTypes.bool,
  displaySubmenu: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  setRightMenuOpenForMenu: PropTypes.func,
  toggleIncludeArchivedFilter: PropTypes.func,
  toggleIncludeSubtopicCardsFilter: PropTypes.func,
  toggleIncludeNestedCardsFilter: PropTypes.func,
  toggleIncludeCompletedCardsFilter: PropTypes.func,
  toggleIncludeUnCompletedCardsFilter: PropTypes.func
};

const mapState = state => {
  const sm = stateMappings(state);
  return {
    displaySubmenu: sm.menus.displayRightSubMenuForMenu,
    includeArchivedCards: sm.filters.includeArchivedCards,
    includeSubtopicCards: sm.filters.includeSubtopicCards,
    includeNestedCards: sm.filters.includeNestedCards,
    includeCompletedCards: sm.filters.includeCompletedCards,
    includeUnCompletedCards: sm.filters.includeUnCompletedCards
  };
};

const mapDispatch = {
  changeView,
  setRightMenuOpenForMenu,
  toggleIncludeArchivedFilter,
  toggleIncludeSubtopicCardsFilter,
  toggleIncludeNestedCardsFilter,
  toggleIncludeCompletedCardsFilter,
  toggleIncludeUnCompletedCardsFilter
};

export default connect(
  mapState,
  mapDispatch
)(RightFiltersMenu);
