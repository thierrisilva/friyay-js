import orderBy from 'lodash/orderBy';
import React from 'react';
import CompletionSlider from 'Components/shared/CompletionSlider';

export default {
  cssModifier: 'completion',
  display: 'Completion',
  resizableProps: {
    minWidth: '180'
  },
  render(
    card,
    stateValue = card.attributes.completed_percentage,
    onChange,
    onUpdate
  ) {
    return (
      <CompletionSlider
        card={card}
        className="sheet-view__completion"
        compactView
        value={stateValue}
        width="100%"
        onChange={value =>
          onUpdate({ attributes: { completed_percentage: value } })
        }
      />
    );
  },
  renderSummary(cards) {
    const total = cards.reduce(
      (sum, card) => sum + (card.attributes.completed_percentage || 0),
      0
    );
    const potential = cards.length * 100;
    const value = (total / potential) * 100;

    return (
      <CompletionSlider
        className="sheet-view__completion"
        compactView
        value={value}
        width="100%"
        onChange={() => {}}
      />
    );
  },
  sort(cards, order) {
    return orderBy(cards, card => card.attributes.completed_percentage, order);
  }
};
