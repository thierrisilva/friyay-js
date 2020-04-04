import orderBy from 'lodash/orderBy';
import moment from 'moment';
import React from 'react';

import DateInput from 'Components/shared/forms/DateInput';

export default {
  cssModifier: 'completion-date',
  display: 'Completion date',
  resizableProps: {
    minWidth: '180'
  },
  render(
    card,
    stateValue = card.attributes.completion_date,
    onChange,
    onUpdate
  ) {
    return (
      <DateInput
        className="sheet-view__date"
        date={stateValue}
        placeholder="No completion date"
        reactDatesProps={{ noBorder: true, showDefaultInputIcon: false }}
        onChange={date =>
          onUpdate({
            attributes: { completion_date: moment(date).toISOString() }
          })
        }
      />
    );
  },
  renderSummary: () => null,
  sort(cards, order) {
    return orderBy(
      cards,
      card => moment(card.attributes.completion_date).valueOf() || 0,
      order
    );
  }
};
