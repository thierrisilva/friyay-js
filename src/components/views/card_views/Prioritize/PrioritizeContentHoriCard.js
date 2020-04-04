import React from 'react';

import PrioritizeLane from './PrioritizeLane';
import IconButton from 'Components/shared/buttons/IconButton';
import CardDetails from 'Src/components/views/card_views/Card/CardDetails';
import ActiveFiltersPanel from 'Components/shared/filters/ActiveFiltersPanel';

const tooltipOptions = { place: 'bottom' };

const PrioritizeContentHoriCard = ({
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
  selectedCardId,
  selectCard,
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
    <div className="prioritize-view_card-container">
      <CardDetails cardId={selectedCardId} />
      <div className="prioritize-view_lanes-container horizontal card-details">
        {priorityLevels.map(priority => (
          <PrioritizeLane
            cardRequirements={cardRequirements}
            key={priority.id}
            priority={priority}
            topicId={topicId}
            horizontalView
            cardView
            selectedCardId={selectedCardId}
            onSelectCard={selectCard}
            onDropCard={onDropCard}
            cards={laneMap[priority.level] || []}
          />
        ))}
      </div>
    </div>
  </div>
);

export default PrioritizeContentHoriCard;
