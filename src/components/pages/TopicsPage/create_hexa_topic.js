import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CreateHexaTopic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      createMode: false,
      topicTitle: '',
      createButtonText: 'Create'
    };

    this.handleAddHive = this.handleAddHive.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTopicSubmit = this.handleTopicSubmit.bind(this);
  }

  handleTitleChange(e) {
    const value = e.target.value;
    this.setState({
      topicTitle: value
    });
  }

  handleAddHive() {
    this.setState({
      createMode: true
    });
  }

  handleTopicSubmit(e) {
    e.preventDefault();
    this.setState({
      createButtonText: 'Creating...'
    });
    this.props.handleTopicSubmit(this.state.topicTitle);
  }

  render() {
    const { createMode, topicTitle, createButtonText } = this.state;

    let hexContent;
    if (createMode) {
      hexContent = (
        <div>
          <input
            type="text"
            onChange={this.handleTitleChange}
            value={topicTitle}
            className="topic-title"
            autoFocus={true}
          />
          <button type="submit" className="btn btn-link">
            {createButtonText}
          </button>
        </div>
      );
    } else {
      hexContent = (
        <button type="button" className="btn-link" onClick={this.handleAddHive}>
          <i className="fa fa-plus fa-lg" />
          <h5>Add yay</h5>
        </button>
      );
    }

    return (
      <div className="hex create-hex">
        <div className="corner-1" />
        <div className="corner-2" />
        <div className="inner" style={{ height: '100%' }}>
          <form
            className="flex-r-center-center"
            onSubmit={this.handleTopicSubmit}
            style={{ height: '100%' }}
          >
            {hexContent}
          </form>
        </div>
      </div>
    );
  }
}

CreateHexaTopic.propTypes = {
  handleTopicSubmit: PropTypes.func
};

export default CreateHexaTopic;
