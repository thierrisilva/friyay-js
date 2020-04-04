import React, { Component } from 'react';
import PropTypes from 'prop-types';
import inflection from 'inflection';
import classNames from 'classnames';
import Ability from '../../../lib/ability';
import TopicSelectorHeader from './TopicSelectorHeader';
import TopicRow from './TopicRow';

const divStyle = {
  width: '100%',
  textAlign: 'center',
  marginTop: 30
};

class TopicSelector extends Component {
  renderRow(topic) {
    const {
      props: { topicsOf, selectedTopics, handleTopicSelect, handleTopicClick }
    } = this;

    const objectType = inflection.pluralize(topicsOf, null);
    const isSelected =
      selectedTopics.findIndex(
        selectedTopic =>
          Number.parseInt(selectedTopic.id) === Number.parseInt(topic.id)
      ) !== -1;
    const isDisabled = Ability.can('create', objectType, topic) === false;

    return (
      <TopicRow
        key={`topic-${topic.id}`}
        defaultValue={isSelected}
        selected={isSelected}
        disabled={isDisabled}
        topic={topic}
        handleTopicSelect={handleTopicSelect}
        handleTopicClick={handleTopicClick}
      />
    );
  }
  changeSearchStyle() {
    $('.selectize-input').tooltip({
      title: 'Add a yay in this field',
      placement: 'top',
      delay: { hide: 100 },
      trigger: 'focus'
    });
    $('#tip_topic_ids-selectized').focus();
    setTimeout(function() {
      $('.selectize-input').tooltip('destroy');
    }, 2000);
  }

  renderRows() {
    const {
      props: { topics, hasInput, hideAddTopicLink }
    } = this;

    let topicButton = null;

    if (topics.length === 0) {
      if (hasInput && !hideAddTopicLink) {
        topicButton = (
          <div className="add-topic-main">
            <a className="add-topic-btn" onClick={this.changeSearchStyle}>
              +Add yay
            </a>
          </div>
        );
      } else {
        topicButton = <div style={divStyle}>No yays here</div>;
      }
    } else if (!hideAddTopicLink) {
      topicButton = (
        <div className="add-topic-main">
          <a className="add-topic-btn" onClick={this.changeSearchStyle}>
            +Add yay
          </a>
        </div>
      );
    }

    return (
      <div>
        <div>{topicButton}</div>
        {topics.map(topic => this.renderRow(topic))}
      </div>
    );
  }

  render() {
    const {
      topicsOf,
      topics,
      handleTopicsScroll,
      parentPath,
      handleTopicBack,
      handleTopicClick,
      isLoading,
      isCollapsed,
      hideHeader
    } = this.props;

    if (isLoading) {
      return (
        <p className="text-center">
          <img src="/images/ajax-loader.gif" />
        </p>
      );
    }

    const selectMenuClass = classNames({
      'topics-select-menu': true,
      collapsed: isCollapsed
    });

    return (
      <div>
        <TopicSelectorHeader
          key="topic-selector-header"
          parentPath={parentPath}
          topicCount={topics.length}
          handleTopicBack={handleTopicBack}
          handleTopicClick={handleTopicClick}
          hideHeader={hideHeader}
        />

        <div
          className={selectMenuClass}
          id={topicsOf + '-topics-select-menu'}
          onScroll={handleTopicsScroll}
        >
          <ul
            className="list-group topics-select-menu-content"
            id={topicsOf + '-topics-select-menu-content'}
          >
            {this.renderRows()}
          </ul>
        </div>
      </div>
    );
  }
}

TopicSelector.propTypes = {
  isLoading: PropTypes.bool,
  handleTopicsScroll: PropTypes.func,
  topics: PropTypes.array,
  selectedTopics: PropTypes.array,
  topicsOf: PropTypes.string,
  parentPath: PropTypes.array,
  handleTopicSelect: PropTypes.func,
  handleTopicBack: PropTypes.func,
  handleTopicClick: PropTypes.func,
  hasInput: PropTypes.bool,
  isCollapsed: PropTypes.bool
};

export default TopicSelector;
