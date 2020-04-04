import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import StatusTableCard from './StatusTableCard';
import GenericDragDropListing from 'Components/shared/drag_and_drop/GenericDragDropListing';
import LoadingIndicator from 'Components/shared/LoadingIndicator';
import UserSelect from 'Components/shared/users/elements/UserSelect';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import { updateCard } from 'Src/newRedux/database/cards/thunks';

class StatusTableGridRow extends Component {
  static propTypes = {
    cards: PropTypes.array,
    className: PropTypes.string,
    columns: PropTypes.array,
    isCollapsible: PropTypes.bool,
    showCardsList: PropTypes.bool,
    showUserSelector: PropTypes.bool,
    title: PropTypes.string,
    topicId: PropTypes.any,
    users: PropTypes.array,
    updateCard: PropTypes.func,
    dmLoading: PropTypes.bool
  };

  state = {
    rowIsOpen: true
  };

  handleChangeUser = userId => {
    this.props.onChangeUserForRow(this.props.user, userId);
  };

  handleDropCard = ({
    droppedItemProps: { item },
    dropZoneProps: { userId }
  }) => {
    this.props.updateCard({
      id: item.id,
      relationships: { tip_assignments: { data: [userId] } }
    });
  };

  handleToggleRowOpen = open => {
    this.setState({ rowIsOpen: open });
  };

  checkStatusTableCard = (card, col) => {
    let { rowIsOpen } = this.state;
    const { completed_percentage } = card.attributes;
    const today = moment()
      .subtract(0, 'days')
      .utc()
      .format('YYYY-MM-DD');

    switch (col.name) {
      case 'Unstarted':
        return (
          rowIsOpen &&
          (!card.attributes.start_date ||
            moment(card.attributes.start_date).isSameOrBefore(col.range[1])) &&
          (!card.attributes.due_date ||
            moment(card.attributes.due_date).isAfter(today)) &&
          completed_percentage === 0
        );
      case 'In Progress':
        return (
          rowIsOpen &&
          (!card.attributes.start_date ||
            moment(card.attributes.start_date).isSameOrBefore(col.range[1])) &&
          (!card.attributes.due_date ||
            moment(card.attributes.due_date).isAfter(today)) &&
          completed_percentage < 100 &&
          completed_percentage > 0
        );
      case 'Completed':
        return (
          rowIsOpen &&
          moment(card.attributes.completion_date).isSameOrBefore(
            col.range[1]
          ) &&
          moment(card.attributes.completion_date).isSameOrAfter(col.range[0]) &&
          completed_percentage === 100
        );
      case 'Overdue':
        return (
          rowIsOpen &&
          moment(card.attributes.due_date).isSameOrBefore(col.range[1]) &&
          moment(card.attributes.due_date).isBefore(today) &&
          completed_percentage !== 100
        );
      default:
        return rowIsOpen;
    }
  };

  render() {
    const {
      cards,
      columns,
      isCollapsible,
      showCardsList,
      showUserSelector,
      title = 'Select User',
      topicId,
      user,
      dmLoading
    } = this.props;

    const { rowIsOpen } = this.state;

    const gridRowClassNames = classNames(
      this.props.className,
      'planning-grid__row',
      { 'planning-grid__row--collapsed': !rowIsOpen }
    );

    return (
      <div className={gridRowClassNames}>
        <div className="planning-grid__cell planning-grid__cell--user">
          <div className="planning-grid__cell--user-avatar-container">
            {showUserSelector && (
              <UserSelect
                className="planning-grid__user-select"
                showAvatar
                selectedUser={user}
                onSelectUser={this.handleChangeUser}
              />
            )}
          </div>

          {rowIsOpen && (
            <span className="planning-grid__user-name">
              {user ? user.attributes.name : title}
            </span>
          )}
          {isCollapsible && (
            <button
              className="planning-grid__user-hide"
              onClick={() => this.handleToggleRowOpen(!rowIsOpen)}
            >
              {rowIsOpen ? '-' : '+'}
            </button>
          )}
        </div>
        {columns.map(col => (
          <div key={col.id} className="planning-grid__cell">
            {showCardsList && (
              <GenericDragDropListing
                dragClassName=""
                dropClassName="planning-grid__drop-zone"
                dropZoneProps={{
                  userId: user && user.id
                }}
                draggedItemProps={{}}
                itemContainerClassName=""
                itemList={cards}
                itemType={dragItemTypes.CARD}
                onDropItem={this.handleDropCard}
                renderItem={card =>
                  this.checkStatusTableCard(card, col) && (
                    <StatusTableCard
                      card={card}
                      className="planning-grid__card"
                      topicId={topicId}
                    />
                  )
                }
              >
                {dmLoading && <LoadingIndicator />}
              </GenericDragDropListing>
            )}
          </div>
        ))}
      </div>
    );
  }
}

const mapDispatch = {
  updateCard
};

export default connect(
  null,
  mapDispatch
)(StatusTableGridRow);
