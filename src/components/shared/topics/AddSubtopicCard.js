import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import set from 'lodash/set';
import PropTypes from 'prop-types';
import LoadingIndicator from 'Components/shared/LoadingIndicator';
import FormInput from 'Components/shared/forms/FormInput';
import { createTopic } from 'Src/newRedux/database/topics/thunks';

class AddSubtopicCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      topicTitle: '',
      inInputMode: props.inInputMode,
      isSaving: false
    };
  }

  componentDidMount() {
    if (this.props.inInputMode) {
      window.addEventListener('keydown', this.handleKeyDown, true);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.inInputMode !== prevProps.inInputMode) {
      this.handleToggleInputMode();
    }
  }

  handleCreateSubtopic = async () => {
    const {
      state: { topicTitle },
      props: {
        createTopic,
        newTopicAttributes,
        newTopicRelationships,
        parentTopicId = null
      }
    } = this;
    this.setState({ isSaving: true });
    const attributes = {
      ...newTopicAttributes,
      title: topicTitle,
      parent_id: parentTopicId
    };
    const relationships = { ...newTopicRelationships };
    parentTopicId && set(relationships, 'parent.data', parentTopicId);
    const newTopic = await createTopic({ attributes, relationships });
    this.setState({ topicTitle: '', isSaving: false });
    this.handleToggleInputMode();
    this.props.afterTopicCreated &&
      this.props.afterTopicCreated(newTopic.data.data.id);
    this.props.onDismiss && this.props.onDismiss();
  };

  handleSetSubtopicTitle = topicTitle => {
    this.setState({ topicTitle });
  };

  handleToggleInputMode = () => {
    this.state.inInputMode
      ? window.removeEventListener('keydown', this.handleKeyDown, true)
      : window.addEventListener('keydown', this.handleKeyDown, true);
    this.setState(state => ({ inInputMode: !state.inInputMode }));
  };

  handleKeyDown = e => {
    if (e.key == 'Escape' || e.keyCode == 27) {
      this.handleToggleInputMode();
      this.props.onDismiss && this.props.onDismiss();
    }
  };

  render() {
    const { containerClassName, addTopicUI } = this.props;
    const { topicTitle, inInputMode, isSaving } = this.state;

    const content = (
      <div className="add-subtopic-card_content">
        {isSaving && <LoadingIndicator />}
        {addTopicUI && (
          <a
            className="dark-grey-link w400"
            onClick={this.handleToggleInputMode}
          >
            {addTopicUI}
          </a>
        )}

        {!isSaving && inInputMode && (
          <div className="add-sub-topic-input-wrapper">
            <FormInput
              autoFocus
              defaultValue={topicTitle}
              onChange={this.handleSetSubtopicTitle}
              onSubmit={this.handleCreateSubtopic}
              placeholder="yay title"
            />
            <div className="add-sub-topic-input-footer">
              <p>hit enter to create</p>
              <a onClick={this.handleCreateCard}>Create</a>
            </div>
          </div>
        )}
      </div>
    );

    return containerClassName ? (
      <div className={containerClassName}>{content}</div>
    ) : (
      content
    );
  }
}

const mapDispatch = {
  createTopic
};

export default connect(
  undefined,
  mapDispatch
)(AddSubtopicCard);
