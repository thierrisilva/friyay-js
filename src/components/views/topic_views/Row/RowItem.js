import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TopicTitleLink from 'Components/shared/topics/elements/TopicTitleLink';
import TopicTitleEditor from 'Components/shared/topics/elements/TopicTitleEditor';
import { viewTopic } from 'Src/newRedux/database/topics/thunks';

class RowItem extends Component {
  static propTypes = {
    viewTopic: PropTypes.func,
    topic: PropTypes.object
  };

  state = {
    editTitle: false,
    timeoutID: null
  };

  handleToggleEditMode = () => {
    this.setState(state => ({ editTitle: !state.editTitle }));
  };

  handleTimeoutIDChange = timeoutID => {
    this.setState({ timeoutID });
  };

  getClickHandler = () => {
    const { timeoutID } = this.state;
    const { viewTopic, topic } = this.props;
    const delay = 250;
    if (!timeoutID) {
      this.handleTimeoutIDChange(
        window.setTimeout(() => {
          viewTopic({ topicSlug: topic.attributes.slug });
          this.handleTimeoutIDChange(null);
        }, delay)
      );
    } else {
      this.handleTimeoutIDChange(window.clearTimeout(timeoutID));
      this.handleToggleEditMode();
    }
  };

  render() {
    const { topic } = this.props;
    const { editTitle } = this.state;

    return (
      <div className="topic-row-item">
        {editTitle ? (
          <TopicTitleEditor
            topic={topic}
            onFinishEditing={this.handleToggleEditMode}
          />
        ) : (
          <TopicTitleLink topic={topic} onClick={this.getClickHandler} />
        )}
      </div>
    );
  }
}

const mapDispatch = {
  viewTopic
};

export default connect(
  undefined,
  mapDispatch
)(RowItem);
