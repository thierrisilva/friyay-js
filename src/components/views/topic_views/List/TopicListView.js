import React, { Component, Fragment } from 'react';
// import { object, func, number, array } from 'prop-types';
import { connect } from 'react-redux';

import { getSortedFilteredTopicsByParentTopic } from 'Src/newRedux/database/topics/selectors';
import { moveTopicFromDragAndDrop } from 'Src/newRedux/database/topics/abstractions';
import { setLeftSubtopicMenuOpenForTopic } from 'Src/newRedux/interface/menus/actions';

import {
  dragItemTypes,
  GenericDragDropListing
} from 'Components/shared/drag_and_drop/_index';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { createSubTopicsWithTitle } from 'actions/topic';
import { getThisDomain } from 'Src/lib/utilities';
import TopicListCard from './TopicListCard';
import AddSubtopicCard from 'Components/shared/topics/AddSubtopicCard';
import TopicViewMenu from 'Src/components/shared/topics/TopicViewMenu';
import { setTopicPanelView } from 'Src/newRedux/interface/menus/thunks';
import SubtopicViewOptionsDropdown from 'Src/components/shared/topics/elements/SubtopicViewOptionsDropdown';
import SubtopicFilterDropdown from 'Src/components/shared/topics/elements/SubtopicFilterOptionsDropdown';
import { getDomains } from 'Src/newRedux/database/domains/selectors';
import { setDomainSubtopicsView } from 'Src/newRedux/interface/menus/thunks';
import { createTopic } from 'Src/newRedux/database/topics/thunks';

import { yayDesign } from 'Src/lib/utilities';

class TopicListView extends Component {
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

  componentDidMount() {
    if (this.props.showAddTopicInput === true) {
      this.setState({ showAddSubtopicBox: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.showAddTopicInput !== prevProps.showAddTopicInput) {
      this.setState({ showAddSubtopicBox: true });
    }
  }

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

  handleToggleAddTopic = () => {
    this.setState({ showAddTopic: !this.state.showAddTopic });
  };

  handleKeyPress = async e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTopic = {
        attributes: {
          title: this.state.newTopicTitle,
          parent_id: (this.props.topic || {}).id
        }
      };
      await this.props.createTopic(newTopic);
      this.setState({ showAddTopic: false, newTopicTitle: '' });
    } else if (e.key == 'Escape' || e.keyCode == 27) {
      this.setState({ showAddTopic: false, newTopicTitle: '' });
    }
  };

  render() {
    const { topic, topics, active_design } = this.props;
    const { subtopicPanelVisible, showAddTopic, newTopicTitle } = this.state;
    const addTopic = (
      <span>
        <div onClick={this.handleToggleAddTopic} style={{ cursor: 'pointer' }}>
          <i
            style={{ color: active_design.card_font_color }}
            className="glyphicon glyphicon-plus"
          />
        </div>
      </span>
    );

    return (
      <Fragment>
        <h3 className="subtopic-header-text">
          yays in {topic ? topic.attributes.title : 'Workspace'}
          {addTopic}
          <TopicViewMenu
            color={active_design.card_font_color}
            topicViewMode="LIST"
            active={subtopicPanelVisible}
          />
          <SubtopicViewOptionsDropdown onSelect={this.handleTopicViewSelect} />
          <SubtopicFilterDropdown />
        </h3>
        <div className="topic-list-view">
          {showAddTopic && (
            <input
              type="text"
              onChange={({ target }) =>
                this.setState({ newTopicTitle: target.value })
              }
              placeholder="Type new yay title"
              onKeyPress={this.handleKeyPress}
              value={newTopicTitle}
              className="add-subtopic-input topic-list-card"
              autoFocus
            />
          )}
          <GenericDragDropListing
            itemList={topics}
            dropZoneProps={{ topicId: topic ? topic.id : null }}
            itemType={dragItemTypes.TOPIC}
            onDropItem={moveTopicFromDragAndDrop}
            renderItem={subtopic => (
              <TopicListCard key={subtopic.id} topic={subtopic} />
            )}
          />
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
    myTopicsView,
    subtopicPanelVisible,
    domains: getDomains(state)
  };
};

const mapDispatch = {
  createSubtopic: createSubTopicsWithTitle,
  moveTopicFromDragAndDrop,
  setTopicPanelView,
  setDomainSubtopicsView,
  createTopic
};

export default connect(
  mapState,
  mapDispatch
)(TopicListView);
