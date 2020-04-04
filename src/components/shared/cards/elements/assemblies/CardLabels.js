import React from 'react';
import CardLabel from 'Components/shared/cards/elements/CardLabel';

const CardLabels = ({ card, expandDirection }) => (
  <div
    className={`card-labels ${
      card.relationships.labels.data.length === 0 ? 'disappear' : ''
    }`}
  >
    <div className={`card-label-container ${expandDirection || 'up'}`}>
      {card.relationships.labels.data.map(labelId => (
        <CardLabel
          key={`card-label-${labelId}`}
          labelId={labelId}
          card={card}
        />
      ))}
    </div>
    <span className="card-label-count">
      {card.relationships.labels.data.length > 0 &&
        card.relationships.labels.data.length}
    </span>
  </div>
);

export default CardLabels;
