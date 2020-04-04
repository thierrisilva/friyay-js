/* global vex */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import TopicItemNew from './topic_item_new';
import TopicItem from './topic_item';
import TopicNewItemEdit from './topic_new_item_edit';
import tiphive from 'Lib/tiphive';
import { compose, toLower, replace, path, sortBy } from 'ramda';

const sortByTitleCaseInsensitive = sortBy(
  compose(
    toLower,
    replace(/[^a-zA-Z0-9 ]/g, ''),
    path(['attributes', 'title'])
  )
);

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { deleteTopic, deleteTopicAndMove } from 'Actions/topic';

const MIN_QUANTITY = 7; // Placeholder + 5 + 5 (two rows)

class TopicHexGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isHidden: true,
      newTopics: [],
      subtopicToDelete: null
    };
  }

  handleMoreClick = () => {
    this.setState({
      isHidden: !this.state.isHidden
    });
  };

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

  handleTopicCreated = topicId => {
    this.setState(state => ({
      ...state,
      newTopics: state.newTopics.filter(id => id !== topicId)
    }));
  };

  renderMoreLessLink = count => {
    if (count <= MIN_QUANTITY + 1) return;

    const iconClass = cx({
      fa: true,
      'fa-chevron-down': this.state.isHidden,
      'fa-chevron-up': !this.state.isHidden
    });

    return (
      <div className="more-link">
        <a
          href="javascript:void(0)"
          className="gray-link flex-c-center"
          onClick={this.handleMoreClick}
        >
          <span>{this.state.isHidden ? 'MORE' : 'LESS'}</span>
          <i className={iconClass} />
        </a>
      </div>
    );
  };

  selectSubtopicDelete = subtopicToDelete => {
    this.setState({ subtopicToDelete });
  };

  handleTopicDelete = e => {
    e.preventDefault();

    vex.dialog.confirm({
      message: 'Are you sure you want to delete this yay?',
      callback: value => {
        if (value) {
          this.props.deleteTopic(this.state.subtopicToDelete, true);
        }
      }
    });
  };

  handleTopicDeleteAndMove = selectedTopics => {
    const topicIDs = selectedTopics.map(topic => topic.id);
    const topicID = this.state.subtopicToDelete;

    this.props.deleteTopicAndMove(topicID, topicIDs.join(','), true);
    tiphive.hidePrimaryModal();
  };

  render() {
    const {
      props: {
        handleStarSubhiveClick,
        topic,
        group,
        subtopics,
        params: { group_id = null }
      },
      state: { newTopics, isHidden }
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
      )),
      ...sortByTitleCaseInsensitive(subtopics).map((subtopic, index) => (
        <TopicItem
          currentGroupId={group_id}
          group={group}
          topic={subtopic}
          isCurrentTopic={false}
          key={`hex-subtopic-${subtopic.id}`}
          handleStarSubhiveClick={handleStarSubhiveClick}
          className={cx({
            hide: isHidden && newTopics.length + index > MIN_QUANTITY
          })}
          handleDelete={this.handleTopicDelete}
          handleMoveDelete={this.handleTopicDeleteAndMove}
          selectSubtopic={this.selectSubtopicDelete}
          dropdownHasInput={false}
        />
      ))
    ];

    return (
      <div className="hex-grid hex-grid-small">
        <div className="hex-inner-wrapper">{subtopicItems}</div>
        <div className="clearfix" />
        {this.renderMoreLessLink(newTopics.length + subtopics.length)}
      </div>
    );
  }
}

TopicHexGrid.propTypes = {
  topic: PropTypes.object,
  group: PropTypes.object,
  subtopics: PropTypes.array,
  handleStarSubhiveClick: PropTypes.func,
  deleteTopic: PropTypes.func.isRequired,
  deleteTopicAndMove: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  params: PropTypes.object
};

const mapState = store => ({
  store
});

const mapDispatch = {
  deleteTopic,
  deleteTopicAndMove
};

export default connect(
  mapState,
  mapDispatch
)(withRouter(TopicHexGrid));
