import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import PrioritizeCard from './PrioritizeCard';
import AddCardCard from 'Src/components/shared/cards/AddCardCard';
import GenericDragDropListing from 'Components/shared/drag_and_drop/GenericDragDropListing';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import { scrollToShow } from 'Src/lib/utilities';
import DMLoader from 'Src/dataManager/components/DMLoader';

const PrioritizeLane = ({
  priority,
  topicId,
  cards,
  onDropCard,
  cardRequirements,
  selectedCardId,
  onSelectCard,
  horizontalView,
  cardView
}) => (
  <div className={`prioritize-lane ${horizontalView ? 'horizontal' : ''}`}>
    <div
      className={`prioritize-lane_header`}
      style={{ backgroundColor: `${priority.color}` }}
    >
      <div>{priority.level}</div>
    </div>
    <GenericDragDropListing
      dropClassName="kanban-view_lane-catchment"
      dragClassName="task-view_drag-card"
      dropZoneProps={{ topicId: topicId, priority: priority.level }}
      draggedItemProps={{
        origin: { topicId: topicId, priority: priority.level }
      }}
      itemContainerClassName="task-view_card-container"
      itemList={cards}
      itemType={dragItemTypes.CARD}
      onDropItem={onDropCard}
      renderItem={card => (
        <PrioritizeCard
          onSelectCard={onSelectCard}
          card={card}
          key={card.id}
          isSelected={card.id === selectedCardId}
          horizontalView={horizontalView}
          cardView={cardView}
          topicId={topicId}
        />
      )}
    >
      <AddCardCard
        cardClassName="prioritize-card"
        newCardAttributes={{ priority_level: priority.level }}
        topicId={topicId}
        afterCardCreated={cardId => {
          const elem = document.querySelector('.card-title.c' + cardId);
          scrollToShow(elem, 14, 24);
        }}
      />

      <DMLoader
        dataRequirements={{
          cardsWithAttributes: { attributes: { ...cardRequirements, topicId } }
        }}
        loaderKey="cardsWithAttributes"
      />
    </GenericDragDropListing>
  </div>
);

export default PrioritizeLane;
