import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import SheetAddCard from './SheetAddCard';
import SheetAddSubtopic from './SheetAddSubtopic';
import SheetCard from './SheetCard';
import SheetCardPreview from './SheetCardPreview';
import SheetTopicHeader from './SheetTopicHeader';
import { sheetConfig } from './sheetConfig/index';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import GenericDragDropListing from 'Components/shared/drag_and_drop/GenericDragDropListing';
import DMLoader from 'Src/dataManager/components/DMLoader';
import { moveOrCopyCardInOrToTopicFromDragAndDrop } from 'Src/newRedux/database/cards/abstractions';
import { moveOrCopyTopicInOrToTopicFromDragAndDrop } from 'Src/newRedux/database/topics/abstractions';
import { getSortedFilteredCardsByTopic } from 'Src/newRedux/database/cards/selectors';
import { getSortedTopicsByParentTopic } from 'Src/newRedux/database/topics/selectors';
import { stateMappings } from 'Src/newRedux/stateMappings';
import GenericDragContainer from 'Components/shared/drag_and_drop/GenericDragContainer';

class SheetTopicSection extends Component {
  static propTypes = {
    className: PropTypes.string,
    // parent
    addCardOrSubtopic: PropTypes.any.isRequired,
    cardRequirements: PropTypes.any.isRequired,
    columns: PropTypes.array.isRequired,
    configureColumns: PropTypes.bool.isRequired,
    expandedTopics: PropTypes.object.isRequired,
    level: PropTypes.number.isRequired,
    showAddCard: PropTypes.bool.isRequired,
    showAddSubtopic: PropTypes.bool.isRequired,
    sortColumn: PropTypes.string,
    sortOrder: PropTypes.string,
    topicId: PropTypes.string.isRequired,
    onAddCardOrSubtopic: PropTypes.func.isRequired,
    onAddCardOrSubtopicSubmit: PropTypes.func.isRequired,
    onTopicExpand: PropTypes.func.isRequired,
    // store
    cards: PropTypes.array.isRequired,
    subtopics: PropTypes.array.isRequired,
    topic: PropTypes.object,
    moveCard: PropTypes.func.isRequired,
    color: PropTypes.string
  };

  getPreview = item => {
    return (
      <SheetTopicHeader
        cards={this.props.cards}
        columns={this.props.columns}
        isExpanded={true}
        level={this.props.level}
        topic={this.props.topic}
        className="sheet-view-card-preview"
        configureColumns={this.props.configureColumns}
        onAddCardOrSubtopic={() => {}}
        onTopicExpand={() => {}}
      />
    );
  };

  moveTopic = ({ droppedItemProps, dropZoneProps, itemOrder }) => {
    if (!droppedItemProps.origin) {
      droppedItemProps.origin = { topicId: this.props.topicId };
    } // draggeditemprops are not being retained. Fixed this by changing ...monitor.getItem() to
    // ...monitor.getItem(), ...props.draggedItemProps.  That causes errors in nested zones as
    // in assigned view (lane zone, reorder zone).  So copying the props manually for now.
    this.props.moveOrCopyTopicInOrToTopicFromDragAndDrop({
      droppedItemProps,
      dropZoneProps,
      itemOrder
    });
  };

