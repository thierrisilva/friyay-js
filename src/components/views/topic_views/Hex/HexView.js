import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { array, func, string, object } from 'prop-types';
import {
  dragItemTypes,
  GenericDropZone
} from 'Components/shared/drag_and_drop/_index';
import { stateMappings } from 'Src/newRedux/stateMappings';
// import { instanceOfGetSortedFilteredTopicsForTopic } from 'Src/newRedux/database/topics/selectors';
import { createTopic, viewTopic } from 'Src/newRedux/database/topics/thunks';
// import withDataManager from 'Src/dataManager/components/withDataManager';
import Icon from 'Components/shared/Icon';
import TopicHex from './TopicHex';
import DMLoader from 'Src/dataManager/components/DMLoader';
import { createTopicAndCardsForGoogleFolder } from 'Src/newRedux/integrationFiles/google-drive/thunks';
import { createTopicAndCardsForDropboxFolder } from 'Src/newRedux/integrationFiles/dropbox/thunks';
import { scrollToShow } from 'Src/lib/utilities';
import TopicViewMenu from 'Src/components/shared/topics/TopicViewMenu';
import { getThisDomain } from 'Src/lib/utilities';
import { getDomains } from 'Src/newRedux/database/domains/selectors';
import { setDomainSubtopicsView } from 'Src/newRedux/interface/menus/thunks';
import SubtopicViewOptionsDropdown from 'Src/components/shared/topics/elements/SubtopicViewOptionsDropdown';
import { yayDesign } from 'Src/lib/utilities';

class HexView extends PureComponent {
  constructor(props) {
    super(props);
    this.setDomainSubtopicsView = props.setDomainSubtopicsView;
  }

  static propTypes = {
    createTopic: func.isRequired,
    createTopicAndCardsForGoogleFolder: func.isRequired,
    topic: object,
    topicId: string,
    topics: array.isRequired,
    viewTopic: func.isRequired
  };

  state = {
    creatingTopic: false,
    displayAddTopic: false,
    isAttachmentHoveringOnCard: false
  };

  componentDidMount() {
    if (this.props.showAddTopicInput === true) {
      this.handleClickAddTopic();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.showAddTopicInput !== prevProps.showAddTopicInput) {
      this.props.showAddTopicInput === true && this.handleClickAddTopic();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown, true);
  }

  handleAddTopicClick = () => {
    this.setState({ displayAddTopic: true });
    window.addEventListener('keydown', this.handleKeyDown, true);
  };

  handleCreateNewTopicClick = async () => {
    this.setState({ creatingTopic: true });
    const newTopic = await this.props.createTopic({
      attributes: { title: this.newTopicTitleInput.value }
    });
    this.setState({ creatingTopic: false, displayAddTopic: false });
    window.removeEventListener('keydown', this.handleKeyDown, true);
    scrollToShow(
      document.querySelector(
        '.t' + newTopic.data.data.id + ' .topic-hex_title'
      ),
      15,
      25
    );
  };

  handleEscapeKeyPressed = () => {
    this.setState({ displayAddTopic: false });
    window.removeEventListener('keydown', this.handleKeyDown, true);
  };

  handleKeyDown = key => {
    (key.keyCode == 13 || key.key == 'Enter') &&
      this.handleCreateNewTopicClick();
    (key.keyCode == 27 || key.key == 'Escape') && this.handleEscapeKeyPressed();
  };

  toggleAttachmentHoveringOnCard = status => {
    this.setState(prevState => ({
      ...prevState,
      isAttachmentHoveringOnCard: status
    }));
  };

  addTopicFromFolder = itemProps => {
    const methodMaps = {
      google: createTopicAndCardsForGoogleFolder,
      dropbox: createTopicAndCardsForDropboxFolder
    };
    const {
      createTopicAndCardsForGoogleFolder,
      createTopicAndCardsForDropboxFolder
    } = this.props;
    const provider = itemProps.draggedItemProps.item.provider;
    let itemPropsCopy = Object.assignLabel({}, itemProps);
    itemPropsCopy.providerData = this.props[`${provider}Data`];
    return methodMaps[provider](itemPropsCopy);
  };

