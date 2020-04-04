import orderBy from 'lodash/orderBy';
import moment from 'moment';
import React from 'react';

import DateInput from 'Components/shared/forms/DateInput';

export default {
  cssModifier: 'due-date',
  display: 'Due date',
  resizableProps: {
    minWidth: '160'
  },
  render(card, stateValue = card.attributes.due_date, onChange, onUpdate) {
    return (
      <DateInput
        className="sheet-view__date"
        date={stateValue}
        placeholder="No due date"
        reactDatesProps={{ noBorder: true, showDefaultInputIcon: false }}
        onChange={date =>
          onUpdate({ attributes: { due_date: moment(date).toISOString() } })
        }
      />
    );
  },
  renderSummary: () => null,
  sort(cards, order) {
    return orderBy(
      cards,
      card => moment(card.attributes.due_date).valueOf() || 0,
      order
    );
  }
};
