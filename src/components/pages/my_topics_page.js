import React from 'react';
import TopicsColumnStore from '../../stores/topics_column_store';
import TopicsColumn from './my_topics_page/topics_column';
import PageModal from './page_modal';
import createClass from 'create-react-class';

var MyTopicsPage = createClass({
  getInitialState: function() {
    return {
      topicsColumns: [<TopicsColumn key={'topic-column-0'} />]
    };
  },

  componentDidMount: function() {
    TopicsColumnStore.addEventListener(
      window.TOPIC_LOAD_EVENT,
      this.onTopicsLoad
    );
    TopicsColumnStore.loadAll();
  },

  componentWillUnmount: function() {
    TopicsColumnStore.removeEventListener(
      window.TOPIC_LOAD_EVENT,
      this.onTopicsLoad
    );
  },

  onTopicsLoad: function() {
    var topicsColumns = [];
    var loadedTopics = TopicsColumnStore.getAll();

    loadedTopics.forEach(function(v, k) {
      if (v) {
        if (k == 0) {
          topicsColumns.push(
            <TopicsColumn topics={v} key={'topic-column-0'} />
          );
        } else {
          topicsColumns.push(
            <TopicsColumn
              parentTopicID={k}
              topics={v}
              key={'topic-column-' + k}
            />
          );
        }
      }
    });

    this.setState({ topicsColumns: topicsColumns });
  },

  render: function() {
    return (
      <PageModal onClose={this.props.onClose}>
        <div className="modal-header">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 className="modal-title" id="myModalLabel">
            My yays
          </h4>
        </div>
        <div className="modal-body" id="my-topics-body">
          {this.state.topicsColumns}
        </div>
      </PageModal>
    );
  }
});

export default MyTopicsPage;
