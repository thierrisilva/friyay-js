import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';
import GenericDropZone from 'Src/components/shared/drag_and_drop/GenericDropZone.js';
import Dotdotdot from 'react-dotdotdot';
import {
  toggleFollowTopic,
  viewTopic,
  createTopic,
  updateTopic
} from 'Src/newRedux/database/topics/thunks';
import { createTopicAndCardsForGoogleFolder } from 'Src/newRedux/integrationFiles/google-drive/thunks';
import { createTopicAndCardsForDropboxFolder } from 'Src/newRedux/integrationFiles/dropbox/thunks';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import TopicActionsDropdown from 'Components/shared/topics/elements/TopicActionsDropdown';

//TODO: MH: wait for following_topics to return with user relationships so we can track it that way rather than through topic relationships
class TopicHex extends React.PureComponent {
  static propTypes = {
    createTopicAndCardsForGoogleFolder: PropTypes.func.isRequired,
    createTopicAndCardsForDropboxFolder: PropTypes.func,
    createTopic: PropTypes.func.isRequired,
    toggleFollowTopic: PropTypes.func,
    topic: PropTypes.object.isRequired,
    viewTopic: PropTypes.func.isRequired,
    userFollowsTopic: PropTypes.bool.isRequired,
    updateTopic: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isAttachmentHoveringOnCard: false,
      isEditing: false,
      isSaving: false,
      title: props.topic.attributes.title,
      timeoutID: null
    };

    this.createTopicAndCardsForGoogleFolder =
      props.createTopicAndCardsForGoogleFolder;
    this.createTopicAndCardsForDropboxFolder =
      props.createTopicAndCardsForDropboxFolder;
    this.toggleFollowTopic = props.toggleFollowTopic;
    this.createTopic = props.createTopic;
    this.viewTopic = props.viewTopic;
  }

  toggleAttachmentHoveringOnCard = status => {
    this.setState(prevState => ({
      ...prevState,
      isAttachmentHoveringOnCard: status
    }));
  };

  /**
   * On mouse leave the hive hexagon event handler.
   *
   * @return  {Void}
   */
  handleMouseLeaveHive = () => {
    const dropdownEl = document.getElementsByClassName(
      'hex-item-dropdown-button open'
    )[0];

    if (dropdownEl) {
      dropdownEl.classList.remove('open');
    }
  };

  AddTopicFromFolder = itemProps => {
    const provider = itemProps.draggedItemProps.item.provider;
    const methodMaps = {
      google: this.createTopicAndCardsForGoogleFolder,
      dropbox: this.createTopicAndCardsForDropboxFolder
    };
    itemProps.providerData = this.props[`${provider}Data`];
    methodMaps[provider](itemProps);
  };

  handleTitleChange = title => {
    this.setState({ title });
  };

  handleTimeoutIDChange = timeoutID => {
    this.setState({ timeoutID });
  };

  submitTitleChange = () => {
    const {
      props: { topic, updateTopic },
      state: { title, isSaving }
    } = this;

    if (isSaving) {
      return;
    }

    if (title === topic.attributes.title || title.trim() === '') {
      this.toggleEdit();
    } else {
      updateTopic({ id: topic.id, attributes: { title } });
      this.toggleEdit();
    }
  };

  success = id => {
    if (id === this.props.topic.id) {
      this.toggleEdit();
      this.toggleSaving(id);
    }
  };

  toggleSaving = id => {
    if (id === this.props.topic.id) {
      this.setState({
        isSaving: !this.state.isSaving
      });
    }
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

  toggleEdit = () => {
    const isEditing = this.state.isEditing;
    this.setState({
      isEditing: !isEditing
    });
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
    const { topic, userFollowsTopic } = this.props;
    const { isAttachmentHoveringOnCard, isEditing, title } = this.state;

    return (
      <GenericDropZone
        dropClassName="topic-hex"
        onDragEnter={() => this.toggleAttachmentHoveringOnCard(true)}
        onDragLeave={() => this.toggleAttachmentHoveringOnCard(false)}
        dropsDisabled
        itemType={dragItemTypes.FOLDER}
      >
        {isAttachmentHoveringOnCard ? (
          <GenericDropZone
            dropClassName="attachment-option-hexa-topic"
            method="link"
            onDrop={this.AddTopicFromFolder}
            itemType={dragItemTypes.FOLDER}
            item={topic}
          >
            <TopicActionsDropdown topic={topic} icon="more_horiz" />
            <div
              key={`topic-hex_content${topic.id}`}
              className={`topic-hex_content t${topic.id}`}
            >
              <span className="topic-hex_title">Add Subtopic</span>
            </div>
          </GenericDropZone>
        ) : (
          [
            <div
              key={`topic-hex_content${topic.id}`}
              className={`topic-hex_content t${topic.id}`}
            >
              <TopicActionsDropdown
                topic={topic}
                icon="more_horiz"
                onRenameTopicSelected={() => this.toggleEdit()}
              />
              {isEditing ? (
                <div className="topic-hex_title">
                  <input
                    type="text"
                    onChange={({ target }) =>
                      this.handleTitleChange(target.value)
                    }
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
                    className="hex-view_new-topic-input"
                    spellCheck="false"
                    autoFocus
                  />
                </div>
              ) : (
                <span
                  className="topic-hex_title"
                  onClick={this.getClickHandler}
                >
                  <Dotdotdot clamp={2}>{topic.attributes.title}</Dotdotdot>
                </span>
              )}
            </div>,
            <a
              key={`topic-follow_button${topic.id}`}
              className="topic-hex_follow-btn"
              onClick={() => this.toggleFollowTopic(topic.id)}
            >
              {userFollowsTopic ? 'UNFOLLOW' : 'FOLLOW'}
            </a>
          ]
        )}
      </GenericDropZone>
    );
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  return {
    userFollowsTopic: sm.user.relationships.following_topics.data.includes(
      props.topic.id
    ),
    googleData: sm.integrationFiles.google,
    dropboxData: sm.integrationFiles.dropbox,
    boxData: sm.integrationFiles.box
  };
};

const mapDispatch = {
  toggleFollowTopic,
  viewTopic,
  updateTopic,
  createTopic,
  createTopicAndCardsForGoogleFolder,
  createTopicAndCardsForDropboxFolder
};

export default connect(
  mapState,
  mapDispatch
)(TopicHex);
