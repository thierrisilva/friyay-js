import React, { Fragment, Component } from 'react';
import { array, bool, func, object } from 'prop-types';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import IconButton from 'Components/shared/buttons/IconButton';
import GenericDropZone from 'Components/shared/drag_and_drop/GenericDropZone';
import GenericDragDropListing from 'Components/shared/drag_and_drop/GenericDragDropListing';
import KanbanCard from './KanbanCard';
import KanbanLaneOptionsMenu from './KanbanLaneOptionsMenu';
import LabelIndicatorBar from 'Components/shared/labels/elements/LabelIndicatorBar';
import LabelSelect from 'Components/shared/labels/elements/LabelSelect';
import DMLoader from 'Src/dataManager/components/DMLoader';
import AddCardCard from 'Components/shared/cards/AddCardCard';
import { scrollToShow } from 'Src/lib/utilities';
import cx from 'classnames';

class KanbanLane extends Component {
  static propTypes = {
    cards: array.isRequired,
    label: object,
    onChangeLabelForLane: func.isRequired,
    onDropCard: func
  };

  constructor(props) {
    super(props);
    this.state = {
      laneIsOpen:
        props.cards.length > 0 ||
        (props.label && props.label.id == props.newLane)
    };
  }

  componentDidUpdate(prevProps) {
    if (
      (prevProps.cards.length == 0 && this.props.cards.length > 0) ||
      (this.props.label && this.props.label.id == this.props.newLane)
    ) {
      if (this.state.laneIsOpen !== true) {
        this.setState({ laneIsOpen: true });
      }
    }
  }

  afterCardCreated = cardId => {
    if (this.props.cardsSplitScreen) {
      this.props.updateSelectedCard(cardId);
    }
    const elem = document.querySelector('.card-title.c' + cardId);
    scrollToShow(elem, 14, 24);
  };

  render() {
    const {
      cardRequirements,
      cards,
      label,
      onChangeLabelForLane,
      onDropCard,
      onRemoveLane,
      topicId
    } = this.props;
    const { laneIsOpen } = this.state;
    const labelId = label ? label.id : null;

    return (
      <div className={cx('kanban-lane', { 'is-open': laneIsOpen })}>
        <div className={cx({ flex: laneIsOpen })}>
          {label ? (
            <Fragment>
              <LabelIndicatorBar
                additionalClassNames="kanban-lane-label-indicator"
                labels={[label]}
              />
              <GenericDropZone
                dropClassName="kanban-lane_open-close-button"
                dropsDisabled
                itemType={dragItemTypes.CARD}
                onDragEnter={() => this.setState({ laneIsOpen: true })}
              >
                <IconButton
                  fontAwesome
                  icon={`${laneIsOpen ? 'minus-circle' : 'plus-circle'}`}
                  onClick={() => this.setState({ laneIsOpen: !laneIsOpen })}
                />
              </GenericDropZone>
            </Fragment>
          ) : (
            <div className="kanban-lane_open-close-button">
              <IconButton
                additionalClasses="kanban-lane_open-close-button"
                fontAwesome
                icon={`${laneIsOpen ? 'minus-circle' : 'plus-circle'}`}
                onClick={() => this.setState({ laneIsOpen: !laneIsOpen })}
              />
            </div>
          )}

          {laneIsOpen ? (
            <div className="kanban-lane_open-header">
              <LabelSelect
                canAddOrEdit
                onSelectLabel={newLabelId =>
                  onChangeLabelForLane(label, newLabelId)
                }
                selectedLabel={label}
              />
              <KanbanLaneOptionsMenu
                label={label}
                onRemoveLane={onRemoveLane}
              />
            </div>
          ) : (
            <div className="kanban-lane_closed-header">
              <div className="kanban-lane_closed-label">
                {label
                  ? `${label.attributes.name} (${cards.length})`
                  : 'Select Label'}
              </div>
            </div>
          )}
        </div>

        {laneIsOpen && label && (
          <GenericDragDropListing
            dropClassName="kanban-view_lane-catchment"
            dragClassName="task-view_drag-card"
            dropZoneProps={{ labelId: labelId, topicId: topicId }}
            draggedItemProps={{
              origin: { labelId: labelId, topicId: topicId }
            }}
            itemContainerClassName=""
            itemList={cards}
            itemType={dragItemTypes.CARD}
            onDropItem={onDropCard}
            renderItem={card => (
              <KanbanCard card={card} key={card.id} topicId={topicId} />
            )}
          >
            <AddCardCard
              cardClassName="kanban-card"
              newCardRelationships={{ labels: { data: [labelId] } }}
              topicId={topicId}
              afterCardCreated={this.afterCardCreated}
            />

            <DMLoader
              dataRequirements={{
                cardsWithAttributes: {
                  attributes: { ...cardRequirements, labelId, topicId }
                }
              }}
              loaderKey="cardsWithAttributes"
            />
          </GenericDragDropListing>
        )}
      </div>
    );
  }
}

export default KanbanLane;
