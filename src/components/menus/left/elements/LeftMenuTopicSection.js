import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import LeftMenuTopicRow from './LeftMenuTopicRow';
import LeftMenuNewTopicInput from './LeftMenuNewTopicInput';
import {
  dragItemTypes,
  GenericDragDropListing
} from 'Components/shared/drag_and_drop/_index';
import DMLoader from 'Src/dataManager/components/DMLoader';
import { moveOrCopyTopicInOrToTopicFromDragAndDrop } from 'Src/newRedux/database/topics/abstractions';
import { getSortedFilteredTopicsByParentTopic } from 'Src/newRedux/database/topics/selectors';
import { setLeftSubtopicMenuOpenForTopic } from 'Src/newRedux/interface/menus/actions';
import { stateMappings } from 'Src/newRedux/stateMappings';

class LeftMenuTopicSection extends Component {
  static propTypes = {
    // parent
    baseUrl: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    topicId: PropTypes.string.isRequired,
    // redux
    selectedTopicId: PropTypes.string,
    topic: PropTypes.object,
    topics: PropTypes.array.isRequired,
    moveOrCopyTopicInOrToTopicFromDragAndDrop: PropTypes.func.isRequired,
    setLeftSubtopicMenuOpenForTopic: PropTypes.func.isRequired
  };

  state = { isExpanded: false, openQuickAddForm: false };

  handleExpandToggle = openQuickAddForm => {
    if (openQuickAddForm) {
      this.setState({
        isExpanded: true,
        openQuickAddForm: !this.state.openQuickAddForm
      });
    } else {
      const isExpanded = !this.state.isExpanded;
      this.setState({ isExpanded });
    }
  };

  handleToggleNewTopicInput = () => {
    this.setState(state => ({ openQuickAddForm: !state.openQuickAddForm }));
  };

  render() {
    const paddingLeft = this.props.level > 1 ? '10px' : 0;
    const overflowY = this.props.level === 0 ? 'auto' : undefined;
    const flex = this.props.level === 0 ? '1 0 0' : undefined;

    return (
      <div style={{ flex, paddingLeft, overflowY }}>
        {this.props.topic && (
          <LeftMenuTopicRow
            baseUrl={this.props.baseUrl}
            key={this.props.topic.id}
            isExpandable
            isExpanded={this.state.isExpanded}
            openQuickAddForm={this.state.openQuickAddForm}
            isSelected={this.props.topic.id == this.props.selectedTopicId}
            topic={this.props.topic}
            onCaretClick={openQuickAddForm =>
              this.props.setLeftSubtopicMenuOpenForTopic(
                this.props.topic.id,
                openQuickAddForm
              )
            }
            onExpandToggle={openQuickAddForm =>
              this.handleExpandToggle(openQuickAddForm)
            }
          />
        )}
        {this.state.openQuickAddForm && (
          <LeftMenuNewTopicInput
            parentTopicId={this.props.topicId}
            onDismiss={this.handleToggleNewTopicInput}
          />
        )}
        {(!this.props.topic || this.state.isExpanded) && (
          <GenericDragDropListing
            itemList={this.props.topics}
            id={'topicList'}
            dragClassName="left-menu_draggable-topic"
            draggedItemProps={{ origin: { topicId: this.props.topicId } }}
            dragPreview={topic => <LeftMenuTopicRow topic={topic} />}
            dropClassName="left-menu_content-list subtopics-list"
            dropZoneProps={{ topicId: this.props.topicId }}
            itemType={dragItemTypes.TOPIC_LEFT_MENU}
            onDropItem={this.props.moveOrCopyTopicInOrToTopicFromDragAndDrop}
            renderItem={topic => (
              <ConnectedLeftMenuTopicSection
                baseUrl={this.props.baseUrl}
                level={this.props.level + 1}
                topicId={topic.id}
              />
            )}
          >
            <DMLoader
              dataRequirements={
                this.props.topic
                  ? { subtopicsForTopic: { topicId: this.props.topicId } }
                  : { topics: {} }
              }
              loaderKey="topics"
            />
            {!this.props.topics.length && (
              <div className="left-menu_subtopics-placeholder">No yays</div>
            )}
          </GenericDragDropListing>
        )}
      </div>
    );
  }
}

function mapState(state, props) {
  const sm = stateMappings(state);

  return {
    selectedTopicId: sm.page.topicId,
    topic: sm.topics[props.topicId] || null,
    topics: getSortedFilteredTopicsByParentTopic(state)[props.topicId] || []
  };
}

const mapDispatch = {
  moveOrCopyTopicInOrToTopicFromDragAndDrop,
  setLeftSubtopicMenuOpenForTopic
};

const ConnectedLeftMenuTopicSection = connect(
  mapState,
  mapDispatch
)(LeftMenuTopicSection);

export default ConnectedLeftMenuTopicSection;
