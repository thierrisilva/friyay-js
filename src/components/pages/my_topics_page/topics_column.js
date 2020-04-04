import React from 'react';
import createClass from 'create-react-class';
import TopicsColumnActions from '../../../actions/topics_column_actions';
import TopicsColumnStore from '../../../stores/topics_column_store';
import TopicsColumnItem from './topics_column_item';
import TopicsColumnInput from './topics_column_input';

var TopicsColumn = createClass({
  getInitialProps: function() {
    return {
      parentTopicID: null,
      selectedTopicID: null
    };
  },

  getInitialState: function() {
    return {
      isLoadingTopics: false,
      isAddingTopic: false
    };
  },

  handleTopicAddClick: function(e) {
    e.preventDefault();

    this.setState({ isAddingTopic: true });
  },

  handleTopicsColumnItemClick: function(e) {
    e.preventDefault();
    var $selectedLink = $(e.target);

    var selectedTopicID = $selectedLink[0].dataset.topicId;
    this.setState({ selectedTopicID: selectedTopicID });

    TopicsColumnStore.loadAllByParentID(selectedTopicID);
  },

  handleTopicCreateSubmit: function(e) {
    e.preventDefault();
    var $menuTopicForm = $(e.target);

    var topicTitle = $menuTopicForm
      .find('#topic_title')
      .val()
      .trim();
    TopicsColumnActions.createTopic(topicTitle);
  },

  render: function() {
    var topicsLoading;
    if (this.state.isLoadingTopics) {
      topicsLoading = (
        <li className="list-group-item">
          <img src="/images/ajax-loader.gif" />
        </li>
      );
    }

    var topics = this.props.topics;
    var topicItems = [];

    for (var key in topics) {
      topicItems.push(
        <TopicsColumnItem
          key={key}
          topic={topics[key]}
          handleTopicsColumnItemClick={this.handleTopicsColumnItemClick}
        />
      );
    }

    var topicInput = (
      <li className="list-group-item">
        <a href="javascript:void(0)" onClick={this.handleTopicAddClick}>
          + Add yay
        </a>
      </li>
    );
    if (this.state.isAddingTopic) {
      topicInput = (
        <TopicsColumnInput
          handleTopicCreateSubmit={this.handleTopicCreateSubmit}
        />
      );
    }

    return (
      <div className="topics-column">
        <ul className="list-group">
          {topicInput}
          {topicsLoading}
          {topicItems}
        </ul>
      </div>
    );
  }
});

export default TopicsColumn;
