import React from 'react';
import orderBy from 'lodash/orderBy';
import moment from 'moment';

import DateInput from 'Components/shared/forms/DateInput';

export default {
  cssModifier: 'start-date',
  display: 'Start date',
  render(card, stateValue = card.attributes.start_date, onChange, onUpdate) {
    return (
      <DateInput
        className="sheet-view__date"
        date={stateValue}
        placeholder="No start date"
        reactDatesProps={{ noBorder: true, showDefaultInputIcon: false }}
        onChange={date =>
          onUpdate({ attributes: { start_date: moment(date).toISOString() } })
        }
      />
    );
  },
  renderSummary: () => null,
  sort(cards, order) {
    return orderBy(
      cards,
      card => moment(card.attributes.start_date).valueOf() || 0,
      order
    );
  }
};
