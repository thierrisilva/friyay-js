import React, { Component, Fragment } from 'react';
import { object, func, bool } from 'prop-types';
import { connect } from 'react-redux';
import Dotdotdot from 'react-dotdotdot';

import StarButton from 'Components/shared/topics/elements/StarButton';
import TopicActionsDropdown from 'Components/shared/topics/elements/TopicActionsDropdown';
// import Ability from 'lib/ability';
import { stateMappings } from 'Src/newRedux/stateMappings';
import {
  dragItemTypes,
  GenericDropZone
} from 'Components/shared/drag_and_drop/_index';
import { updateSubTopicTitle } from 'Actions/topic';
import { createTopicAndCardsForGoogleFolder } from 'Src/newRedux/integrationFiles/google-drive/thunks';
import { createTopicAndCardsForDropboxFolder } from 'Src/newRedux/integrationFiles/dropbox/thunks';
import {
  moveTopicContents,
  viewTopic,
  updateTopic
} from 'Src/newRedux/database/topics/thunks';
import { addRemoveCardFromTopics } from 'Src/newRedux/database/cards/thunks';

class TopicTile extends Component {
  static propTypes = {
    topic: object.isRequired,
    subtopic: object.isRequired,
    updateTitle: func.isRequired,
    isLargeTilesView: bool,
    viewTopic: func.isRequired,
    updateTopic: func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      title: props.topic.attributes.title,
      timeoutID: null
    };
  }

  handleTitleChange = title => {
    this.setState({ title });
  };

  toggleEdit = () => {
    const isEditing = this.state.isEditing;
    this.setState({
      isEditing: !isEditing
    });
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.submitTitleChange();
    } else if (e.key == 'Escape' || e.keyCode == 27) {
      this.setState({
        isEditing: false,
        title: this.props.topic.attributes.title
      });
    }
  };

  submitTitleChange = () => {
    const {
      props: { topic, updateTopic },
      state: { title }
    } = this;

    if (title === topic.attributes.title || title.trim() === '') {
      this.toggleEdit();
    } else {
      updateTopic({ id: topic.id, attributes: { title } });
      this.toggleEdit();
    }
  };

  toggleAttachmentHoveringOnCard = status => {
    this.setState(prevState => ({
      ...prevState,
      isAttachmentHoveringOnCard: status
    }));
  };

  addTopicFromFolder = itemProps => {
    const {
      createTopicAndCardsForGoogleFolder,
      createTopicAndCardsForDropboxFolder
    } = this.props;
    const provider = itemProps.draggedItemProps.item.provider;
    const methodMaps = {
      google: createTopicAndCardsForGoogleFolder,
      dropbox: createTopicAndCardsForDropboxFolder
    };
    itemProps.providerData = this.props[`${provider}Data`];
    methodMaps[provider](itemProps);
  };

  nestTopic = itemProps => {
    this.props.moveTopicContents({
      destinationTopicId: this.props.topic.id,
      topicId: itemProps.draggedItemProps.item.id
    });
  };

  handleDrop = ({ draggedItemProps }) => {
    if (draggedItemProps.itemType === dragItemTypes.CARD) {
      const { addRemoveCardFromTopics, ctrlKeyDown, topic } = this.props;
      const originTopicId = ctrlKeyDown
        ? null
        : draggedItemProps.origin.topicId;
      this.props.addRemoveCardFromTopics(
        draggedItemProps.item,
        [topic.id],
        [originTopicId]
      );
    }
  };

  handleTimeoutIDChange = timeoutID => {
    this.setState({ timeoutID });
  };

  getClickHandler = () => {
    const { topic, viewTopic } = this.props;
    const { timeoutID } = this.state;
    const delay = 250;

    if (!timeoutID) {
      this.handleTimeoutIDChange(
        window.setTimeout(() => {
          viewTopic({ topicId: topic.id });
          this.handleTimeoutIDChange(null);
        }, delay)
      );
    } else {
      this.handleTimeoutIDChange(window.clearTimeout(timeoutID));
      this.toggleEdit();
    }
  };

  render() {
    const { topic, isLargeTilesView, viewTopic } = this.props;
    const { isEditing, title, isAttachmentHoveringOnCard } = this.state;
    const image = topic.attributes.remote_image_url
      ? topic.attributes.remote_image_url
      : topic.attributes.image.image
      ? topic.attributes.image.image.small.url
      : topic.attributes.image.small.url;

    return (
      <Fragment>
        <GenericDropZone
          dropClassName={isLargeTilesView ? 'flex-item--large' : 'flex-item'}
          onDragEnter={draggedItem =>
            draggedItem.itemType === dragItemTypes.FOLDER &&
            this.toggleAttachmentHoveringOnCard(true)
          }
          onDragLeave={draggedItem =>
            draggedItem.itemType === dragItemTypes.FOLDER &&
            this.toggleAttachmentHoveringOnCard(false)
          }
          onDrop={this.handleDrop}
          itemType={[dragItemTypes.FOLDER, dragItemTypes.CARD]}
          item={topic}
        >
          <a onClick={() => viewTopic({ topicId: topic.id })}>
            <div
              className={
                isLargeTilesView ? 'img-placeholder--large' : 'img-placeholder'
              }
            >
              {image && (
                <img src={image} alt={topic.title} className="topic-image" />
              )}
            </div>
          </a>
        </GenericDropZone>
        <GenericDropZone
          dropClassName={isLargeTilesView ? 'flex-item--large' : 'flex-item'}
          onDrop={this.nestTopic}
          itemType={dragItemTypes.TOPIC}
          item={topic}
        >
          <div className="tile-info yay-bottom-icons">
            {!isAttachmentHoveringOnCard && isEditing && (
              <input
                type="text"
                onChange={({ target }) => this.handleTitleChange(target.value)}
                onBlur={({ target }) => {
                  target.placeholder = 'Title';
                  target.scrollLeft = target.scrollWidth;
                }}
                placeholder={topic.attributes.title}
                onFocus={({ target }) => {
                  target.placeholder = '';
                  target.selectionStart = target.selectionEnd =
                    target.value.length;
                  target.scrollLeft = target.scrollWidth;
                }}
                onKeyPress={this.handleKeyPress}
                onKeyDown={this.handleKeyPress}
                value={title}
                className="add-subtopic-input"
                autoFocus
              />
            )}
            {!isAttachmentHoveringOnCard && !isEditing && (
              <a onClick={this.getClickHandler}>
                {isLargeTilesView && <span className="tiles-icon hex" />}
                <Dotdotdot clamp={2} className="tile-title">
                  {topic.attributes.title}
                </Dotdotdot>
              </a>
            )}
            {isAttachmentHoveringOnCard && (
              <span>
                {isLargeTilesView && <span className="tiles-icon hex" />}
                <span className="tile-title">Add Subtopic</span>
              </span>
            )}
            <StarButton topic={topic} />
            <TopicActionsDropdown
              topic={topic}
              onRenameTopicSelected={() => this.toggleEdit()}
            />
          </div>
        </GenericDropZone>
      </Fragment>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);
  return {
    googleData: sm.integrationFiles.google,
    dropboxData: sm.integrationFiles.dropbox,
    boxData: sm.integrationFiles.box
  };
};

const mapDispatch = {
  updateTitle: updateSubTopicTitle,
  createTopicAndCardsForGoogleFolder,
  createTopicAndCardsForDropboxFolder,
  moveTopicContents,
  addRemoveCardFromTopics,
  viewTopic,
  updateTopic
};

export default connect(
  mapState,
  mapDispatch
)(TopicTile);
