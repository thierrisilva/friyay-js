import { any, func } from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import TopicsListDropdown from 'Components/shared/topics_list_dropdown';
import {
  moveTopicContents,
  removeTopicAndMoveContent
} from 'Src/newRedux/database/topics/thunks';
import { setSelectTopicDestinationModalOpen } from 'Src/newRedux/interface/modals/actions';
import { stateMappings } from 'Src/newRedux/stateMappings';

const actionButtonLabels = {
  archive: 'Archive yay and move content',
  delete: 'Delete yay and move content',
  move: 'Move content'
};

const componentClassName = 'topic-select-destination-page';

class TopicSelectDestinationPage extends Component {
  static propTypes = {
    mode: any,
    topic: any,
    moveTopicContents: func,
    removeTopicAndMoveContent: func,
    setSelectTopicDestinationModalOpen: func
  };

  handleActionButtonClick = selectedTopics => {
    switch (this.props.mode) {
      case 'archive':
        break;
      case 'delete': {
        const destinationTopicId = selectedTopics[0].id;
        const topicId = this.props.topic.id;

        return this.props.removeTopicAndMoveContent(
          topicId,
          destinationTopicId
        );
      }
      case 'move': {
        const destinationTopicId = selectedTopics[0].id;
        const topicId = this.props.topic.id;

        return this.props.moveTopicContents({ destinationTopicId, topicId });
      }
    }
  };

  handleOverlayClick = e => {
    const targetClassName = e.nativeEvent.target.className;
    const isOverlayClick = targetClassName.indexOf(componentClassName) !== -1;

    if (isOverlayClick) {
      this.props.setSelectTopicDestinationModalOpen(null, false, null);
    }
  };

  render() {
    const { mode, topic } = this.props;
    const className = `open ${componentClassName}`;

    return (
      topic && (
        <div className={className} onClick={this.handleOverlayClick}>
          <TopicsListDropdown
            actionButtonLabel={actionButtonLabels[mode]}
            actionButtonHandler={this.handleActionButtonClick}
            actionButtonClass="btn-primary"
            hasInput
            path={topic.attributes.path}
            startAt={topic.id}
            isRequired
          />
        </div>
      )
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);
  const displaySelectTopicDestinationModal =
    sm.modals.displaySelectTopicDestinationModal;

  return {
    mode: displaySelectTopicDestinationModal.mode,
    topic: sm.topics[displaySelectTopicDestinationModal.topicId] || null
  };
};

const mapDispatch = {
  moveTopicContents,
  removeTopicAndMoveContent,
  setSelectTopicDestinationModalOpen
};

export default connect(
  mapState,
  mapDispatch
)(TopicSelectDestinationPage);
