import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { func, object, string } from 'prop-types';
import { updateTopic } from 'Src/newRedux/database/topics/thunks';
import FormInput from 'Components/shared/forms/FormInput';

class TopicTitleEditor extends PureComponent {
  static propTypes = {
    topic: object.isRequired,
    updateTopic: func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      topicTitle: props.topic.attributes.title
    };
  }

  handleUpdateTopic = async () => {
    const {
      state: { topicTitle },
      props: { onFinishEditing, topic, updateTopic }
    } = this;
    const attributes = { title: topicTitle };
    updateTopic({ id: topic.id, attributes });
    onFinishEditing();
  };

  handleSetTopicTitle = topicTitle => {
    this.setState({ topicTitle });
  };

  handleKeyDown = e => {
    (e.key == 'Escape' || e.keyCode == 27) && this.props.onFinishEditing();
  };

  render() {
    const { additionalClasses = '', topic } = this.props;
    const { topicTitle } = this.state;

    return (
      <FormInput
        autoFocus
        defaultValue={topicTitle}
        onChange={this.handleSetTopicTitle}
        onSubmit={this.handleUpdateTopic}
        placeholder="yay title"
        onKeyPress={this.handleKeyDown}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}

const mapDispatch = {
  updateTopic
};

export default connect(
  undefined,
  mapDispatch
)(TopicTitleEditor);
