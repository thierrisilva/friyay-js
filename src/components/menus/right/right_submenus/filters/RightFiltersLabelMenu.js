import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { updateLabelFilters } from 'Src/newRedux/filters/thunks';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';

import SelectableLabelList from 'Components/shared/labels/elements/SelectableLabelList';
import LabelsFilterPanel from 'Components/shared/labels_filter_panel';
import Icon from 'Components/shared/Icon';
import SubMenuHeader from 'Components/menus/right/right_submenus/elements/SubMenuHeader';


const RightFiltersStatusMenu = ({ labelFilters, setRightMenuOpenForMenu, updateLabelFilters }) => (

  <div className='right-submenu'>
    <SubMenuHeader rootMenu='Filters' title='Label Filters'  />
    <div className='right-submenu_content'>
      <SelectableLabelList canAddOrEdit multiSelect onChangeSelection={ updateLabelFilters } selectedLabelIds={ labelFilters }/>
    </div>
  </div>
)


const mapState = (state, props) => ({
  labelFilters: state._newReduxTree.filters.labelFilters,
  displaySubmenu: state._newReduxTree.ui.menus.displayRightSubMenuForMenu
})

const mapDispatch = {
  setRightMenuOpenForMenu,
  updateLabelFilters
}

export default connect( mapState, mapDispatch )( RightFiltersStatusMenu );
