import orderBy from 'lodash/orderBy';
import moment from 'moment';
import React from 'react';

import DateInput from 'Components/shared/forms/DateInput';

export default {
  cssModifier: 'expected-completion-date',
  display: 'Expected completion date',
  resizableProps: {
    minWidth: '260'
  },
  render(
    card,
    stateValue = card.attributes.expected_completion_date,
    onChange,
    onUpdate
  ) {
    return (
      <DateInput
        className="sheet-view__date sheet-view__date--wide"
        date={stateValue}
        placeholder="No expected completion date"
        reactDatesProps={{ noBorder: true, showDefaultInputIcon: false }}
        onChange={date =>
          onUpdate({
            attributes: { expected_completion_date: moment(date).toISOString() }
          })
        }
      />
    );
  },
  renderSummary: () => null,
  sort(cards, order) {
    return orderBy(
      cards,
      card => moment(card.attributes.expected_completion_date).valueOf() || 0,
      order
    );
  }
};
