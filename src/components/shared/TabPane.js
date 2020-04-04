import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';

import CardDropZone from 'Components/shared/drag_and_drop/CardDropZone';

function TabPane({ className, defaultTab, location, router, tabs, onDrop }) {
  function switchTab(id) {
    if (location.query.tab !== id) {
      const tab = id === defaultTab ? undefined : id;
      router.replace({ ...location, query: { ...location.query, tab } });
    }
  }

  const tabPaneClassNames = classNames(className, 'tab-pane');

  function getTabClassNames(id) {
    const tab = location.query.tab;
    const isActive = id === tab || (!tab && id === defaultTab);

    return classNames('tab-pane__tab', { 'tab-pane__tab--active': isActive });
  }

  return (
    <div className={tabPaneClassNames}>
      {tabs.map(({ id, name }) => (
        <CardDropZone key={id} tab={id} onDrop={onDrop}>
          <button
            className={getTabClassNames(id)}
            onClick={() => switchTab(id)}
          >
            {name}
          </button>
        </CardDropZone>
      ))}
    </div>
  );
}

TabPane.propTypes = {
  className: PropTypes.string,
  defaultTab: PropTypes.string,
  location: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ),
  onDrop: PropTypes.func
};

export default withRouter(TabPane);
