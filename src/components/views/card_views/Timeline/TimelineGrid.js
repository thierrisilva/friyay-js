import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import AddCardCard from 'Components/shared/cards/AddCardCard';
import DMLoader from 'Src/dataManager/components/DMLoader';
import TimelineCard from './TimelineCard';
import GenericDropZone from 'Components/shared/drag_and_drop/GenericDropZone';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import { updateCard } from 'Src/newRedux/database/cards/thunks';
import { scrollToShow } from 'Src/lib/utilities';

class TimelineGrid extends Component {
  static propTypes = {
    cards: PropTypes.array,
    className: PropTypes.string,
    columnMode: PropTypes.string,
    timeframeDate: PropTypes.object,
    topicId: PropTypes.any,
    updateCard: PropTypes.func
  };

  state = {
    columns: columnsConfig[this.props.columnMode](this.props.timeframeDate)
  };

  componentDidMount() {
    this.cardsRef.addEventListener('scroll', this.handleCardsScroll);
  }

  componentDidUpdate({ columnMode, timeframeDate }) {
    if (
      columnMode !== this.props.columnMode ||
      timeframeDate !== this.props.timeframeDate
    ) {
      this.setState({
        columns: columnsConfig[this.props.columnMode](this.props.timeframeDate)
      });
    }
  }

  componentWillUnmount() {
    this.cardsRef.removeEventListener('scroll', this.handleCardsScroll);
  }

  handleCardsScroll = ev => {
    requestAnimationFrame(() => {
      this.headerRef.scrollLeft = ev.target.scrollLeft;
    });
  };

  handleDateChange = (item, type, dueDate, startDate) => {
    const attributes = {};

    if (type === 'due' && dueDate.isAfter(moment(item.attributes.start_date))) {
      attributes.due_date = dueDate;
    } else if (
      type === 'start' &&
      startDate.isBefore(moment(item.attributes.due_date))
    ) {
      attributes.start_date = startDate;
    } else {
      attributes.due_date = dueDate;
      attributes.start_date = startDate;
    }

    this.props.updateCard({ id: item.id, attributes });
  };

  handleDrop = ({
    draggedItemProps: { item, type },
    dropZoneProps: { dueDate, startDate }
  }) => this.handleDateChange(item, type, dueDate, startDate);

  handleDropOverCard = ({ draggedItemProps: { item, type }, monitor }) => {
    const dragOffset = monitor.getClientOffset();
    const windowOffset = this.gridRef.getBoundingClientRect();

    const left = dragOffset.x + this.gridRef.scrollLeft - windowOffset.x;
    const width = this.gridRef.scrollWidth;
    const colWidth = width / this.state.columns.length;
    const columnIndex = Math.floor(left / colWidth);
    const [startDate, dueDate] = this.state.columns[columnIndex].range;

    this.handleDateChange(item, type, dueDate, startDate);
  };

  afterCardCreated = cardId => {
    if (this.props.cardsSplitScreen) {
      this.props.updateSelectedCard(cardId);
    }
    const elem = document.querySelector('.card-title.c' + cardId);
    scrollToShow(elem, 14, 24);
  };

