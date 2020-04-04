import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import AddCardCard from 'Components/shared/cards/AddCardCard';
import PlanningCard from './PlanningCard';
import GenericDragDropListing from 'Components/shared/drag_and_drop/GenericDragDropListing';
import LoadingIndicator from 'Components/shared/LoadingIndicator';
import UserSelect from 'Components/shared/users/elements/UserSelect';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import { updateCard } from 'Src/newRedux/database/cards/thunks';

class PlanningGridRow extends Component {
  static propTypes = {
    cardRequirements: PropTypes.any,
    cards: PropTypes.array,
    className: PropTypes.string,
    columnMode: PropTypes.string,
    columns: PropTypes.array,
    isCollapsible: PropTypes.bool,
    showCardsList: PropTypes.bool,
    showUserSelector: PropTypes.bool,
    timeframeDate: PropTypes.object,
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
    dropZoneProps: { dueDate, startDate, userId }
  }) => {
    this.props.updateCard({
      id: item.id,
      attributes: {
        due_date: dueDate,
        start_date: startDate
      },
      relationships: { tip_assignments: { data: [userId] } }
    });
  };

  handleToggleRowOpen = open => {
    this.setState({ rowIsOpen: open });
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
                  dueDate: col.range[1],
                  startDate: col.range[0],
                  userId: user && user.id
                }}
                draggedItemProps={{}}
                itemContainerClassName=""
                itemList={cards}
                itemType={dragItemTypes.CARD}
                onDropItem={this.handleDropCard}
                renderItem={card =>
                  rowIsOpen &&
                  moment(card.attributes.due_date).isSameOrBefore(
                    col.range[1]
                  ) &&
                  moment(card.attributes.due_date).isSameOrAfter(
                    col.range[0]
                  ) && (
                    <PlanningCard
                      card={card}
                      className="planning-grid__card"
                      topicId={topicId}
                    />
                  )
                }
              >
                {dmLoading && <LoadingIndicator />}
                <AddCardCard
                  cardClassName="planning-grid__add-card"
                  newCardAttributes={{
                    due_date: col.range[1],
                    start_date: col.range[0]
                  }}
                  newCardRelationships={{
                    tip_assignments: { data: [user && user.id] }
                  }}
                  topicId={topicId}
                />
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
)(PlanningGridRow);
