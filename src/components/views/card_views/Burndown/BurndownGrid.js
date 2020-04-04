import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import BurndownGridRow from './BurndownGridRow';
import { addRemoveAssignedUsersOnCard } from 'Src/newRedux/database/cards/thunks';
import { getSelectedPeopleOrder } from 'Src/newRedux/database/peopleOrders/selectors';
import { stateMappings } from 'newRedux/stateMappings';
import { updateCard } from 'Src/newRedux/database/cards/thunks';
import { updateOrCreatePeopleOrder } from 'Src/newRedux/database/peopleOrders/abstractions';
import getWeeksInMonth from 'Lib/getWeeksInMonth';

class BurndownGrid extends Component {
  static propTypes = {
    cardRequirements: PropTypes.any,
    cards: PropTypes.array,
    className: PropTypes.string,
    columnMode: PropTypes.string,
    timeframeDate: PropTypes.object,
    topicId: PropTypes.any,
    users: PropTypes.array,
    updateCard: PropTypes.func,
    dmLoading: PropTypes.bool
  };

  state = {
    columns: columnsConfig[this.props.columnMode](this.props.timeframeDate),
    usersToShow: null
  };

  componentDidMount() {
    this.cardsRef.addEventListener('scroll', this.handleCardsScroll);
  }

  componentWillReceiveProps({ cards, columnMode, timeframeDate }) {
    const updates = {};

    if (
      columnMode !== this.props.columnMode ||
      timeframeDate !== this.props.timeframeDate
    ) {
      updates.columns = columnsConfig[columnMode](timeframeDate);
    }

    if (!this.state.usersToShow) {
      updates.usersToShow = Object.keys(cards).reduce(
        (res, id) => ({ ...res, [id]: true }),
        {}
      );
    }

    this.setState(updates);
  }

  componentWillUnmount() {
    this.cardsRef.removeEventListener('scroll', this.handleCardsScroll);
  }

  handleCardsScroll = ev => {
    requestAnimationFrame(() => {
      this.headerRef.scrollLeft = ev.target.scrollLeft;
    });
  };

  handleChangeUserForLane = (prevPerson, newPersonId) => {
    const { peopleOrderPeopleIds, updateOrCreatePeopleOrder } = this.props;
    const revisedPeopleOrderPeopleIds = peopleOrderPeopleIds.filter(
      id => id != newPersonId
    );

    prevPerson
      ? revisedPeopleOrderPeopleIds.splice(
          revisedPeopleOrderPeopleIds.indexOf(prevPerson.id),
          1,
          newPersonId
        )
      : revisedPeopleOrderPeopleIds.push(newPersonId);
    updateOrCreatePeopleOrder(revisedPeopleOrderPeopleIds);
  };

  render() {
    const { cards, topicId, dmLoading } = this.props;

    const { columns } = this.state;

    const gridClassNames = classNames(this.props.className, 'planning-grid');

    return (
      <div className={gridClassNames}>
        <div
          ref={ref => (this.headerRef = ref)}
          className="planning-grid__header"
        >
          <div className="planning-grid__row">
            {this.state.columns.map(col => (
              <div
                key={col.id}
                className="planning-grid__cell planning-grid__cell--header"
              >
                {col.name}
              </div>
            ))}
          </div>
        </div>
        <div
          ref={ref => (this.cardsRef = ref)}
          className="planning-grid__cards"
        >
          <BurndownGridRow
            cards={cards || []}
            columns={columns}
            isCollapsible
            onChangeUserForRow={this.handleChangeUserForLane}
            showCardsList
            title="Unassigned"
            topicId={topicId}
            dmLoading={dmLoading}
            user={null}
          />
        </div>
      </div>
    );
  }
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
  days: week =>
    [...new Array(7)].map((item, index) => {
      const day = week.clone().set({ day: index });

      const name = day.format('dddd');
      const dayStart = day.startOf('day');
      const dayEnd = day.clone().endOf('day');

      return { id: name, name, range: [dayStart, dayEnd] };
    })
};

const mapState = (state, props) => {
  const sm = stateMappings(state);
  const selectedPeopleOrder = getSelectedPeopleOrder(state);
  const peopleOrderPeopleIds = selectedPeopleOrder
    ? selectedPeopleOrder.attributes.order.filter(userId => !!sm.people[userId])
    : [];

  return {
    confirmedNewOrChangeOrderIds:
      sm.session.peopleOrdersUserHasConfirmedNewOrChangeOrder,
    people: sm.people,
    peopleOrderPeopleIds: peopleOrderPeopleIds,
    peopleOrderPeople: peopleOrderPeopleIds.map(id => sm.people[id]),
    selectedPeopleOrder: selectedPeopleOrder,
    informedNoSelectedOrder:
      sm.session.topicsUserHasBeenInformedNoSelectedPeopleOrder
  };
};

const mapDispatch = {
  addRemoveAssignedUsersOnCard,
  updateCard,
  updateOrCreatePeopleOrder
};

export default connect(
  mapState,
  mapDispatch
)(BurndownGrid);
