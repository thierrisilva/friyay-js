import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import Ability from 'Lib/ability';
import { addRemoveCardFromTopics } from 'Src/newRedux/database/cards/thunks';
import {
  dragItemTypes,
  GenericDropZone
} from 'Components/shared/drag_and_drop/_index';

import TopicActionsDropdown from 'Components/shared/topics/elements/TopicActionsDropdown';
import TopicTitleLink from 'Components/shared/topics/elements/TopicTitleLink';
import TopicTitleEditor from 'Components/shared/topics/elements/TopicTitleEditor';
import { viewTopic, createTopic } from 'Src/newRedux/database/topics/thunks';

class TopicListCard extends Component {
  state = {
    draggedOver: false,
    editTitle: false,
    timeoutID: null,
    showInput: false,
    title: ''
  };

  handleToggleEditMode = () => {
    this.setState(state => ({ editTitle: !state.editTitle }));
  };

  handleDrop = ({ draggedItemProps }) => {
    const { addRemoveCardFromTopics, ctrlKeyDown, topic } = this.props;
    const originTopicId = ctrlKeyDown ? null : draggedItemProps.origin.topicId;
    addRemoveCardFromTopics(draggedItemProps.item, [topic.id], [originTopicId]);
  };

  handleTimeoutIDChange = timeoutID => {
    this.setState({ timeoutID });
  };

  getClickHandler = () => {
    const { timeoutID } = this.state;
    const { viewTopic, topic } = this.props;
    const delay = 250;
    if (!timeoutID) {
      this.handleTimeoutIDChange(
        window.setTimeout(() => {
          viewTopic({ topicSlug: topic.attributes.slug });
          this.handleTimeoutIDChange(null);
        }, delay)
      );
    } else {
      this.handleTimeoutIDChange(window.clearTimeout(timeoutID));
      this.handleToggleEditMode();
    }
  };

  addNewTopic = () => {
    this.setState({ showInput: true });
  };

  handleTitleChange = ({ target }) => {
    this.setState({ title: target.value });
  };

  handleKeyPress = async e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTopic = {
        attributes: {
          title: this.state.title,
          parent_id: (this.props.topic || {}).id
        }
      };
      await this.props.createTopic(newTopic);
      this.setState({ showInput: false, title: '' });
    } else if (e.key == 'Escape' || e.keyCode == 27) {
      this.setState({ showInput: false, title: '' });
    }
  };

  render() {
    const { topic } = this.props;
    const { editTitle, showInput, title } = this.state;

    return (
      <Fragment>
        <GenericDropZone
          dropClassName="topic-list-card"
          itemType={dragItemTypes.CARD}
          onDrop={this.handleDrop}
        >
          {editTitle ? (
            <TopicTitleEditor
              topic={topic}
              onFinishEditing={this.handleToggleEditMode}
            />
          ) : (
            <TopicTitleLink topic={topic} onClick={this.getClickHandler} />
          )}
          <div>
            {Ability.can('update', 'self', topic) && (
              <TopicActionsDropdown
                topic={topic}
                onRenameTopicSelected={() => this.handleToggleEditMode}
                addNewTopic={this.addNewTopic}
              />
            )}
          </div>
        </GenericDropZone>
        {showInput && (
          <input
            type="text"
            onChange={this.handleTitleChange}
            placeholder="Title"
            onKeyPress={this.handleKeyPress}
            value={title}
            className="add-subtopic-input topic-list-card"
            autoFocus
          />
        )}
      </Fragment>
    );
  }
}

const mapDispatch = {
  addRemoveCardFromTopics,
  viewTopic,
  createTopic
};

export default connect(
  undefined,
  mapDispatch
)(TopicListCard);
