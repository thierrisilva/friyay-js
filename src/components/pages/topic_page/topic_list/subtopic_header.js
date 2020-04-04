import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ability from 'Lib/ability';
import { connect } from 'react-redux';
import { starTopic, unstarTopic, updateSubTopicTitle } from 'Actions/topic';
import TopicUpdateFormPage from '../../topic_update_form_page';

class SubTopicHeader extends Component {
  state = {
    editMode: false,
    newTopicTitle: '',
    isTopicUpdateOpen: false
  };

  handleTopicSave = () => {
    const {
      props: { topic },
      state: { newTopicTitle }
    } = this;

    if (
      topic.attributes.title !== newTopicTitle &&
      newTopicTitle.trim() !== ''
    ) {
      this.props.updateSubTopicTitle(topic.id, newTopicTitle, true);
    }

    this.handleDisableEditMode();
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.handleTopicSave();
    } else if (e.keyCode === 27) {
      this.handleDisableEditMode(true);
    }
  };

  handleTopicBlur = () => {
    const { createMode, handleTopicUnPrepare } = this.props;
    if (createMode) {
      handleTopicUnPrepare(true);
    } else {
      this.handleTopicSave();
    }
  };

  handleEnableEditMode = () => {
    const { topic } = this.props;
    this.setState({
      editMode: true,
      newTopicTitle: topic.attributes.title
    });
  };

  handleDisableEditMode = isEsc => {
    const { createMode, handleTopicUnPrepare } = this.props;
    if (createMode) {
      handleTopicUnPrepare(isEsc);
    } else {
      this.setState({
        editMode: false
      });
    }
  };

  handleTopicChange = e => {
    const value = e.target.value;
    this.setState({
      newTopicTitle: value
    });
  };

  showInput = () => {
    const { createMode } = this.props;
    const { editMode } = this.state;
    return createMode || editMode;
  };

  renderCreateAndEditMode = () => {
    const { newTopicTitle } = this.state;
    const { createMode } = this.props;
    if (createMode) {
      return (
        <div className="subtopic__title-content list-item list-item--new">
          <input
            type="text"
            value={newTopicTitle}
            autoFocus={true}
            placeholder="Type yay Title"
            onKeyDown={this.handleKeyPress}
            onChange={this.handleTopicChange}
            onBlur={this.handleTopicBlur}
          />
          <button className="btn btn-alt btn-alt-sm">Save</button>
        </div>
      );
    } else {
      return (
        <div className="subtopic__title">
          <i className="fa fa-pencil" />
          <div className="subtopic__title-content">
            <input
              type="text"
              value={newTopicTitle}
              autoFocus={true}
              onKeyDown={this.handleKeyPress}
              onChange={this.handleTopicChange}
              onBlur={this.handleTopicBlur}
            />
          </div>
        </div>
      );
    }
  };

  handleOptionClick = option => {
    const { topic } = this.props;

    switch (option) {
      case 'Settings':
        this.setState(state => ({ ...state, isTopicUpdateOpen: true }));
        break;
      case 'Change name':
        this.handleEnableEditMode();
        break;
      case 'Star yay':
        this.props.starTopic(topic.id);
        break;
    }
  };

  renderTitle = () => {
    const { topic, collapsed, handleCollapse } = this.props;

    const topicCollapseIcon = collapsed ? 'arrow_drop_up' : 'arrow_drop_down';

    let titleContent;

    const moreOptions = ['Settings', 'Change name', 'Star yay'];

    if (this.showInput()) {
      titleContent = this.renderCreateAndEditMode();
    } else {
      titleContent = (
        <div className="subtopic__title">
          <a onClick={handleCollapse} className="btn-collapse">
            <span
              className="material-icons"
              style={{ transform: collapsed && 'rotate(90deg)' }}
            >
              {topicCollapseIcon}
            </span>
          </a>
          <div className="subtopic__title-content flex-r-center">
            <span onDoubleClick={this.handleEnableEditMode}>
              {topic.attributes.title}
            </span>
            {Ability.can('update', 'self', topic) && (
              <div className="dropdown">
                <a className="btn-settings" data-toggle="dropdown" id="dLabel">
                  <span className="material-icons ml15 more_vert">
                    more_vert
                  </span>
                </a>
                <ul className="dropdown-menu" aria-labelledby="dLabel">
                  {moreOptions.map(option => (
                    <li key={option}>
                      <a onClick={() => this.handleOptionClick(option)}>
                        {option}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    }

    return titleContent;
  };

  renderActions = () => {
    const { cards, tips } = this.props;
    const hours = tips.reduce(
      (sum, card) => sum + (card.attributes.resource_required || 0),
      0
    );

    const actionsContent = (
      <div className="subtopic__actions">
        <span>{hours} Hours</span>
        <span>{cards} Cards</span>
      </div>
    );

    if (!this.showInput()) {
      return actionsContent;
    }

    return null;
  };

  closeTopicUpdate = () =>
    this.setState(state => ({ ...state, isTopicUpdateOpen: false }));

  render() {
    const { createMode, topic } = this.props;
    if (createMode) {
      return <div className="pl15">{this.renderTitle()}</div>;
    }
    return (
      <header className="subtopic__header">
        {this.renderTitle()}
        {this.renderActions()}
        {this.state.isTopicUpdateOpen && (
          <TopicUpdateFormPage
            topic={topic}
            onClose={this.closeTopicUpdate}
            isTaskView={true}
          />
        )}
      </header>
    );
  }
}

SubTopicHeader.propTypes = {
  topic: PropTypes.object,
  handleTopicUnPrepare: PropTypes.func,
  handleCollapse: PropTypes.func,
  collapsed: PropTypes.bool,
  cards: PropTypes.number,
  tips: PropTypes.array,
  createMode: PropTypes.bool,
  starTopic: PropTypes.func.isRequired,
  unstarTopic: PropTypes.func.isRequired,
  updateSubTopicTitle: PropTypes.func.isRequired
};

function mapState({ topic: { subtopicsWithTips } }, { topic }) {
  return {
    tips: (subtopicsWithTips[topic.id] || {}).tips || []
  };
}

const mapDispatch = {
  starTopic,
  unstarTopic,
  updateSubTopicTitle
};

export default connect(
  mapState,
  mapDispatch
)(SubTopicHeader);
