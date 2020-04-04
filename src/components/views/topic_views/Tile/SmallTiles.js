import React, { Component, Fragment } from 'react';
import { func, number } from 'prop-types';
import { connect } from 'react-redux';

import TopicTile from './TopicTile';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { createTopic } from 'Src/newRedux/database/topics/thunks';
import { moveTopicFromDragAndDrop } from 'Src/newRedux/database/topics/abstractions';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import { getThisDomain } from 'Src/lib/utilities';
import DMLoader from 'Src/dataManager/components/DMLoader';
import GenericDragDropListing from 'Components/shared/drag_and_drop/GenericDragDropListing';
import TopicViewMenu from 'Src/components/shared/topics/TopicViewMenu';
import { setTopicPanelView } from 'Src/newRedux/interface/menus/thunks';
import SubtopicViewOptionsDropdown from 'Src/components/shared/topics/elements/SubtopicViewOptionsDropdown';
import SubtopicFilterDropdown from 'Src/components/shared/topics/elements/SubtopicFilterOptionsDropdown';
import { getDomains } from 'Src/newRedux/database/domains/selectors';
import { setDomainSubtopicsView } from 'Src/newRedux/interface/menus/thunks';
import { yayDesign } from 'Src/lib/utilities';

class SmallTiles extends Component {
  constructor(props) {
    super(props);
    this.handleTopicViewSelect = this.handleTopicViewSelect.bind(this);
    this.setTopicPanelView = props.setTopicPanelView;
    this.setDomainSubtopicsView = props.setDomainSubtopicsView;
  }

  state = {
    showAddSubtopicBox: false,
    title: ''
  };

  static propTypes = {
    selectedTopicId: number,
    createTopic: func.isRequired
  };

  toggleNewSubtopic = () => {
    const { showAddSubtopicBox } = this.state;
    this.setState({
      showAddSubtopicBox: !showAddSubtopicBox,
      title: ''
    });
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.submitSubtopic();
    }
  };

  componentDidMount() {
    if (this.props.showAddTopicInput === true) {
      this.toggleNewSubtopic();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.showAddTopicInput !== prevProps.showAddTopicInput) {
      this.props.showAddTopicInput === true && this.toggleNewSubtopic();
    }
  }

  submitSubtopic = () => {
    const {
      props: { createTopic, topic },
      state: { title }
    } = this;

    if (title.trim() === '') {
      this.toggleNewSubtopic();
    } else {
      const parent_id = topic ? topic.id : null;
      const newTopic = {
        attributes: {
          title: title,
          parent_id
        }
      };
      createTopic(newTopic);
      this.toggleNewSubtopic();
    }
  };

  handleTitleChange = title => {
    this.setState({ title });
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
      moveTopicFromDragAndDrop,
      topic,
      topics,
      topicRequirements,
      active_design
    } = this.props;
    const { showAddSubtopicBox, title, subtopicPanelVisible } = this.state;

    return (
      <Fragment>
        <h3 className="subtopic-header-text">
          yays in {topic ? topic.attributes.title : 'Workspace'}
          <span>
            <div onClick={this.toggleNewSubtopic} style={{ cursor: 'pointer' }}>
              <i
                style={{ color: active_design.card_font_color }}
                className="glyphicon glyphicon-plus"
              />
            </div>
          </span>
          <TopicViewMenu
            color={active_design.card_font_color}
            topicViewMode="TILE"
            active={subtopicPanelVisible}
          />
          <SubtopicViewOptionsDropdown onSelect={this.handleTopicViewSelect} />
          <SubtopicFilterDropdown />
        </h3>
        <div className="small-tiles-view">
          {showAddSubtopicBox && (
            <div className="small-tiles-view_item-container">
              <div className="grid-view_card-container">
                <div>
                  <div className="img-placeholder flex-item" />
                  <input
                    type="text"
                    onChange={({ target }) =>
                      this.handleTitleChange(target.value)
                    }
                    onBlur={({ target }) => {
                      target.placeholder = 'Title';
                      target.scrollLeft = target.scrollWidth;
                    }}
                    placeholder="Title"
                    onFocus={({ target }) => {
                      target.placeholder = '';
                      target.selectionStart = target.selectionEnd =
                        target.value.length;
                      target.scrollLeft = target.scrollWidth;
                    }}
                    onKeyPress={this.handleKeyPress}
                    onKeyDown={this.handleKeyPress}
                    value={title}
                    className="add-subtopic-input flex-item"
                    autoFocus
                  />
                </div>
              </div>
            </div>
          )}
          <GenericDragDropListing
            dragClassName="task-view_drag-card"
            dropClassName="small-tiles-view_item-container"
            dropZoneProps={{ topicId: topic ? topic.id : null }}
            draggedItemProps={{ origin: { topicId: topic ? topic.id : null } }}
            itemContainerClassName="grid-view_card-container"
            itemList={topics}
            itemType={dragItemTypes.TOPIC}
            onDropItem={moveTopicFromDragAndDrop}
            renderItem={top => (
              <TopicTile topic={top} subtopic={top} key={top.id} />
            )}
          >
            <DMLoader
              dataRequirements={{
                topicsWithAttributes: { attributes: topicRequirements }
              }}
              loaderKey="topicsWithAttributes"
            />
          </GenericDragDropListing>
        </div>
      </Fragment>
    );
  }
}

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
    subtopicPanelVisible,
    domains: getDomains(state),
    myTopicsView
  };
};

const mapDispatch = {
  createTopic,
  moveTopicFromDragAndDrop,
  setTopicPanelView,
  setDomainSubtopicsView
};

export default connect(
  mapState,
  mapDispatch
)(SmallTiles);
