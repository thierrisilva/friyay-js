import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { array, func, object } from 'prop-types';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import { moveOrCopyCardInOrToTopicFromDragAndDrop } from 'Src/newRedux/database/cards/abstractions';
import { setEditCardModalOpen } from 'Src/newRedux/interface/modals/actions';
import DMLoader from 'Src/dataManager/components/DMLoader';
import AddCardCard from 'Components/shared/cards/AddCardCard';
import ActiveFiltersPanel from 'Components/shared/filters/ActiveFiltersPanel';
import DocumentCard from './DocumentCard';
import { AddCardButton } from 'Components/shared/buttons/index';
import GenericDragDropListing from 'Components/shared/drag_and_drop/GenericDragDropListing';
import { scrollToShow, yayDesign } from 'Src/lib/utilities';
import { stateMappings } from 'Src/newRedux/stateMappings';

class DocumentsView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inInputMode: false
    };
  }

  handleToggleInputMode = () => {
    this.setState(state => ({ inInputMode: !state.inInputMode }));
  };

  afterCardCreated = cardId => {
    if (this.props.cardsSplitScreen) {
      this.props.updateSelectedCard(cardId);
    }
    const elem = document.querySelector('.card-title.c' + cardId);
    scrollToShow(elem, 14, 24);
  };

  render() {
    const {
      cards,
      cardRequirements,
      moveOrCopyCardInOrToTopicFromDragAndDrop,
      setEditCardModalOpen,
      subtopics,
      topic,
      active_design
    } = this.props;
    const { card_font_color } = active_design || {};
    return (
      <div className="document-view">
        <ActiveFiltersPanel />
        <div className="document-view_items-container">
          <GenericDragDropListing
            dragClassName="task-view_drag-card"
            dropClassName="document-list"
            dropZoneProps={{ topicId: topic ? topic.id : null }}
            draggedItemProps={{ origin: { topicId: topic ? topic.id : null } }}
            itemList={cards}
            itemType={dragItemTypes.CARD}
            onDropItem={moveOrCopyCardInOrToTopicFromDragAndDrop}
            renderItem={card => (
              <DocumentCard
                color={card_font_color}
                card={card}
                key={card.id}
                onAddDocument={setEditCardModalOpen}
                topicId={topic ? topic.id : null}
              />
            )}
          >
            <div className="add-card_container">
              <AddCardCard
                cardClassName="document-card"
                topic={topic}
                view="document-new"
                inInputMode={this.state.inInputMode}
                afterCardCreated={this.afterCardCreated}
              />
              <AddCardButton
                className="add-file-upload-btn"
                openFileUploader
                topic={topic}
                buttonText={'+ Upload File'}
              />
            </div>
            <DMLoader
              dataRequirements={{
                cardsWithAttributes: { attributes: cardRequirements }
              }}
              loaderKey="cardsWithAttributes"
            />
          </GenericDragDropListing>
        </div>
      </div>
    );
  }
}

DocumentsView.propTypes = {
  cards: array.isRequired,
  setEditCardModalOpen: func.isRequired,
  topic: object,
  active_design: object
};

const mapState = state => {
  const sm = stateMappings(state);

  const {
    page: { topicId },
    topics
  } = sm;
  const topic = topicId && topics[topicId];
  const active_design = yayDesign(topicId, topic);

  return {
    active_design
  };
};

const mapDispatch = {
  moveOrCopyCardInOrToTopicFromDragAndDrop,
  setEditCardModalOpen
};

export default connect(
  mapState,
  mapDispatch
)(DocumentsView);
