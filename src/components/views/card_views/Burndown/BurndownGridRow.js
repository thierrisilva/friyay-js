import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import AddCardCard from 'Components/shared/cards/AddCardCard';
import BurndownCard from './BurndownCard';
import GenericDragDropListing from 'Components/shared/drag_and_drop/GenericDragDropListing';
import LoadingIndicator from 'Components/shared/LoadingIndicator';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import { updateCard } from 'Src/newRedux/database/cards/thunks';

class BurndownGridRow extends Component {
  static propTypes = {
    cards: PropTypes.array,
    className: PropTypes.string,
    columns: PropTypes.array,
    showCardsList: PropTypes.bool,
    topicId: PropTypes.any,
    updateCard: PropTypes.func,
    dmLoading: PropTypes.bool
  };

  handleDropCard = ({
    droppedItemProps: { item },
    dropZoneProps: { dueDate, startDate }
  }) => {
    this.props.updateCard({
      id: item.id,
      attributes: {
        due_date: dueDate,
        start_date: startDate
      }
    });
  };

  render() {
    const { cards, columns, showCardsList, topicId, dmLoading } = this.props;

    const gridRowClassNames = classNames(
      this.props.className,
      'planning-grid__row'
    );

    return (
      <div className={gridRowClassNames}>
        {columns.map(col => (
          <div key={col.id} className="planning-grid__cell">
            {showCardsList && (
              <GenericDragDropListing
                dragClassName=""
                dropClassName="burndown-grid__drop-zone"
                dropZoneProps={{
                  dueDate: col.range[1],
                  startDate: col.range[0]
                }}
                draggedItemProps={{}}
                itemContainerClassName=""
                itemList={cards}
                itemType={dragItemTypes.CARD}
                onDropItem={this.handleDropCard}
                renderItem={card =>
                  (!card.attributes.start_date ||
                    moment(card.attributes.start_date).isSameOrBefore(
                      col.range[1]
                    )) &&
                  ((card.attributes.completed_percentage === 100 &&
                    moment(card.attributes.completion_date).isAfter(
                      col.range[1]
                    )) ||
                    card.attributes.completed_percentage !== 100) && (
                    <BurndownCard
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
                  containerClassName="burndown-grid__add-card"
                  newCardAttributes={{
                    due_date: col.range[1],
                    start_date: col.range[0]
                  }}
                  newCardRelationships={{
                    tip_assignments: { data: [] }
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
)(BurndownGridRow);
