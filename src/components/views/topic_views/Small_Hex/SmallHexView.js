/* global vex */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IconButton from 'Src/components/shared/buttons/IconButton';
import TopicItemNew from 'Src/components/pages/topic_page/topic_item_new';
import TopicItem from 'Src/components/pages/topic_page/topic_item';
import TopicNewItemEdit from 'Src/components/pages/topic_page/topic_new_item_edit';
import tiphive from 'Src/lib/tiphive';
import {
  dragItemTypes,
  GenericDragDropListing
} from 'Components/shared/drag_and_drop/_index';
import { moveOrCopyTopicInOrToTopicFromDragAndDrop } from 'Src/newRedux/database/topics/abstractions';
import {
  removeTopic,
  removeTopicAndMoveContent,
  toggleFollowTopic
} from 'Src/newRedux/database/topics/thunks';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { toggleHexPanel } from 'Src/newRedux/interface/menus/actions';
import TopicViewMenu from 'Src/components/shared/topics/TopicViewMenu';
import { setTopicPanelView } from 'Src/newRedux/interface/menus/thunks';
import SubtopicViewOptionsDropdown from 'Src/components/shared/topics/elements/SubtopicViewOptionsDropdown';
import SubtopicFilterDropdown from 'Src/components/shared/topics/elements/SubtopicFilterOptionsDropdown';
import { yayDesign } from 'Src/lib/utilities';

const MIN_QUANTITY = 7; // Placeholder + 5 + 5 (two rows)

class SmallHexView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTopics: [],
      subtopicToDelete: null
    };
    this.handleTopicViewSelect = this.handleTopicViewSelect.bind(this);
    this.setTopicPanelView = props.setTopicPanelView;
  }

  handleAddTopicClick = () => {
    const {
      state: { newTopics }
    } = this;
    const isEmpty = newTopics.length === 0;
    const last = newTopics[newTopics - 1];

    this.setState({
      newTopics: isEmpty ? [1] : [...newTopics, last + 1]
    });
  };

  componentDidMount() {
    if (this.props.showAddTopicInput === true) {
      this.handleAddTopicClick();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.showAddTopicInput !== prevProps.showAddTopicInput) {
      this.props.showAddTopicInput === true && this.handleAddTopicClick();
    }
  }

  handleTopicCreated = topicId => {
    this.setState(state => ({
      ...state,
      newTopics: state.newTopics.filter(id => id !== topicId)
    }));
  };

  selectSubtopicDelete = subtopicToDelete => {
    this.setState({ subtopicToDelete });
  };

  handleToggleTopicSection = () => this.props.toggleHexPanel();

  handleTopicDelete = e => {
    e.preventDefault();

    vex.dialog.confirm({
      message: 'Are you sure you want to delete this yay?',
      callback: value => {
        if (value) {
          this.props.removeTopic(this.state.subtopicToDelete);
        }
      }
    });
  };

  handleTopicDeleteAndMove = selectedTopics => {
    const topicIDs = selectedTopics.map(topic => topic.id);
    const topicID = this.state.subtopicToDelete;

    this.props.removeTopicAndMoveContent(topicID, topicIDs);
    tiphive.hidePrimaryModal();
  };

  handleTopicViewSelect = topicViewMode => {
    const { subtopicPanelVisible, topic } = this.props;
    this.setTopicPanelView(topicViewMode);
  };

  /**
   * Render drag & drop TopicItem.
   *
   * @return {DOM}
   */
  renderDragAndDropItem = (subtopic, handler, index) => {
    const { handleStarSubhiveClick } = this.props;

    return (
      <TopicItem
        currentGroupId={null}
        group={null}
        topic={subtopic}
        isCurrentTopic={false}
        key={`hex-subtopic-${subtopic.id}`}
        handleStarSubhiveClick={handleStarSubhiveClick}
        handleDelete={this.handleTopicDelete}
        handleMoveDelete={this.handleTopicDeleteAndMove}
        selectSubtopic={this.selectSubtopicDelete}
        dropdownHasInput={false}
      />
    );
  };

  render() {
    const {
      props: { page, topic, active_design },
      state: { newTopics, subtopicPanelVisible }
    } = this;

    const subtopicItems = [
      <TopicItemNew
        parentTopic={topic}
        handleAddTopicClick={this.handleAddTopicClick}
        key="new-subtopic"
      />,
      ...newTopics.map((topicId, index) => (
        <TopicNewItemEdit
          key={topicId}
          id={topicId}
          handleTopicSubmit={this.handleTopicSubmit}
          title={`New Title ${index + 1}`}
          topic={topic}
          handleTopicCreated={this.handleTopicCreated}
        />
      ))
    ];

    return (
      <div className="hex-grid-wrapper">
        <h3 className="subtopic-header-text">
          yays in {topic ? topic.attributes.title : 'Workspace'}
          <TopicViewMenu
            color={active_design.card_font_color}
            topicViewMode="HEX"
            active={subtopicPanelVisible}
          />
          <SubtopicViewOptionsDropdown onSelect={this.handleTopicViewSelect} />
          <SubtopicFilterDropdown />
        </h3>
        <div className="hex-grid hex-grid-small">
          {/* {page !== 'topics' && (
            <IconButton
              additionalClasses="hex-grid-close"
              icon="close"
              onClick={this.handleToggleTopicSection}
            />
          )} */}
          <div className="hex-inner-wrapper">
            <GenericDragDropListing
              headerItem={subtopicItems}
              itemList={this.props.topics}
              id={'topicHexList'}
              draggedItemProps={{ origin: { topicId: this.props.topicId } }}
              dragPreview={subtopic => <TopicItem topic={subtopic} />}
              dragClassName="small-hex_draggable-topic"
              dropZoneProps={{ topicId: this.props.topicId }}
              itemType={dragItemTypes.SUBTOPIC_HEX}
              onDropItem={this.props.moveOrCopyTopicInOrToTopicFromDragAndDrop}
              dropClassName="subtopics-hex-list subtopics-list"
              renderItem={this.renderDragAndDropItem}
            />
          </div>
          <div className="clearfix" />
        </div>
      </div>
    );
  }
}

SmallHexView.propTypes = {
  topic: PropTypes.object,
  topicMinimized: PropTypes.bool,
  topics: PropTypes.array,
  removeTopic: PropTypes.func.isRequired,
  removeTopicAndMoveContent: PropTypes.func.isRequired,
  toggleHexPanel: PropTypes.func.isRequired,
  toggleFollowTopic: PropTypes.func
};

const mapState = state => {
  const sm = stateMappings(state);
  const { page } = sm;
  const uiSettings = sm.user.attributes.ui_settings;
  const myTopicsView = uiSettings.my_topics_view.find(
    view => view.id === sm.page.topicId
  );
  const subtopicPanelVisible =
    myTopicsView && myTopicsView.subtopic_panel_visible;
  const active_design = yayDesign(page.topicId, sm.topics[page.topicId]);

  return {
    active_design,
    page: page.page,
    topicMinimized: !sm.menus.displayHexPanel,
    subtopicPanelVisible
  };
};

const mapDispatch = {
  removeTopic,
  removeTopicAndMoveContent,
  toggleFollowTopic,
  toggleHexPanel,
  moveOrCopyTopicInOrToTopicFromDragAndDrop,
  setTopicPanelView
};

export default connect(
  mapState,
  mapDispatch
)(SmallHexView);
