import React from 'react';
import orderBy from 'lodash/orderBy';

import CardPriorityControl from 'Components/shared/cards/elements/CardPriorityControl';

const priority = {
  Lowest: 1,
  Low: 2,
  Medium: 3,
  High: 4,
  Highest: 5
};

export default {
  cssModifier: 'priority',
  display: 'Priority',
  render(
    card,
    stateValue = card.attributes.priority_level,
    onChange,
    onUpdate
  ) {
    return (
      <CardPriorityControl
        className="sheet-view__priority"
        value={stateValue}
        onChange={value => onUpdate({ attributes: { priority_level: value } })}
      />
    );
  },
  resizableProps: {
    minWidth: '265'
  },
  renderSummary: () => null,
  sort(cards, order) {
    return orderBy(
      cards,
      card => priority[card.attributes.priority_level] || 0,
      order
    );
  }
};
