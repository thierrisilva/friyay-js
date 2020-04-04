import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { instanceOfGetSortedTopicsForTopic } from 'Src/newRedux/database/topics/selectors';
import LeftMenuNewTopicInput from 'Components/menus/left/elements/LeftMenuNewTopicInput';
import { stateMappings } from 'Src/newRedux/stateMappings';
import DMLoader from 'Src/dataManager/components/DMLoader';

// TODO: refactor this component b/c of groups

class BreadcrumbDropdown extends Component {
  state = {
    topics: [],
    isLoadingTopics: true,
    isSubtopicFormOpen: false,
    topicTitle: '',
    isDropdownOpen: false,
    isSaving: false
  };

  handleDocClick = ev => {
    if (this.dropdownRef && !this.dropdownRef.contains(ev.target)) {
      this.handleToggleDropdownClick();
    }
  };

  handleToggleNewTopicInput = e => {
    this.setState(state => ({ displayAddTopic: !state.displayAddTopic }));
    !!e && e.stopPropagation();
    !!e && e.nativeEvent.stopImmediatePropagation();
  };

  handleNewTopicCreated = () => {
    this.setState(state => ({
      displayAddTopic: !state.displayAddTopic
    }));
    this.handleToggleDropdownClick();
  };

  handleToggleDropdownClick = () => {
    this.setState(
      {
        isDropdownOpen: !this.state.isDropdownOpen
      },
      () => {
        if (this.state.isDropdownOpen) {
          document.addEventListener('click', this.handleDocClick, false);
        } else {
          document.removeEventListener('click', this.handleDocClick, false);
        }
      }
    );
  };

  saveDropdownRef = ref => {
    this.dropdownRef = ref;
  };

  render() {
    const { parentTopicId, rootUrl, topics, topicId } = this.props;
    const { displayAddTopic, isDropdownOpen } = this.state;
    const baseUrl = rootUrl == '/' ? rootUrl : rootUrl + '/';

    return (
      <span
        className={classNames(isDropdownOpen && 'open')}
        ref={this.saveDropdownRef}
      >
        <a
          id={'dd-topic-' + parentTopicId}
          onClick={this.handleToggleDropdownClick}
        >
          <span className="caret" />
        </a>

        <ul
          className="dropdown-menu"
          aria-labelledby={'dd-topic-' + parentTopicId}
        >
          {displayAddTopic ? (
            <li>
              <LeftMenuNewTopicInput
                parentTopicId={parentTopicId}
                onDismiss={this.handleNewTopicCreated}
              />
            </li>
          ) : (
            <li>
              <a
                id={'dd-topic-' + parentTopicId}
                onClick={this.handleToggleNewTopicInput}
              >
                + Add yay
              </a>
            </li>
          )}
          {topics.map((topic, index) => (
            <li key={index}>
              <Link to={`${baseUrl}yays/${topic.attributes.slug}`}>
                {topic.attributes.title}
              </Link>
            </li>
          ))}
          {isDropdownOpen && parentTopicId && (
            <DMLoader
              dataRequirements={{
                subtopicsForTopic: { topicId: parentTopicId },
                topic: { topicId: topicId }
              }}
              loaderKey="subtopicsForTopic"
            />
          )}
        </ul>
        {/* {isSubtopicFormOpen && <SubtopicFormPage parentTopic={topic} />} */}
      </span>
    );
  }
}
//
// BreadcrumbDropdown.propTypes = {
//   path: PropTypes.object,
//   topic: PropTypes.object,
//   index: PropTypes.number,
//   save: PropTypes.func.isRequired,
//   groupId: PropTypes.string,
//   saveSub: PropTypes.func.isRequired,
//   router: PropTypes.object.isRequired,
//   parentId: PropTypes.number,
//   userId: PropTypes.string.isRequired
// };
//
// BreadcrumbDropdown.defaultProps = {
//   groupId: null,
//   parentId: null,
//   topic: null,
//   index: 0
// };

// const mapState = ({ appUser: { id } }) => ({ userId: id });
const topicSelector = instanceOfGetSortedTopicsForTopic();

const mapState = (state, props) => {
  const sm = stateMappings(state);
  return {
    page: sm.page.page,
    rootUrl: sm.page.rootUrl,
    topics: topicSelector(state, props.parentTopicId)
  };
};

export default connect(mapState)(BreadcrumbDropdown);
