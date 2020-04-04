import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { func, string, oneOfType, bool } from 'prop-types';
import { pageViewMappings } from 'Lib/config/views/views';

import { getRelevantViewForPage } from 'Src/newRedux/interface/views/selectors';
import {
  reduceArrayToMappedObjectForAttribute,
  sortAnythingAlpha
} from 'Lib/utilities';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';
import { stateMappings } from 'Src/newRedux/stateMappings';

import IconButton from 'Components/shared/buttons/IconButton';
import ViewsMenuRow from './elements/ViewsMenuRow';

const RightViewsMenu = ({ currentPage, setRightMenuOpenForMenu, viewKey }) => {
  // eslint-disable-line

  const viewOptions = pageViewMappings[currentPage];
  const selected =
    viewKey &&
    (typeof viewKey === 'string'
      ? viewOptions[viewKey]
      : viewOptions[viewKey.view]); // specific to topic page
  const viewSegments = reduceArrayToMappedObjectForAttribute(
    Object.values(viewOptions),
    'category'
  );

  return (
    <div className="right-submenu">
      <div className="right-submenu_header">
        <IconButton
          fontAwesome
          icon="caret-left"
          onClick={() => setRightMenuOpenForMenu(true)}
        />
        <span className="ml5">Views</span>
      </div>
      <div className="right-submenu_content">
        {Object.keys(viewSegments).map(viewCategory => (
          <Fragment key={viewCategory}>
            <div className="right-submenu_section-header">{`${viewCategory
              .replace('_', ' ')
              .toUpperCase()} VIEWS`}</div>
            {viewSegments[viewCategory].map(
              view =>
                (!view.disabledPages ||
                  view.disabledPages.indexOf(currentPage) === -1) && (
                  <ViewsMenuRow
                    isSelected={view == selected}
                    key={view.key}
                    view={view}
                  />
                )
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

const mapState = state => {
  const sm = stateMappings(state);
  return {
    currentPage: sm.page.page,
    displaySubmenu: sm.menus.displayRightSubMenuForMenu,
    viewKey: getRelevantViewForPage(state)
  };
};

const mapDispatch = {
  setRightMenuOpenForMenu
};

RightViewsMenu.propTypes = {
  currentPage: string.isRequired,
  displaySubmenu: oneOfType([string, bool]).isRequired,
  setRightMenuOpenForMenu: func.isRequired,
  viewKey: string
};

export default connect(
  mapState,
  mapDispatch
)(RightViewsMenu);