  render() {
    const gridClassNames = classNames(this.props.className, 'timeline-grid');
    const cards = this.props.cards.filter(filterCard.bind(null, this.state));
    const columnWidth = 100 / this.state.columns.length;

    return (
      <div className={gridClassNames} ref={ref => (this.gridRef = ref)}>
        <div
          className="timeline-grid__grid"
          style={{ width: `${this.state.columns.length * 250}px` }}
        >
          <div
            ref={ref => (this.headerRef = ref)}
            className="timeline-grid__header"
          >
            <div className="timeline-grid__row">
              {this.state.columns.map(col => (
                <div
                  key={col.id}
                  className="timeline-grid__cell timeline-grid__cell--header"
                >
                  {col.name}
                </div>
              ))}
            </div>
          </div>
          <div
            ref={ref => (this.cardsRef = ref)}
            className="timeline-grid__content"
          >
            <div className="timeline-grid__row">
              <div className="timeline-grid__columns">
                {this.state.columns.map(col => (
                  <div key={col.id} className="timeline-grid__cell">
                    <GenericDropZone
                      key={col.id}
                      dropClassName="timeline-grid__drop-zone-guide"
                      itemType={dragItemTypes.CARD}
                      onDrop={() => {}}
                    />
                  </div>
                ))}
              </div>
              <div className="timeline-grid__drop-zones">
                {this.state.columns.map(col => (
                  <GenericDropZone
                    key={col.id}
                    dropClassName="timeline-grid__drop-zone"
                    dueDate={col.range[1]}
                    itemType={dragItemTypes.CARD}
                    startDate={col.range[0]}
                    onDrop={this.handleDrop}
                  />
                ))}
              </div>
              <div className="timeline-grid__cards">
                {cards.map(card => {
                  const settings = getCardSettings(card, this.state);

                  return (
                    <TimelineCard
                      key={card.id}
                      card={card}
                      className="timeline-grid__card"
                      style={{
                        flexBasis: `${settings.width * columnWidth}%`,
                        marginRight: `${settings.right * columnWidth}%`,
                        marginLeft: `${settings.left * columnWidth}%`
                      }}
                      topicId={this.props.topicId}
                      onDropOverCard={this.handleDropOverCard}
                    />
                  );
                })}
                <DMLoader
                  dataRequirements={{
                    cardsWithAttributes: {
                      attributes: this.props.cardRequirements
                    }
                  }}
                  loaderKey="cardsWithAttributes"
                />
                {this.state.columns.map(col => (
                  <AddCardCard
                    key={col.id}
                    cardClassName="timeline-grid__add-card"
                    containerStyle={{ flexBasis: `${columnWidth}%` }}
                    newCardAttributes={{
                      due_date: col.range[1],
                      start_date: col.range[0]
                    }}
                    topicId={this.props.topicId}
                    afterCardCreated={this.afterCardCreated}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function getCardSettings(card, { columns = [] }) {
  const startDate = moment(
    card.attributes.start_date || card.attributes.due_date
  );
  const dueDate = moment(card.attributes.due_date);
  const firstColumn =
    columns.findIndex(col => startDate.isSameOrBefore(col.range[1])) + 1 || 1;
  const lastColumn =
    columns.findIndex(col => dueDate.isSameOrBefore(col.range[1])) + 1 ||
    columns.length;

  return {
    left: firstColumn - 1,
    right: columns.length - lastColumn,
    width: lastColumn - firstColumn + 1
  };
}

function filterCard({ columns }, card) {
  const startDate = moment(
    card.attributes.start_date || card.attributes.due_date
  );
  const dueDate = moment(card.attributes.due_date);
  const rangeStart = columns[0].range[0];
  const rangeEnd = columns[columns.length - 1].range[1];

  return !startDate.isAfter(rangeEnd) && !dueDate.isBefore(rangeStart);
}

const columnsConfig = {
  quarters: year =>
    [...new Array(4)].map((item, index) => {
      const quarterIndex = index + 1;
      const quarter = year.clone().set({ quarter: quarterIndex });

      const name = `Q${quarterIndex}`;
      const quarterStart = quarter.startOf('quarter');
      const quarterEnd = quarter.clone().endOf('quarter');

      return { id: name, name, range: [quarterStart, quarterEnd] };
    }),
  months: year =>
    [...new Array(12)].map((item, index) => {
      const month = year.clone().set({ month: index });

      const name = month.format('MMMM');
      const monthStart = month.startOf('month');
      const monthEnd = month.clone().endOf('month');

      return { id: name, name, range: [monthStart, monthEnd] };
    }),
  weeks: month =>
    [...new Array(getWeeksInMonth(month))].map((item, index) => {
      const monthStart = month.clone().startOf('month');
      const week = monthStart.add(index, 'weeks');

      const weekStart = week.startOf('week');
      const weekEnd = week.clone().endOf('week');
      const name = `${weekStart.format('MMM D')} - ${weekEnd.format('MMM D')}`;

      return { id: name, name, range: [weekStart, weekEnd] };
    }),
  weeksWD: month =>
    [...new Array(getWeeksInMonth(month))].map((item, index) => {
      const monthStart = month.clone().startOf('month');
      const week = monthStart.add(index, 'weeks');

      const weekStart = week.startOf('week').add(1, 'days');
      const weekEnd = week
        .clone()
        .startOf('week')
        .add(5, 'days');
      const name = `${weekStart.format('MMM D')} - ${weekEnd.format('MMM D')}`;

      return { id: name, name, range: [weekStart, weekEnd] };
    }),
  days: week =>
    [...new Array(7)].map((item, index) => {
      const day = week.clone().set({ day: index });

      const name = day.format('dddd');
      const dayStart = day.startOf('day');
      const dayEnd = day.clone().endOf('day');

      return { id: name, name, range: [dayStart, dayEnd] };
    }),
  daysWD: week =>
    [...new Array(5)].map((item, index) => {
      const day = week.clone().set({ day: index + 1 });

      const name = day.format('dddd');
      const dayStart = day.startOf('day');
      const dayEnd = day.clone().endOf('day');

      return { id: name, name, range: [dayStart, dayEnd] };
    })
};

function getWeeksInMonth(month) {
  const weekdaysBefore =
    month
      .clone()
      .startOf('month')
      .weekday() - 1;
  const totalDays = month.daysInMonth() + weekdaysBefore;

  return Math.ceil(totalDays / 7);
}

const mapDispatch = { updateCard };

export default connect(
  null,
  mapDispatch
)(TimelineGrid);
