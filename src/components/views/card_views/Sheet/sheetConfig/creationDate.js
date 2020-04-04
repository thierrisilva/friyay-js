import orderBy from 'lodash/orderBy';
import moment from 'moment';
import React from 'react';

import DateInput from 'Components/shared/forms/DateInput';

export default {
  cssModifier: 'creation-date',
  display: 'Creation date',
  resizableProps: {
    minWidth: '150'
  },
  render(card, stateValue = card.attributes.created_at) {
    return (
      <DateInput
        className="sheet-view__date"
        date={stateValue}
        placeholder="No creation date"
        reactDatesProps={{
          focused: false,
          noBorder: true,
          showDefaultInputIcon: false,
          showClearDate: false
        }}
      />
    );
  },
  renderSummary: () => null,
  sort(cards, order) {
    return orderBy(
      cards,
      card => moment(card.attributes.created_at).valueOf() || 0,
      order
    );
  }
};