  getCurrentDomain = () => {
    const { domains } = this.props;
    const thisDomain = getThisDomain(domains);
    window.currentDomain = thisDomain;

    return thisDomain;
  };

  handleTopicViewSelect = topicViewMode => {
    const { topic } = this.props;
    topic
      ? this.setTopicPanelView(topicViewMode)
      : this.setDomainSubtopicsView(topicViewMode, this.getCurrentDomain());
  };

  render() {
    const {
      topics,
      topicRequirements,
      topic,
      topicsPanelVisible,
      active_design
    } = this.props;
    const {
      /* creatingTopic,*/ displayAddTopic,
      isAttachmentHoveringOnCard
    } = this.state;

    return (
      <div>
        <h3 className="subtopic-header-text">
          yays in {topic ? topic.attributes.title : 'Workspace'}
          <span>
            <div
              onClick={this.handleAddTopicClick}
              style={{ cursor: 'pointer' }}
            >
              <i
                style={{ color: active_design.card_font_color }}
                className="glyphicon glyphicon-plus"
              />
            </div>
          </span>
          <TopicViewMenu
            color={active_design.card_font_color}
            topicViewMode="HEX"
            active={topicsPanelVisible}
          />
          <SubtopicViewOptionsDropdown onSelect={this.handleTopicViewSelect} />
        </h3>
        <GenericDropZone
          dropClassName="hex-view"
          onDragEnter={() => this.toggleAttachmentHoveringOnCard(true)}
          onDragLeave={() => this.toggleAttachmentHoveringOnCard(false)}
          dropsDisabled
          itemType={dragItemTypes.FOLDER}
        >
          <div className="hex-view_hex-container">
            <div className="topic-hex">
              <div
                className="topic-hex_content"
                onClick={this.handleAddTopicClick}
              >
                {isAttachmentHoveringOnCard && (
                  <GenericDropZone
                    dropClassName="attachment-option-hexa-topic"
                    method="link"
                    onDrop={this.addTopicFromFolder}
                    itemType={dragItemTypes.FOLDER}
                  >
                    Drop to Create
                  </GenericDropZone>
                )}
                {!isAttachmentHoveringOnCard && displayAddTopic && (
                  <Fragment>
                    <input
                      ref={ref => (this.newTopicTitleInput = ref)}
                      type="text"
                      className="hex-view_new-topic-input"
                      autoFocus={true}
                    />
                    {/* creatingTopic ?
                    <span className="hex-view_new-topic-button">
                      Creating...
                    </span>
                    :*/}
                    <button
                      className="hex-view_new-topic-button"
                      onClick={this.handleCreateNewTopicClick}
                    >
                      Create
                    </button>
                  </Fragment>
                )}
                {!isAttachmentHoveringOnCard && !displayAddTopic && (
                  <Fragment>
                    <Icon
                      color={active_design.card_font_color}
                      fontAwesome
                      icon="plus"
                    />
                    <span>Add yay </span>
                  </Fragment>
                )}
              </div>
            </div>
            {topics.map(topic => (
              <TopicHex key={`topic-hex-${topic.id}`} topic={topic} />
            ))}
            <DMLoader
              dataRequirements={{
                topicsWithAttributes: { attributes: topicRequirements }
              }}
              loaderKey="topicsWithAttributes"
            />
          </div>
        </GenericDropZone>
      </div>
    );
  }
}

// const topicSelector = instanceOfGetSortedFilteredTopicsForTopic();

const mapState = state => {
  const sm = stateMappings(state);
  const { user, page } = sm;
  const uiSettings = user.attributes.ui_settings;
  const topicsPanelVisible = uiSettings.topics_panel_visible;
  const active_design = yayDesign(page.topicId, sm.topics[page.topicId]);

  return {
    active_design,
    googleData: sm.integrationFiles.google,
    dropboxData: sm.integrationFiles.dropbox,
    boxData: sm.integrationFiles.box,
    domains: getDomains(state),
    topicsPanelVisible
  };
};

const mapDispatch = {
  createTopic,
  viewTopic,
  createTopicAndCardsForGoogleFolder,
  createTopicAndCardsForDropboxFolder,
  setDomainSubtopicsView
};

export default connect(
  mapState,
  mapDispatch
)(HexView);
