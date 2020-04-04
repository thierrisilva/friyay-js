import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bool, func, object, string } from 'prop-types';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { addRemoveCardFromTopics } from 'Src/newRedux/database/cards/thunks';
import {
  dragItemTypes,
  GenericDropZone
} from 'Components/shared/drag_and_drop/_index';
import IconButton from 'Components/shared/buttons/IconButton';
import TopicActionsDropdown from 'Src/components/shared/topics/elements/TopicActionsDropdown';
import TopicTitleEditor from 'Src/components/shared/topics/elements/TopicTitleEditor';
import { createTopicAndCardsForGoogleFolder } from 'Src/newRedux/integrationFiles/google-drive/thunks';
import { createTopicAndCardsForDropboxFolder } from 'Src/newRedux/integrationFiles/dropbox/thunks';
import { moveTopicContents } from 'Src/newRedux/database/topics/thunks';
import { yayDesign } from 'Src/lib/utilities';

class LeftMenuTopicRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draggedOver: false,
      topicNameEditMode: false
    };
  }

  handleToggleTopicNameEditMode = () => {
    this.setState(state => ({ topicNameEditMode: !state.topicNameEditMode }));
  };

  handleCardDrop = ({ draggedItemProps }) => {
    const { addRemoveCardFromTopics, ctrlKeyDown, topic } = this.props; // eslint-disable-line
    const originTopicId = ctrlKeyDown
      ? []
      : draggedItemProps.item.relationships.topics.data;
    addRemoveCardFromTopics(draggedItemProps.item, [topic.id], originTopicId);
  };

  handleFolderDrop = itemProps => {
    const {
      draggedItemProps: {
        item: { provider }
      }
    } = itemProps;
    const {
      createTopicAndCardsForGoogleFolder,
      createTopicAndCardsForDropboxFolder
    } = this.props; // eslint-disable-line
    const methodMaps = {
      google: createTopicAndCardsForGoogleFolder,
      dropbox: createTopicAndCardsForDropboxFolder
    };
    itemProps.providerData = this.props[`${provider}Data`];
    methodMaps[provider](itemProps);
  };

  handleTopicDrop = itemProps => {
    this.props.moveTopicContents({
      destinationTopicId: this.props.topic.id,
      topicId: itemProps.draggedItemProps.item.id
    });
  };

  handleDrop = itemProps => {
    if (itemProps.draggedItemProps.itemType === dragItemTypes.CARD) {
      this.handleCardDrop(itemProps);
    } else if (itemProps.draggedItemProps.itemType === dragItemTypes.FOLDER) {
      this.handleFolderDrop(itemProps);
    } else if (
      itemProps.draggedItemProps.itemType === dragItemTypes.TOPIC ||
      itemProps.draggedItemProps.itemType === dragItemTypes.SUBTOPIC_HEX
    ) {
      this.handleTopicDrop(itemProps);
    }
  };

  render() {
    const {
      rootUrl,
      pageTopicSlug,
      onCaretClick,
      topic,
      active_design = {}
    } = this.props;
    const { /* draggedOver,*/ topicNameEditMode } = this.state;
    const baseUrl = rootUrl == '/' ? '' : rootUrl;
    const { workspace_font_color } = active_design;

    return (
      <GenericDropZone
        dropClassName={`left-menu_topic-element ${
          pageTopicSlug == topic.attributes.slug ? 'active' : ''
        }`}
        itemType={[
          dragItemTypes.CARD,
          dragItemTypes.FOLDER,
          dragItemTypes.TOPIC,
          dragItemTypes.SUBTOPIC_HEX
        ]}
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}
        item={topic}
      >
        <div className="left-menu_topic-element_details">
          {this.props.isExpandable === true ? (
            this.props.isExpanded === true ? (
              <IconButton
                color={workspace_font_color}
                additionalClasses="caret-down"
                fontAwesome={true}
                icon="caret-down"
                onClick={() => this.props.onExpandToggle()}
              />
            ) : (
              <Fragment>
                <IconButton
                  color={workspace_font_color}
                  additionalClasses={`${
                    topic.attributes.starred_by_current_user
                      ? 'left-menu_topic-element_ghost-star-icon'
                      : `square`
                  }`}
                  fontAwesome={true}
                  icon={
                    topic.attributes.starred_by_current_user === true
                      ? 'star'
                      : 'square'
                  }
                  onClick={() => {}}
                />
                <IconButton
                  color={workspace_font_color}
                  additionalClasses="expandable"
                  fontAwesome={true}
                  icon="caret-right"
                  onClick={() => this.props.onExpandToggle()}
                />
              </Fragment>
            )
          ) : (
            <IconButton
              color={workspace_font_color}
              additionalClasses={`${
                topic.attributes.starred_by_current_user
                  ? 'left-menu_topic-element_ghost-star-icon'
                  : `square`
              }`}
              fontAwesome={true}
              icon={
                topic.attributes.starred_by_current_user === true
                  ? 'star'
                  : 'square'
              }
              onClick={() => this.props.onExpandToggle()}
            />
          )}
          {topicNameEditMode ? (
            <TopicTitleEditor
              topic={topic}
              onFinishEditing={this.handleToggleTopicNameEditMode}
            />
          ) : (
            <Link
              className="left-menu_topic-element_topic-name"
              to={`${baseUrl}/yays/${topic.attributes.slug}`}
            >
              {topic.attributes.title}
            </Link>
          )}
        </div>
        <div className="left-menu_topic-element_submenu-caret">
          <IconButton
            color={workspace_font_color}
            fontAwesome
            icon="plus"
            onClick={() => this.props.onExpandToggle(topic.id, true)}
          />
          <TopicActionsDropdown
            color={workspace_font_color}
            topic={topic}
            onRenameTopicSelected={this.handleToggleTopicNameEditMode}
          />
          <IconButton
            color={workspace_font_color}
            fontAwesome
            icon="caret-right"
            onClick={() => onCaretClick(false)}
          />
        </div>
      </GenericDropZone>
    );
  }
}

LeftMenuTopicRow.propTypes = {
  isExpandable: bool,
  rootUrl: string.isRequired,
  onCaretClick: func.isRequired,
  pageTopicSlug: string,
  topic: object.isRequired,
  onExpandToggle: func.isRequired,
  createTopicAndCardsForGoogleFolder: func,
  createTopic: func
};

const mapState = state => {
  const sm = stateMappings(state);
  const { page, utilities, integrationFiles, topics } = sm;
  const active_design = yayDesign(page.topicId, topics[page.topicId]);
  return {
    active_design,
    pageTopicSlug: page.topicSlug,
    rootUrl: page.rootUrl,
    ctrlKeyDown: utilities.ctrlKeyDown,
    googleData: integrationFiles.google,
    dropboxData: integrationFiles.dropbox,
    boxData: integrationFiles.box
  };
};

const mapDispatch = {
  addRemoveCardFromTopics,
  createTopicAndCardsForGoogleFolder,
  createTopicAndCardsForDropboxFolder,
  moveTopicContents
};

export default connect(
  mapState,
  mapDispatch
)(LeftMenuTopicRow);