  render() {
    const isTopmostSection = this.props.level === 0;
    const isExpanded = this.props.expandedTopics[this.props.topicId];
    const cards = this.props.sortColumn
      ? sheetConfig[this.props.sortColumn].sort(
          this.props.cards,
          this.props.sortOrder
        )
      : this.props.cards;
    const { color } = this.props;
    return (
      <GenericDragContainer
        draggedItemProps={{ type: 'topic' }}
        item={this.props.topic}
        itemType={dragItemTypes.TOPIC}
        onDropElsewhere={() => {}}
        dragPreview={this.getPreview()}
      >
        <div
          className={`sheet-view__topic-section ${this.props.className || ''}`}
        >
          {this.props.topic && !isTopmostSection && (
            <SheetTopicHeader
              color={color}
              cards={this.props.cards}
              columns={this.props.columns}
              configureColumns={this.props.configureColumns}
              isExpanded={isExpanded}
              level={this.props.level}
              topic={this.props.topic}
              onAddCardOrSubtopic={this.props.onAddCardOrSubtopic}
              onTopicExpand={this.props.onTopicExpand}
            />
          )}
          {this.props.topic &&
            this.props.showAddCard &&
            (isExpanded || isTopmostSection) && (
              <SheetAddCard
                columns={this.props.columns}
                configureColumns={this.props.configureColumns}
                level={this.props.level + 1}
                onAddCard={this.props.onAddCardOrSubtopicSubmit}
                onCancel={() => this.props.onAddCardOrSubtopic(null, null)}
              />
            )}
          {this.props.topic && (isExpanded || isTopmostSection) && (
            <GenericDragDropListing
              dragClassName=""
              draggedItemProps={{ origin: { topicId: this.props.topicId } }}
              dragPreview={card => <SheetCardPreview card={card} />}
              dropClassName=""
              dropZoneProps={{ topicId: this.props.topicId }}
              itemContainerClassName=""
              itemList={cards}
              itemType={dragItemTypes.CARD}
              onDropItem={this.props.moveCard}
              renderItem={card => (
                <SheetCard
                  color={color}
                  card={card}
                  columns={this.props.columns}
                  configureColumns={this.props.configureColumns}
                  key={card.id}
                  level={this.props.level + 1}
                  topicId={this.props.topicId}
                />
              )}
            >
              <DMLoader
                dataRequirements={{
                  cardsWithAttributes: {
                    attributes: {
                      ...this.props.cardRequirements,
                      topicId: this.props.topicId
                    }
                  },
                  subtopicsForTopic: { topicId: this.props.topicId }
                }}
                loaderKey="cardsWithAttributes"
              />
              {!cards.length && (
                <div
                  className="sheet-view__card-placeholder"
                  style={{ paddingLeft: `${(this.props.level + 1) * 20}px` }}
                >
                  No cards
                </div>
              )}
            </GenericDragDropListing>
          )}
          {this.props.showAddSubtopic && (isExpanded || isTopmostSection) && (
            <SheetAddSubtopic
              columns={this.props.columns}
              configureColumns={this.props.configureColumns}
              level={this.props.level + 1}
              onAddSubtopic={this.props.onAddCardOrSubtopicSubmit}
              onCancel={() => this.props.onAddCardOrSubtopic(null, null)}
            />
          )}
          {(isExpanded || isTopmostSection) && (
            <GenericDragDropListing
              dragClassName=""
              draggedItemProps={{ origin: { topicId: this.props.topicId } }}
              dragPreview={topic => (
                <SheetTopicHeader color={color} topic={topic} />
              )}
              dropClassName=""
              dropZoneProps={{ topicId: this.props.topicId }}
              itemContainerClassName=""
              itemList={this.props.subtopics}
              itemType={dragItemTypes.TOPIC}
              onDropItem={this.moveTopic}
              renderItem={subtopic => (
                <ConnectedSheetTopicSection
                  color={color}
                  className="sheet-view-subtopic-header"
                  key={subtopic.id}
                  addCardOrSubtopic={this.props.addCardOrSubtopic}
                  cardRequirements={this.props.cardRequirements}
                  columns={this.props.columns}
                  configureColumns={this.props.configureColumns}
                  expandedTopics={this.props.expandedTopics}
                  level={this.props.level + 1}
                  showAddCard={
                    this.props.addCardOrSubtopic.topicId === subtopic.id &&
                    this.props.addCardOrSubtopic.mode === 'card'
                  }
                  showAddSubtopic={
                    this.props.addCardOrSubtopic.topicId === subtopic.id &&
                    this.props.addCardOrSubtopic.mode === 'topic'
                  }
                  sortColumn={this.props.sortColumn}
                  sortOrder={this.props.sortOrder}
                  topicId={subtopic.id}
                  onAddCardOrSubtopic={this.props.onAddCardOrSubtopic}
                  onAddCardOrSubtopicSubmit={
                    this.props.onAddCardOrSubtopicSubmit
                  }
                  onTopicExpand={this.props.onTopicExpand}
                />
              )}
            />
          )}
        </div>
      </GenericDragContainer>
    );
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  const topic = sm.topics[props.topicId];

  return {
    cards: props.cards
      ? props.cards
      : getSortedFilteredCardsByTopic(state)[props.topicId] || [],
    subtopics: getSortedTopicsByParentTopic(state)[props.topicId] || [],
    topic: topic
  };
};

const mapDispatch = {
  moveCard: moveOrCopyCardInOrToTopicFromDragAndDrop,
  moveOrCopyTopicInOrToTopicFromDragAndDrop: moveOrCopyTopicInOrToTopicFromDragAndDrop
};

const ConnectedSheetTopicSection = connect(
  mapState,
  mapDispatch
)(SheetTopicSection);

export default ConnectedSheetTopicSection;
