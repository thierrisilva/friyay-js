import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AddCardCard from 'Components/shared/cards/AddCardCard';
import AddSubtopicCard from 'Components/shared/topics/AddSubtopicCard';
import DMLoader from 'Src/dataManager/components/DMLoader';
import IconButton from 'Components/shared/buttons/IconButton';
import Icon from 'Components/shared/Icon';
import OptionsDropdownButton from 'Components/shared/buttons/OptionsDropdownButton';
import TopicTitleEditor from 'Src/components/shared/topics/elements/TopicTitleEditor';
import TopicActionsDropdown from 'Src/components/shared/topics/elements/TopicActionsDropdown';
import WikiCard from './WikiCard';

import {
  dragItemTypes,
  GenericDragDropListing,
  GenericDropZone
} from 'Components/shared/drag_and_drop/_index';
import { getSortedTopicsByParentTopic } from 'Src/newRedux/database/topics/selectors';
import { getSortedFilteredCardsByTopic } from 'Src/newRedux/database/cards/selectors';
import { moveOrCopyCardInOrToTopicFromDragAndDrop } from 'Src/newRedux/database/cards/abstractions';
import { moveOrCopyTopicInOrToTopicFromDragAndDrop } from 'Src/newRedux/database/topics/abstractions';
import { viewTopic } from 'Src/newRedux/database/topics/thunks';
import { nonNestedCardFilter } from 'Lib/config/filters/other';

const WikiTopicDragPreview = ({ topic }) => (
  <div className="wiki-view_topic_drag-preview">
    <div className="wikilist-topic-segment_topic-title">
      {topic.attributes.title}
    </div>
  </div>
);

