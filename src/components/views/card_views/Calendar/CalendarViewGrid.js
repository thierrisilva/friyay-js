import React, { Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import GenericDragDropListing from 'Components/shared/drag_and_drop/GenericDragDropListing';
import getWeeksInMonth from 'Lib/getWeeksInMonth';
import times from 'lodash/times';
import CalendarViewGridRow from './CalendarViewGridRow';
import CalendarViewGridHeader from './CalendarViewGridHeader';

class CalendarViewGrid extends Component {
  static propTypes = {
    cardRequirements: PropTypes.any,
    cards: PropTypes.array,
    className: PropTypes.string,
    columnMode: PropTypes.string,
    timeframeDate: PropTypes.object,
    topicId: PropTypes.any
  };

  state = {
    columns: COLUMNS_CONFIG[this.props.columnMode](this.props.timeframeDate)
  };

  componentDidMount() {
    this.cardsRef.addEventListener('scroll', this.handleCardsScroll);
  }

  componentWillUnmount() {
    this.cardsRef.removeEventListener('scroll', this.handleCardsScroll);
  }

  handleCardsScroll = ({ target }) => {
    requestAnimationFrame(() => {
      this.headerRef.scrollLeft = target.scrollLeft;
    });
  };

  componentDidUpdate(prevProps) {
    const { cards, columnMode, timeframeDate } = this.props;
    if (
      columnMode !== prevProps.columnMode ||
      timeframeDate !== prevProps.timeframeDate
    ) {
      const date =
        columnMode === 'months' || columnMode === 'monthsWD'
          ? timeframeDate.clone().startOf('month')
          : timeframeDate;

      this.setState({
        columns: COLUMNS_CONFIG[columnMode](date)
      });
    }
  }

  render() {
    const {
      cardRequirements,
      cards = [],
      peopleOrderPeople,
      topicId,
      timeframeDate,
      columnMode,
      className,
      dmLoading
    } = this.props;

    return (
      <div className={classNames(className, 'planning-grid')}>
        <CalendarViewGridHeader
          handleRef={ref => (this.headerRef = ref)}
          columns={this.state.columns}
          columnMode={columnMode}
        />

        <div
          ref={ref => (this.cardsRef = ref)}
          className="planning-grid__cards"
        >
          {(columnMode === 'months' || columnMode === 'monthsWD') &&
            times(getWeeksInMonth(timeframeDate)).map(weekNo => (
              <CalendarViewGridRow
                key={weekNo}
                cardRequirements={cardRequirements}
                cards={cards}
                columns={COLUMNS_CONFIG[columnMode](
                  timeframeDate
                    .clone()
                    .startOf('month')
                    .add(weekNo, 'week')
                )}
                columnMode={columnMode}
                topicId={topicId}
                user={null}
                dmLoading={dmLoading}
              />
            ))}

          {(columnMode === 'weeks' || columnMode === 'weeksWD') &&
            times(24).map(rowHours => (
              <CalendarViewGridRow
                key={rowHours}
                cardRequirements={cardRequirements}
                cards={cards}
                columns={COLUMNS_CONFIG[columnMode](
                  timeframeDate.clone().set({ hours: rowHours })
                )}
                columnMode={columnMode}
                topicId={topicId}
                rowHours={
                  rowHours > 0 &&
                  moment()
                    .set({ hour: rowHours })
                    .format('h a')
                }
                user={null}
                dmLoading={dmLoading}
              />
            ))}
        </div>
      </div>
    );
  }
}

const COLUMNS_CONFIG_CACHE = new Map();

const COLUMNS_CONFIG = {
  months: date => {
    const cacheKey = `${date.valueOf()}-months`;
    let cacheEntry = COLUMNS_CONFIG_CACHE.get(cacheKey);
    if (cacheEntry) {
      return cacheEntry;
    }

    cacheEntry = times(7).map(index => {
      const day = date.clone().set({ day: index });

      const name = day.format('dddd');
      const dayOfMonth = day.format('D');

      const dayStart = day.startOf('day');
      const dayEnd = day.clone().endOf('day');

      return { id: name, name, dayOfMonth, range: [dayStart, dayEnd] };
    });

    COLUMNS_CONFIG_CACHE.set(cacheKey, cacheEntry);

    return cacheEntry;
  },
  monthsWD: date => {
    const cacheKey = `${date.valueOf()}-monthsWD`;
    let cacheEntry = COLUMNS_CONFIG_CACHE.get(cacheKey);
    if (cacheEntry) {
      return cacheEntry;
    }

    cacheEntry = times(5).map(index => {
      const day = date.clone().set({ day: index + 1 });

      const name = day.format('dddd');
      const dayOfMonth = day.format('D');

      const dayStart = day.startOf('day');
      const dayEnd = day.clone().endOf('day');

      return { id: name, name, dayOfMonth, range: [dayStart, dayEnd] };
    });

    COLUMNS_CONFIG_CACHE.set(cacheKey, cacheEntry);

    return cacheEntry;
  },
  weeks: dateTime => {
    const cacheKey = `${dateTime.valueOf()}-weeks`;
    let cacheEntry = COLUMNS_CONFIG_CACHE.get(cacheKey);
    if (cacheEntry) {
      return cacheEntry;
    }

    cacheEntry = times(7).map(index => {
      const day = dateTime.clone().set({ day: index });

      const name = day.format('dddd');
      const dayOfMonth = day.format('D');
      const startTime = day.clone();
      const endTime = day
        .clone()
        .add(1, 'hours')
        .subtract(1, 'milliseconds');

      return { id: name, name, dayOfMonth, range: [startTime, endTime] };
    });

    COLUMNS_CONFIG_CACHE.set(cacheKey, cacheEntry);
    return cacheEntry;
  },
  weeksWD: dateTime => {
    const cacheKey = `${dateTime.valueOf()}-weeksWD`;
    let cacheEntry = COLUMNS_CONFIG_CACHE.get(cacheKey);
    if (cacheEntry) {
      return cacheEntry;
    }

    cacheEntry = times(5).map(index => {
      const day = dateTime.clone().set({ day: index + 1 });

      const name = day.format('dddd');
      const dayOfMonth = day.format('D');
      const startTime = day.clone();
      const endTime = day
        .clone()
        .add(1, 'hours')
        .subtract(1, 'milliseconds');

      return { id: name, name, dayOfMonth, range: [startTime, endTime] };
    });

    COLUMNS_CONFIG_CACHE.set(cacheKey, cacheEntry);
    return cacheEntry;
  }
};

export default CalendarViewGrid;
