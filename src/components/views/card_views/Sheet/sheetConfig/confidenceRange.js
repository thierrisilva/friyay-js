import React from 'react';
import orderBy from 'lodash/orderBy';
import ConfidenceRange from 'Src/components/shared/ConfidenceRange';

export default {
  cssModifier: 'confidence-range',
  display: 'Confidence range',
  resizableProps: {
    minWidth: '400'
  },
  render(
    card,
    stateValue = card.attributes.confidence_range,
    onChange,
    onUpdate
  ) {
    return (
      <ConfidenceRange
        compactView
        value={stateValue}
        onChange={value =>
          onUpdate({ attributes: { confidence_range: value } })
        }
      />
    );
  },
  renderSummary: () => null,
  sort(cards, order) {
    return orderBy(cards, card => card.attributes.confidence_range || 0, order);
  }
};
