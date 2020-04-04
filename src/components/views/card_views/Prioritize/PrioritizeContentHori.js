import React from 'react';

import PrioritizeLane from './PrioritizeLane';
import IconButton from 'Components/shared/buttons/IconButton';
import ActiveFiltersPanel from 'Components/shared/filters/ActiveFiltersPanel';

const tooltipOptions = { place: 'bottom' };

const PrioritizeContentHori = ({
  top,
  left,
  priorityLevels,
  cardRequirements,
  topicId,
  onDropCard,
  laneMap,
  toggleSetup,
  displayUnprioritizedPanel,
  toggleUnprioritizedPanel,
  color,
  background
}) => (
  <div className="kanban-view_main-section">
    <IconButton
      containerClasses="left-section-icon-container"
      wrapperClasses="left-section-icon"
      style={{
        top,
        left,
        backgroundColor: background ? background : '#fafafa'
      }}
      color={color}
      fontAwesome
      icon={displayUnprioritizedPanel ? 'chevron-left' : 'chevron-right'}
      onClick={toggleUnprioritizedPanel}
    />
    <ActiveFiltersPanel />
    <div className="prioritize-view_lanes-container horizontal">
      {priorityLevels.map(priority => (
        <PrioritizeLane
          cardRequirements={cardRequirements}
          key={priority.id}
          priority={priority}
          topicId={topicId}
          onDropCard={onDropCard}
          horizontalView
          cards={laneMap[priority.level] || []}
        />
      ))}
    </div>
  </div>
);

export default PrioritizeContentHori;
