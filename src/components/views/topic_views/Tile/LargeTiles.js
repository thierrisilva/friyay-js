import React, { Component } from 'react';
import { object, func, number, array } from 'prop-types';
import { connect } from 'react-redux';

import TopicTile from './TopicTile';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { createSubTopicsWithTitle } from 'actions/topic';

class LargeTiles extends Component {
  state = {
    showAddSubtopicBox: false,
    title: ''
  };

  static propTypes = {
    topic: object.isRequired,
    allTopics: array,
    selectedTopicId: number,
    createSubtopic: func.isRequired
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

  submitSubtopic = () => {
    const {
      props: { topic },
      state: { title }
    } = this;

    if (title.trim() === '') {
      this.toggleNewSubtopic();
    } else {
      this.props.createSubtopic(title, topic.id, false);
      this.toggleNewSubtopic();
    }
  };

  handleTitleChange = title => {
    this.setState({ title });
  };

  render() {
    const { topic, allTopics, selectedTopicId } = this.props;
    const { showAddSubtopicBox, title } = this.state;
    const subtopics = allTopics[
      selectedTopicId
    ].relationships.children.data.map(id => allTopics[id]);
    const listOfTopicTiles = subtopics.map(subtopic => {
      return (
        <TopicTile
          topic={topic}
          subtopic={subtopic}
          key={subtopic.id}
          isLargeTilesView
        />
      );
    });

    return (
      <div className="w100">
        <div>
          <h1>I WILL BECOME A VIEW</h1>
        </div>
        <span className="add-subtopic-btn" onClick={this.toggleNewSubtopic}>
          + Add yay
        </span>
        <div className="flex-wrap-container">
          {showAddSubtopicBox && (
            <div className="flex-item">
              <div className="img-placeholder--large" />
              <input
                type="text"
                onChange={({ target }) => this.handleTitleChange(target.value)}
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
                className="add-subtopic-input"
                autoFocus
              />
            </div>
          )}
          {listOfTopicTiles}
        </div>
      </div>
    );
  }
}

const mapDispatch = {
  createSubtopic: createSubTopicsWithTitle
};

export default connect(
  undefined,
  mapDispatch
)(LargeTiles);
