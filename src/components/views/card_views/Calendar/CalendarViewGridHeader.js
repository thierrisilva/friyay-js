import React, { PureComponent } from 'react';

export default class CalendarViewGridHeader extends PureComponent {
  render() {
    const { columnMode, columns, handleRef } = this.props;

    return (
      <div ref={handleRef} className="planning-grid__header">
        <div className="planning-grid__row">
          {(columnMode === 'weeks' || columnMode === 'weeksWD') && (
            <div className="planning-grid__cell planning-grid__cell--user" />
          )}

          {columns.map(col => (
            <div
              key={col.id}
              className="planning-grid__cell planning-grid__cell--header calendar-view__cell--header flex flex-r-start-spacearound"
            >
              {(columnMode === 'weeks' || columnMode === 'weeksWD') && (
                <div> {col.dayOfMonth} </div>
              )}
              <div> {col.name} </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
