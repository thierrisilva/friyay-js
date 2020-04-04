import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bool, func, object } from 'prop-types';

import { selectView } from 'Src/newRedux/interface/views/thunks';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { updateTopic } from 'Src/newRedux/database/topics/thunks';

import Ability from 'Lib/ability';
import DefaultBadge from 'Components/shared/badges/DefaultBadge';
import IconButton from 'Components/shared/buttons/IconButton';
import Icon from 'Components/shared/Icon';
import OptionsDropdownButton from 'Components/shared/buttons/OptionsDropdownButton';

const ViewsMenuRow = ({
  currentTopic,
  isSelected,
  selectView,
  setRightMenuOpenForMenu,
  updateTopic,
  view
}) => {
  const handleSelectView = () => {
    selectView(view);
    setRightMenuOpenForMenu(false);
  };

  const handleSetViewAsDefaultForTopic = view => {
    const attributes = { default_view_id: view.key };
    updateTopic({ id: currentTopic.id, attributes });
  };

  return (
    <div className="right-submenu_item option" key={view.name}>
      <a
        className={`dark-grey-link ${isSelected && 'active'}`}
        onClick={handleSelectView}
      >
        <Icon fontAwesome={view.fontAwesomeIcon} icon={view.icon} />
        <span className="ml5">{view.name}</span>
        {currentTopic &&
          view.key == currentTopic.attributes.default_view_id && (
            <DefaultBadge />
          )}
      </a>
      {currentTopic && Ability.can('update', 'self', currentTopic) && (
        <OptionsDropdownButton>
          <a
            className="dropdown-option-item"
            onClick={() => handleSetViewAsDefaultForTopic(view)}
          >
            Make default view
          </a>
        </OptionsDropdownButton>
      )}
    </div>
  );
};

const mapState = (state, props) => {
  const sm = stateMappings(state);
  return {
    currentTopic: sm.topics[sm.page.topicId]
  };
};

const mapDispatch = {
  selectView,
  setRightMenuOpenForMenu,
  updateTopic
};

ViewsMenuRow.propTypes = {
  currentTopic: object,
  isSelected: bool,
  selectView: func.isRequired,
  setRightMenuOpenForMenu: func.isRequired,
  updateTopic: func.isRequired,
  view: object.isRequired
};

export default connect(
  mapState,
  mapDispatch
)(ViewsMenuRow);
