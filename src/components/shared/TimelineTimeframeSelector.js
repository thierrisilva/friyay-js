import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GenericDropZone from 'Components/shared/drag_and_drop/GenericDropZone';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { toggleIncludeUnCompletedSortedCardsFilter } from 'Src/newRedux/filters/thunks';

class TimelineTimeframeSelector extends Component {
  static propTypes = {
    className: PropTypes.string,
    columnMode: PropTypes.string,
    value: PropTypes.object,
    onChange: PropTypes.func,
    goalView: PropTypes.bool,
    view: PropTypes.string,
    includeUnCompletedSortedCards: PropTypes.bool,
    toggleIncludeUnCompletedSortedCardsFilter: PropTypes.func.isRequired
  };

  handleTimeframeChange(offset) {
    const { goalView, view, columnMode, value } = this.props;
    let TFConfig = timeframeConfig;
    if (view === 'calendar') TFConfig = calendarTFConfig;
    if (goalView) TFConfig = goalTFConfig;

    const nextValue = value.clone().add(offset, TFConfig[columnMode].units);
    this.props.onChange(nextValue);
  }

  render() {
    const controlClassNames = classNames(
      this.props.className,
      'timeline-timeframe-selector'
    );

    const {
      columnMode,
      view,
      goalView,
      value,
      includeUnCompletedSortedCards,
      toggleIncludeUnCompletedSortedCardsFilter,
      color
    } = this.props;

    let TFConfig = timeframeConfig;
    if (view === 'calendar') TFConfig = calendarTFConfig;
    if (goalView) TFConfig = goalTFConfig;

    return (
      <div className={controlClassNames}>
        <GenericDropZone
          dropClassName="timeline-timeframe-selector__drop-zone"
          itemType={dragItemTypes.CARD}
          onDragEnter={() => this.handleTimeframeChange(-1)}
        >
          <button
            style={{ color }}
            className="timeline-timeframe-selector__button material-icons"
            onClick={() => this.handleTimeframeChange(-1)}
          >
            keyboard_arrow_left
          </button>
        </GenericDropZone>
        <span className="timeline-timeframe-selector__value">
          {TFConfig[columnMode].format(value)}
        </span>
        <GenericDropZone
          dropClassName="timeline-timeframe-selector__drop-zone"
          itemType={dragItemTypes.CARD}
          onDragEnter={() => this.handleTimeframeChange(1)}
        >
          <button
            style={{ color }}
            className="timeline-timeframe-selector__button material-icons"
            onClick={() => this.handleTimeframeChange(1)}
          >
            keyboard_arrow_right
          </button>
        </GenericDropZone>
        {view === 'burndown' && (
          <a
            className={`timeline-timeframe-complete__status ${includeUnCompletedSortedCards &&
              'active'}`}
            onClick={toggleIncludeUnCompletedSortedCardsFilter}
          >
            Uncompleted
          </a>
        )}
      </div>
    );
  }
}

// utility
const weekFormatter = date => {
  const weekStart = date.clone().startOf('isoWeek');
  const weekEnd = date.clone().endOf('isoWeek');

  return `${weekStart.format('YYYY MMMM D')} - ${weekEnd.format('MMMM D')}`;
};

const weekDaysFormatter = date => {
  const weekStart = date.clone().weekday(1);
  const weekEnd = date.clone().weekday(5);

  return `${weekStart.format('YYYY MMMM D')} - ${weekEnd.format('MMMM D')}`;
};

// configs for diff views
const timeframeConfig = {
  days: { format: weekFormatter, units: 'weeks' },
  daysWD: { format: weekFormatter, units: 'weeks' },
  months: { format: date => date.format('YYYY'), units: 'years' },
  quarters: { format: date => date.format('YYYY'), units: 'years' },
  weeks: { format: date => date.format('YYYY MMMM'), units: 'months' },
  weeksWD: { format: date => date.format('YYYY MMMM'), units: 'months' }
};

const calendarTFConfig = {
  months: { format: date => date.format('MMM YYYY'), units: 'months' },
  monthsWD: { format: date => date.format('MMM YYYY'), units: 'months' },
  weeks: { format: weekFormatter, units: 'weeks' },
  weeksWD: { format: weekDaysFormatter, units: 'weeks' }
};

const goalTFConfig = {
  days: { format: date => date.format('YYYY MMMM D'), units: 'days' },
  months: { format: date => date.format('YYYY MMMM'), units: 'months' },
  quarters: { format: date => date.format('YYYY [Q]Q'), units: 'quarters' },
  weeks: {
    format: date => {
      const weekStart = date.clone().startOf('week');
      const weekEnd = date.clone().endOf('week');

      return `${weekStart.format('YYYY MMMM D')} - ${weekEnd.format('MMMM D')}`;
    },
    units: 'weeks'
  }
};

const mapState = state => {
  const sm = stateMappings(state);
  return {
    includeUnCompletedSortedCards: sm.filters.includeUnCompletedSortedCards
  };
};

const mapDispatch = {
  toggleIncludeUnCompletedSortedCardsFilter
};

export default connect(
  mapState,
  mapDispatch
)(TimelineTimeframeSelector);
