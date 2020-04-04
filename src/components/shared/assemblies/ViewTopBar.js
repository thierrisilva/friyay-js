import React from 'react';
import AddCardOrSubtopic from 'Components/shared/assemblies/AddCardOrSubtopic';

import { AddCardButton } from 'Components/shared/buttons/index';
import ActiveFiltersPanel from 'Components/shared/filters/ActiveFiltersPanel';
import QuickRightBarActions from './QuickRightBarActions';

const ViewTopBar = ({
  children,
  showAddCardButton = true,
  showAddSubtopicButton = false,
  showFilters = true,
  onAddCardClick,
  showQuickRightBarActions,
  showAddTextCard,
  onAddTextCardClick,
  afterCardCreated = undefined,
  ...defaultProps
}) => (
  <div className="view-top-bar">
    {showAddCardButton && !showAddSubtopicButton && (
      <div className="view-top-bar_element">
        <AddCardButton
          onAddCardClick={onAddCardClick}
          topic={defaultProps.topic}
        />
      </div>
    )}
    {showAddSubtopicButton && !showAddCardButton && (
      <div className="view-top-bar_element">
        <AddSubtopicButton />
      </div>
    )}
    {showAddCardButton && showAddSubtopicButton && (
      <div className="view-top-bar_element">
        <AddCardOrSubtopic
          topic={defaultProps.topic}
          displayAddCardButton
          displayAddSubtopicButton
          showAddTextCard={showAddTextCard}
          onAddTextCardClick={onAddTextCardClick}
          afterCardCreated={afterCardCreated}
        />
      </div>
    )}
    {children}
    {showFilters && (
      <div className="view-top-bar_element pull-right">
        <ActiveFiltersPanel />
      </div>
    )}
    {showQuickRightBarActions && (
      <QuickRightBarActions tooltipOptions={{ place: 'bottom' }} />
    )}
  </div>
);

export default ViewTopBar;
