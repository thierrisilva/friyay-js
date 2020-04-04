import classNames from 'classnames';
import orderBy from 'lodash/orderBy';
import React from 'react';

function getVariance({ attributes: attr }) {
  return (attr.resource_expended / attr.resource_required) * 100 - 100;
}

export default {
  cssModifier: 'variance',
  display: 'Variance',
  render(card) {
    const variance = getVariance(card);
    const sign = variance >= 0 ? '+' : '';
    const className = classNames('sheet-view__variance', {
      'sheet-view__variance--more': variance > 0,
      'sheet-view__variance--less': variance < 0
    });

    if (!isNaN(variance) && isFinite(variance)) {
      return <span className={className}>{`${sign}${variance}%`}</span>;
    }
  },
  renderSummary: () => null,
  sort(cards, order) {
    return orderBy(cards, card => getVariance(card), order);
  }
};