class WikiViewTopicSegment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayAddCard: false,
      displayAddSubtopic: false,
      sectionIsOpen: props.hideHeader,
      topicNameEditMode: false,
      topicTitle: '',
      timeoutID: null
    };

    this.viewTopic = props.viewTopic;
  }

  handleAddCard = () => {
    this.setState({ displayAddCard: true, sectionIsOpen: true });
  };

  handleAddSubtopic = () => {
    this.setState({ displayAddSubtopic: true, sectionIsOpen: true });
  };

  handleToggleTopicNameEditMode = () => {
    this.setState(state => ({
      topicNameEditMode: !state.topicNameEditMode,
      topicTitle: this.props.topic.attributes.title
    }));
  };

  handleToggleSectionOpen = open => {
    this.setState(state => ({ sectionIsOpen: open }));
  };

  handleTimeoutIDChange = timeoutID => {
    this.setState({ timeoutID });
  };

  topicClickHandler = () => {
    const { timeoutID } = this.state;
    const delay = 250;
    if (!timeoutID) {
      this.handleTimeoutIDChange(
        window.setTimeout(() => {
          this.viewTopic({ topicSlug: this.props.topic.attributes.slug });
          this.handleTimeoutIDChange(null);
        }, delay)
      );
    } else {
      this.handleTimeoutIDChange(window.clearTimeout(timeoutID));
      this.handleToggleTopicNameEditMode();
    }
  };

  renderWikiCard = (card, dragLeaveHandlers = []) => {
    const { onSelectCard, selectedCardId, topic, color } = this.props;
    return (
      <WikiCard
        card={card}
        dragLeaveHandlersForParentLists={dragLeaveHandlers}
        isSelected={card.id == selectedCardId}
        key={card.id}
        onSelectCard={this.props.onSelectCard}
        renderCard={(card, parentDragLeaveHandlers) =>
          this.renderWikiCard(card, parentDragLeaveHandlers)
        }
        color={color}
        topicId={topic ? topic.id : null}
      />
    );
  };

  render() {
    const {
      cards,
      children,
      dragLeaveHandlersForParentLists,
      hideHeader,
      moveOrCopyCardInOrToTopicFromDragAndDrop,
      moveOrCopyTopicInOrToTopicFromDragAndDrop,
      onSelectCard,
      renderSubtopicSection,
      subtopics,
      topic,
      viewTopic,
      isRoot,
      color
    } = this.props;
    const {
      displayAddCard,
      displayAddSubtopic,
      sectionIsOpen,
      topicNameEditMode,
      topicTitle
    } = this.state;
    const topicId = topic ? topic.id : null;

    const nonNestedCards = cards.filter(nonNestedCardFilter);

    return (
      <div className="wikilist-topic-segment">
        {!hideHeader && (
          <div className="wikilist-topic-segment_title-container">
            <GenericDropZone
              dropsDisabled={true}
              itemType={[dragItemTypes.CARD, dragItemTypes.TOPIC]}
              onDragEnter={() => this.handleToggleSectionOpen(true)}
            >
              <IconButton
                fontAwesome
                color={color}
                icon={`${sectionIsOpen ? 'caret-down' : 'caret-right'}`}
                onClick={() => this.handleToggleSectionOpen(!sectionIsOpen)}
              />
            </GenericDropZone>

            <div className="wikilist-topic-segment_topic-title">
              {topicNameEditMode ? (
                <TopicTitleEditor
                  topic={topic}
                  onFinishEditing={this.handleToggleTopicNameEditMode}
                />
              ) : (
                <Fragment>
                  <Icon
                    icon="square"
                    color={color}
                    additionalClasses="wikilist-topic-segment_topic-icon"
                    fontAwesome
                  />
                  <a
                    className="wikilist-topic-segment_title flex-1"
                    onClick={this.topicClickHandler}
                  >
                    {topic.attributes.title}
                  </a>
                  <div className="wikilist-topic-segment_buttons">
                    <OptionsDropdownButton color={color} icon="add">
                      <a
                        className="dropdown-option-item"
                        onClick={this.handleAddCard}
                      >
                        Add Card
                      </a>
                      <a
                        className="dropdown-option-item"
                        onClick={this.handleAddSubtopic}
                      >
                        Add yay
                      </a>
                    </OptionsDropdownButton>
                    <TopicActionsDropdown
                      color={color}
                      topic={topic}
                      onRenameTopicSelected={this.handleToggleTopicNameEditMode}
                    />
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        )}

        <div
          className={`wikilist-topic-segment_topic-content ${sectionIsOpen &&
            'is-presented'}`}
        >
          {sectionIsOpen && (
            <Fragment>
              {displayAddCard ? (
                <AddCardCard
                  topMenu={true}
                  afterCardCreated={cardId => onSelectCard(cardId)}
                  cardClassName="wiki-card"
                  inInputMode={true}
                  onDismiss={() => this.setState({ displayAddCard: false })}
                  topicId={topicId}
                />
              ) : (
                <a
                  style={{ color }}
                  className="dropdown-option-item"
                  onClick={this.handleAddCard}
                >
                  Add Card
                </a>
              )}
              {topic && (
                <GenericDragDropListing
                  dragClassName="task-view_drag-card"
                  draggedItemProps={{ origin: { topicId: topicId } }}
                  dropClassName="wiki-list_topic-dropzone"
                  dropZoneProps={{ topicId: topicId }}
                  itemList={nonNestedCards}
                  itemType={dragItemTypes.CARD}
                  onDropItem={moveOrCopyCardInOrToTopicFromDragAndDrop}
                  renderItem={this.renderWikiCard}
                >
                  <p>{isRoot}</p>
                  {cards.length == 0 &&
                    !displayAddCard &&
                    (isRoot ? subtopics.length === 0 : true) && (
                      <div className="wiki-list-no-items-label">No Cards</div>
                    )}
                </GenericDragDropListing>
              )}

              {displayAddSubtopic ? (
                <AddSubtopicCard
                  topicClassName="wiki-card"
                  inInputMode={true}
                  onDismiss={() => this.setState({ displayAddSubtopic: false })}
                  parentTopicId={topicId}
                />
              ) : (
                <a
                  style={{ color }}
                  className="dropdown-option-item"
                  onClick={this.handleAddSubtopic}
                >
                  Add yay
                </a>
              )}
              <GenericDragDropListing
                dragClassName="task-view_drag-card"
                draggedItemProps={{
                  origin: { topicId: topicId ? topicId : '0' }
                }}
                dragPreview={subtopic => (
                  <WikiTopicDragPreview topic={subtopic} />
                )}
                dropClassName="wiki-list_topic-dropzone"
                dropZoneProps={{ topicId: topicId ? topicId : '0' }}
                itemContainerClassName="wiki-view_card-container"
                itemList={subtopics}
                itemType={dragItemTypes.TOPIC_LEFT_MENU}
                onDropItem={moveOrCopyTopicInOrToTopicFromDragAndDrop}
                parentListDragLeaveHandlers={
                  this.props.dragLeaveHandlersForParentLists
                }
                renderItem={renderSubtopicSection}
              >
                {subtopics.length == 0 && !displayAddSubtopic && (
                  <div className="wiki-list-no-items-label">No yays</div>
                )}
              </GenericDragDropListing>

              {topic && (
                <DMLoader
                  dataRequirements={{
                    cardsWithAttributes: { attributes: { topicId: topicId } },
                    subtopicsForTopic: { topicId: topicId }
                  }}
                  loaderKey="cardsWithAttributes"
                />
              )}
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

const mapState = (state, props) => {
  const topicId = props.topic ? props.topic.id : '0';
  return {
    cards: topicId ? getSortedFilteredCardsByTopic(state)[topicId] || [] : [],
    subtopics: topicId ? getSortedTopicsByParentTopic(state)[topicId] || [] : []
  };
};

const mapDispatch = {
  moveOrCopyCardInOrToTopicFromDragAndDrop,
  moveOrCopyTopicInOrToTopicFromDragAndDrop,
  viewTopic
};

export default connect(
  mapState,
  mapDispatch
)(WikiViewTopicSegment);
