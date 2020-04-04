import React, { Component } from 'react';
import { object, func } from 'prop-types';
import { connect } from 'react-redux';

import MoreIcon from 'Components/shared/more_icon';
import tiphive from 'lib/tiphive';
import {
  starTopic,
  unstarTopic,
  deleteTopic,
  deleteTopicAndMove
} from 'Actions/topic';
import TopicsListDropdown from 'Components/shared/topics_list_dropdown';

class SubtopicActionsDropdown extends Component {
  state = {
    isOpen: false,
    showDropdown: false
  };

  static propTypes = {
    subtopic: object.isRequired,
    star: func.isRequired,
    unstar: func.isRequired,
    deleteTopic: func.isRequired,
    deleteTopicAndMove: func.isRequired
  };

  static defaultProps = {
    dropdownHasInput: true
  };

  toggle = () => {
    this.setState(prevState => {
      return { ...prevState, isOpen: !prevState.isOpen };
    });
  };

  handleDelete = e => {
    e.preventDefault();

    vex.dialog.confirm({
      message: 'Are you sure you want to delete this yay?',
      callback: value => {
        if (value) {
          this.props.deleteTopic(this.props.subtopic.attributes.title, true);
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

  starSubTopic = (id, isStarred) => {
    isStarred ? this.props.unstar(id) : this.props.star(id);
  };

  toggleDropdown = () => {
    this.setState(prevState => {
      return { ...prevState, showDropdown: !prevState.showDropdown };
    });
  };

  render() {
    const { topic, subtopic, toggleEdit, dropdownHasInput } = this.props;
    const { showDropdown, isOpen } = this.state;
    const starred_by_current_user = subtopic.starred_by_current_user;

    return (
      <div>
        <span
          className="subtopic-actions flex-r-center-center navbar-right dropdown m0"
          ref={span => (this.dropdown = span)}
        >
          <button
            className="btn btn-link topic-delete-icon"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            onClick={this.toggleDropdown}
          >
            <MoreIcon />
          </button>
          {showDropdown && (
            <ul className="dropdown-menu t30">
              <li>
                <a
                  className="black"
                  href="javascript:void(0)"
                  onClick={toggleEdit}
                >
                  Edit yay title
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  onClick={this.handleDelete}
                  className="black"
                >
                  Delete yay and all contents
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  onClick={this.toggle}
                  className="black"
                >
                  Delete yay and move contents
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  onClick={() =>
                    this.starSubTopic(subtopic.id, starred_by_current_user)
                  }
                  className="black"
                >
                  {starred_by_current_user ? 'UnStar yay' : 'Star yay'}
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  onClick={this.toggle}
                  className="black"
                >
                  Add/Change Image
                </a>
              </li>
            </ul>
          )}
        </span>

        {isOpen && (
          <div className="hex-overlay">
            <div className="overlay" onClick={this.toggle} />
            <TopicsListDropdown
              actionButtonLabel="Delete yay and Move Content"
              actionButtonHandler={this.handleTopicDeleteAndMove}
              actionButtonClass="btn-danger"
              hasInput={dropdownHasInput}
              path={subtopic.attributes.path}
              startAt={subtopic.id}
              isCollapsed
              isRequired
            />
          </div>
        )}
      </div>
    );
  }
}

const mapDispatch = {
  star: starTopic,
  unstar: unstarTopic,
  deleteTopic,
  deleteTopicAndMove
};

export default connect(
  null,
  mapDispatch
)(SubtopicActionsDropdown);
