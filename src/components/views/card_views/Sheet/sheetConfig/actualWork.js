import React, { Fragment } from 'react';
import orderBy from 'lodash/orderBy';

export default {
  cssModifier: 'actual-work',
  display: 'Actual work',
  resizableProps: {
    minWidth: '150'
  },
  render(
    card,
    stateValue = card.attributes.resource_expended,
    onChange,
    onUpdate
  ) {
    return (
      <Fragment>
        <input
          className="sheet-view__work-input"
          min="0"
          placeholder="0"
          type="number"
          value={stateValue}
          onChange={ev => onChange(ev.target.value)}
          onKeyDown={ev =>
            ev.keyCode === 13 &&
            onUpdate({ attributes: { resource_expended: ev.target.value } })
          }
        />
        {Number(stateValue) !== Number(card.attributes.resource_expended) && (
          <span
            className="material-icons sheet-view__save-btn"
            onClick={() =>
              onUpdate({ attributes: { resource_expended: stateValue } })
            }
          >
            save
          </span>
        )}
        <span className="sheet-view__input-label">hours</span>
      </Fragment>
    );
  },
  renderSummary(cards) {
    return cards.reduce(
      (sum, card) => sum + (Number(card.attributes.resource_expended) || 0),
      0
    );
  },
  sort(cards, order) {
    return orderBy(
      cards,
      card => Number(card.attributes.resource_expended),
      order
    );
  }
};
