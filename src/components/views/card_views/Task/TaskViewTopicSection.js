import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { getSortedFilteredCardsByTopic } from 'Src/newRedux/database/cards/selectors';
import { getSortedTopicsByParentTopic } from 'Src/newRedux/database/topics/selectors';
import { updateTopic, viewTopic } from 'Src/newRedux/database/topics/thunks';
import ListCard from '../List/ListCard';
import FormInput from 'Components/shared/forms/FormInput';

import GenericDropZone from 'Components/shared/drag_and_drop/GenericDropZone';
import GenericDragDropListing from 'Components/shared/drag_and_drop/GenericDragDropListing';
import DMLoader from 'Src/dataManager/components/DMLoader';
import AddCardOrSubtopic from 'Components/shared/assemblies/AddCardOrSubtopic';
import TopicActionsDropdown from 'Components/shared/topics/elements/TopicActionsDropdown';
import TopicTitleEditor from 'Src/components/shared/topics/elements/TopicTitleEditor';
import TopicTitleLink from 'Src/components/shared/topics/elements/TopicTitleLink';
import AddCardCard from 'Components/shared/cards/AddCardCard';
import AddSubtopicCard from 'Components/shared/topics/AddSubtopicCard';

class TaskViewTopicSection extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inEditMode: false,
      sectionIsOpen: !props.displayHeader,
      topicTitle: props.topic.attributes.title,
      inCardInputMode: false,
      inSubtopicInputMode: false
    };
  }

  handleSaveTopicWithNewTitle = async () => {
    const {
      state: { topicTitle },
      props: { topicId, updateTopic }
    } = this;
    const attributes = { title: topicTitle };
    updateTopic({ id: topicId, attributes });
    this.setState({ cardTitle: '', isSaving: false });
    this.handleToggleTopicNameEditMode();
  };

  handleToggleTopicNameEditMode = () => {
    this.setState(state => ({
      inEditMode: !state.inEditMode,
      topicTitle: this.props.topic.attributes.title
    }));
  };

  handleSetTopicTitle = topicTitle => {
    this.setState({ topicTitle });
  };

  handleToggleSectionOpen = open => {
    this.setState(state => ({ sectionIsOpen: open }));
  };

  handleTopicTitleClick = () => {
    const { topic, viewTopic } = this.props;
    viewTopic({ topicSlug: topic.attributes.slug });
  };

  handleAddCardOrSubtopic = (id, type) => {
    type === 'card'
      ? this.setState(state => ({
          inCardInputMode: !state.inCardInputMode,
          inSubtopicInputMode: false,
          sectionIsOpen: !state.inCardInputMode
        }))
      : this.setState(state => ({
          inSubtopicInputMode: !state.inSubtopicInputMode,
          inCardInputMode: false,
          sectionIsOpen: !state.inSubtopicInputMode
        }));
  };

  render() {
    const {
      cards = [],
      cardRequirements,
      displayHeader,
      dmLoading,
      onDropCard,
      renderSubtopicSection,
      subtopics,
      topic,
      topicId
    } = this.props;
    const { inEditMode, sectionIsOpen, topicTitle } = this.state;

    return (
      <div>
        {displayHeader && (
          <div className="task-view-subtopic-header">
            <span className="task-view-subtopic-title">
              {inEditMode ? (
                <TopicTitleEditor
                  topic={topic}
                  onFinishEditing={this.handleToggleTopicNameEditMode}
                />
              ) : (
                <Fragment>
                  <GenericDropZone
                    dropsDisabled={true}
                    itemType={dragItemTypes.CARD}
                    onDragEnter={() => this.handleToggleSectionOpen(true)}
                  >
                    <i
                      className={`fa ${
                        sectionIsOpen ? 'fa-caret-down' : 'fa-caret-right'
                      }`}
                      onClick={() =>
                        this.handleToggleSectionOpen(!sectionIsOpen)
                      }
                    />
                  </GenericDropZone>
                  <TopicTitleLink
                    additionalClasses={`task-view_topic-title-link t${
                      topic.id
                    }`}
                    topic={topic}
                  />
                  <AddCardOrSubtopic
                    displayAddCardButton
                    displayAddSubtopicButton
                    addBothText=" "
                    topic={topic}
                    handleAddCardOrSubtopic={this.handleAddCardOrSubtopic}
                  />
                  <TopicActionsDropdown
                    topic={topic}
                    onRenameTopicSelected={this.handleToggleTopicNameEditMode}
                  />
                </Fragment>
              )}
            </span>
            <span className="task-view-subtopic-card-count">
              {topic.attributes.tip_count} Cards
            </span>
          </div>
        )}
        {(sectionIsOpen || !displayHeader) && (
          <div className={`task-view_section-container`}>
            <GenericDragDropListing
              itemContainerClassName=""
              itemList={cards}
              dropClassName={`task-view-card-list ${
                displayHeader ? 'subtopic' : ''
              } `}
              dragClassName="task-view_drag-card"
              dropZoneProps={{ topicId: topicId }}
              draggedItemProps={{ origin: { topicId: topicId } }}
              itemType={dragItemTypes.CARD}
              onDropItem={onDropCard}
              renderItem={card => <ListCard card={card} topicId={topicId} />}
            >
              <DMLoader
                dataRequirements={{
                  cardsWithAttributes: {
                    attributes: { ...cardRequirements, topicId }
                  },
                  subtopicsForTopic: { topicId }
                }}
                loaderKey="cardsWithAttributes"
              />
              {renderSubtopicSection && (
                <AddCardCard
                  inInputMode={this.state.inCardInputMode}
                  topicId={topicId}
                  onDismiss={this.handleNewCardInputButtonClick}
                  addCardUI=" "
                />
              )}
              {renderSubtopicSection && (
                <AddSubtopicCard
                  inInputMode={this.state.inSubtopicInputMode}
                  parentTopicId={topic ? topic.id : null}
                />
              )}
            </GenericDragDropListing>

            <div className="task-view_child-container">
              {renderSubtopicSection &&
                subtopics.map(subtopic => renderSubtopicSection(subtopic))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  const topic = sm.topics[props.topicId];
  return {
    cards:
      getSortedFilteredCardsByTopic(state)[props.topicId] || props.cards || [],
    subtopics: getSortedTopicsByParentTopic(state)[props.topicId] || [],
    topic: topic
  };
};

const mapDispatch = {
  updateTopic,
  viewTopic
};

export default connect(
  mapState,
  mapDispatch
)(TaskViewTopicSection);
