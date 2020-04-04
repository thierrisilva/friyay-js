/*global vex*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { clone } from 'underscore';
import cx from 'classnames';
import inflection from 'inflection';

import AppStore from '../../stores/app_store';
import MainFormStore from '../../stores/main_form_store';
import Ability from '../../lib/ability';
import APIRequest from '../../lib/ApiRequest';
import tiphive from '../../lib/tiphive';
import TopicsSelectMenuInput from './topics_select_menu/topics_select_menu_input';
import TopicSelector from './topics_select_menu/TopicSelector';
import { addTopics } from 'Src/newRedux/database/topics/actions';
import { stateMappings } from 'Src/newRedux/stateMappings';
import {
  normalizeTopic,
  normalizeTopics
} from 'Src/newRedux/database/topics/schema';
import { getSortedTopicArray } from 'Src/newRedux/database/topics/selectors';

class TopicsSelectMenu extends Component {
  constructor(props) {
    super();

    this.state = {
      parentID: null,
      parentTitle: null,
      parentPath: [],
      topics: [],
      isLoadingTopics: true,
      selectedTopics: props.selectedTopics,
      shouldReloadTopics: false,
      query: null,
      hideTopicSelector: props.hideTopicSelector
    };

    this.handleTopicsScroll = this.handleTopicsScroll.bind(this);
    this.handleTopicSelect = this.handleTopicSelect.bind(this);
    this.handleTopicBack = this.handleTopicBack.bind(this);
    this.handleTopicClick = this.handleTopicClick.bind(this);
    this.handleTopicRemove = this.handleTopicRemove.bind(this);
    this.handleTopicAdd = this.handleTopicAdd.bind(this);
    this.handleTopicsFilter = this.handleTopicsFilter.bind(this);
    this.clearSearchQuery = this.clearSearchQuery.bind(this);
    this.handleActionClick = this.handleActionClick.bind(this);
  }

  componentDidMount() {
    const {
      props: { topicsOf, path, startAt, domain }
    } = this;
    const ELEM_SCROLL_EVENT = topicsOf + '-topics-select-menu-scroll';
    let {
      state: { parentID, parentTitle, parentPath }
    } = this;

    if (startAt !== null) {
      const isRoot = path.length === 1;

      if (isRoot) {
        parentID = null;
        parentTitle = path[0].title;
        parentPath = [];
      } else {
        const index = path.findIndex(
          item => Number.parseInt(item.id) === Number.parseInt(startAt)
        );

        const parent = path[index - 1];
        if (!!parent) {
          parentID = parent.id;
          parentTitle = parent.title;
          parentPath = path.slice(0, index);
        } else {
          parentID = null;
          parentTitle = path[0].title;
          parentPath = [];
        }
      }

      this.setState({
        parentID,
        parentTitle,
        parentPath
      });

      this.reloadTopics(null, parentID);
    } else {
      APIRequest.get({
        resource: 'topics',
        domain,
        data: {
          with_permissions: true,
          parent_id: null,
          page: {
            size: 999
          }
        }
      }).done(({ data }) => {
        //NOTE: This temp solution to ensure redux knows about the topics that might be selected until we can rebuild
        //TODO: Rebuild component to use newRedux
        this.props.addTopics(normalizeTopics({ data: { data } }).topics);

        this.setState({
          topics: data.filter(
            topic => Number.parseInt(topic.id) !== Number.parseInt(startAt)
          ),
          isLoadingTopics: false
        });
      });
    }

    AppStore.addEventListener(ELEM_SCROLL_EVENT, this.onTopicsScrollEnd);
  }

  componentWillUnmount() {
    const {
      props: { topicsOf }
    } = this;
    const ELEM_SCROLL_EVENT = topicsOf + '-topics-select-menu-scroll';

    AppStore.removeEventListener(ELEM_SCROLL_EVENT, this.onTopicsScrollEnd);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextStateString = JSON.stringify(nextState);
    const currentStateString = JSON.stringify(this.state);
    return (
      nextStateString !== currentStateString ||
      this.state.hideTopicSelector !== nextProps.hideTopicSelector
    ); // <-- wat
  }

  componentDidUpdate() {
    const hideTopicSelector = this.props.hideTopicSelector;
    if (this.state.hideTopicSelector !== hideTopicSelector) {
      this.setState({ hideTopicSelector });
    }
  }

  handleTopicBack(e) {
    e.preventDefault();

    const {
      state: { parentPath }
    } = this;
    if (parentPath.length > 0) {
      parentPath.pop();
    }

    const parentID = (parentPath[parentPath.length - 1] || {}).id || null;
    const parentTitle = (parentPath[parentPath.length - 1] || {}).title || null;

    this.setState({
      query: null,
      parentID,
      parentTitle,
      parentPath,
      isLoadingTopics: true
    });

    this.reloadTopics(null, parentID);
  }

  handleTopicClick(chosenTopic, e) {
    e.preventDefault();

    if (chosenTopic.attributes) {
      chosenTopic.title = chosenTopic.attributes.title;
      chosenTopic.kind = chosenTopic.attributes.kind;
    }

    const parentID = chosenTopic.id;
    const parentKind = chosenTopic.kind;
    const parentTitle = chosenTopic.title;
    const parent = { id: parentID, title: parentTitle, kind: parentKind };

    if (parentID && parentTitle) {
      const {
        state: { parentPath }
      } = this;
      const pathLength = parentPath.length;
      let shouldPush = true;
      let stopPos = pathLength;

      for (let i = 0; i < pathLength; i++) {
        const curPath = parentPath[i];
        if (curPath.id === parentID) {
          shouldPush = false;
          stopPos = i + 1;
          break;
        }
      }

      const numPathToPop = pathLength - stopPos;
      if (numPathToPop > 0) {
        for (let j = pathLength; j > stopPos; j--) {
          parentPath.pop();
        }
      }

      if (shouldPush) {
        parentPath.push(parent);
      }

      const shouldReloadTopic = stopPos !== pathLength;

      this.setState({
        query: null,
        parentID,
        parentTitle,
        parentPath,
        isLoadingTopics: shouldReloadTopic,
        shouldReloadTopic
      });
    }

    this.reloadTopics(null, parentID);
  }

  handleTopicSelect(chosenTopic, e) {
    e.preventDefault();

    const {
      id,
      attributes: { title, slug, kind },
      relationships: { masks, abilities }
    } = chosenTopic;

    // FUTURE USE: we may want to add something to the titles
    // title = kind === 'Subtopic' ? '../' + title : title;

    const topic = { id, title, slug, kind };
    const objectType = inflection.pluralize(this.props.topicsOf, null);
    const selectingTopic = {
      id,
      type: 'topics',
      relationships: { masks: clone(masks), abilities: clone(abilities) }
    };

    if (id && title) {
      const {
        props: { multiple },
        state: { selectedTopics }
      } = this;
      let newTopics = [];
      let shouldAdd = true;
      let shouldRemove = false;

      if (multiple) {
        const isSelected =
          selectedTopics.findIndex(
            selectedTopic =>
              Number.parseInt(selectedTopic.id) === Number.parseInt(topic.id)
          ) !== -1;

        shouldAdd = !isSelected;
        shouldRemove = isSelected;
      } else if (
        selectedTopics.findIndex(
          selectedTopic => selectedTopic.id === topic.id
        ) !== -1
      ) {
        shouldRemove = true;
      }

      if (Ability.can('create', objectType, selectingTopic) === false) {
        APIRequest.showErrorMessage(
          'This yay is locked from creating ' + objectType
        );

        shouldAdd = false;
      }

      if (shouldAdd) {
        newTopics = [...selectedTopics, topic];
      }

      if (shouldRemove) {
        newTopics = selectedTopics.filter(
          selectedTopic => selectedTopic.id !== topic.id
        );
      }

      this.setState({
        selectedTopics: newTopics
      });

      if (this.props.skipConfirmation) {
        this.props.actionButtonHandler(newTopics);
      }
    }
  }

  addTopic(topic) {}

  emptySelectedTopics() {}

  removeTopic(selectedTopics, topic) {
    // TODO: Find a way to stop mutating state, we need a duplicate object
    // May want to install ImmutableJS as a way to catch where we are mutating (LATER)

    this.forceUpdate();
  }

  handleTopicRemove(topicID) {
    const {
      state: { selectedTopics }
    } = this;

    this.setState({
      selectedTopics: selectedTopics.filter(topic => topic.id !== topicID)
    });
    if (this.props.skipConfirmation) {
      this.props.actionButtonHandler(this.state.selectedTopics);
    }
  }

  handleTopicAdd(title, parentID) {
    const {
      state: { selectedTopics }
    } = this;
    const { domain } = this.props;
    APIRequest.post({
      resource: 'topics',
      domain,
      data: {
        data: {
          type: 'topics',
          attributes: {
            title: title,
            parent_id: parentID
          }
        }
      }
    })
      .done(({ data, data: { id, attributes: { title } } }) => {
        //NOTE: This temp solution to ensure redux knows about the topics that might be selected until we can rebuild
        this.props.addTopics(normalizeTopic({ data: { data } }).topics);

        this.setState({
          query: null,
          parentID,
          selectedTopics: [...selectedTopics, { id, title }],
          isLoadingTopics: true,
          shouldReloadTopics: true
        });

        this.reloadTopics(null, parentID);
        MainFormStore.emitEvent(window.TOPIC_CREATE_ON_FLY_EVENT);
        APIRequest.showSuccessMessage('yay added');
      })
      .fail(xhr => {
        APIRequest.showErrorMessage(xhr.responseJSON.errors.detail);
      });
  }

  handleTopicsFilter(query, parentID) {
    this.setState({
      query: query,
      parentID: parentID,
      isLoadingTopics: true,
      shouldReloadTopics: true
    });

    this.reloadTopics(query, parentID);
  }

  handleTopicsScroll(e) {
    const {
      props: { topicsOf }
    } = this;
    tiphive.detectElemScrollEnd(
      topicsOf + '-topics-select-menu',
      topicsOf + '-topics-select-menu-content'
    );
  }

  onTopicsScrollEnd() {
    // we're loading 999 topics - let's see if it'll work first
  }

  reloadTopics = async (query, parentID) => {
    this.setState({
      topics: [],
      isLoadingTopics: true
    });

    if (parentID && parentID != '0') {
      const param = {
        resource: 'topics',
        domain: this.props.domain || '',
        data: {
          with_permissions: true,
          parent_id: parentID,
          page: {
            size: 99
          }
        }
      };
      const data = await APIRequest.get(param);
      this.props.addTopics(normalizeTopics({ data }).topics);
    }

    const topics = this.props.topics.filter(
      topic =>
        Number.parseInt(topic.id) !== Number.parseInt(this.props.startAt) &&
        topic.attributes.title.toLocaleLowerCase().includes(query || '') &&
        (parentID && parentID != '0'
          ? topic.attributes.kind == 'Subtopic' &&
            topic.attributes.path[topic.attributes.path.length - 2].id ==
              parentID
          : topic.attributes.kind == 'Hive')
    );

    this.setState({
      topics,
      isLoadingTopics: false,
      shouldReloadTopics: false
    });
  };

  clearSearchQuery(e) {
    e.preventDefault();
    this.setState({ query: null });
    this.reloadTopics(null, this.state.parentID);
  }

  handleActionClick(e) {
    e.preventDefault();

    vex.dialog.confirm({
      message: 'Are you sure?',
      callback: value => {
        if (value) {
          const selectedTopics = this.state.selectedTopics;
          const actionButtonHandler = this.props.actionButtonHandler;
          actionButtonHandler(selectedTopics);
        }
      }
    });
  }

  render() {
    const {
      state: {
        parentID,
        parentTitle,
        parentPath,
        topics,
        selectedTopics,
        isLoadingTopics,
        query,
        hideTopicSelector
      },
      props: {
        topicsOf,
        multiple,
        hasInput,
        selectTitle,
        actionButtonLabel,
        actionButtonHandler,
        actionButtonClass,
        isCollapsed,
        hideHeader,
        hideTopicsSelectMenuInput,
        inputMode,
        disallowCreate,
        hideAddTopicLink,
        skipConfirmation
      }
    } = this;

    let actionButton = null,
      buttonClass = null;
    if (actionButtonLabel && actionButtonHandler) {
      buttonClass = cx('btn', actionButtonClass, {
        disabled: selectedTopics.length <= 0
      });

      actionButton = (
        <div className="text-center">
          <a className={buttonClass} onClick={this.handleActionClick}>
            {actionButtonLabel}
          </a>
        </div>
      );
    }

    let topicsSelectMenuInput = null;
    if (hasInput) {
      topicsSelectMenuInput = (
        <TopicsSelectMenuInput
          name={topicsOf + '[topic_ids]'}
          id={topicsOf + '_topic_ids'}
          parentID={parentID}
          multiple={multiple}
          selectedTopics={selectedTopics}
          handleTopicRemove={this.handleTopicRemove}
          handleTopicAdd={this.handleTopicAdd}
          handleTopicsFilter={this.handleTopicsFilter}
          inputMode={inputMode}
          disallowCreate={disallowCreate}
          isRequired={this.props.isRequired}
          onInputFocus={this.props.onInputFocus}
          onInputBlur={this.props.onInputBlur}
        />
      );
    }

    let queryContent;
    if (query) {
      let searchPath;
      if (parentTitle) {
        searchPath = <em> in {parentTitle} </em>;
      }

      queryContent = (
        <div className="form-group query-info">
          <em>Searching for:</em> <strong>{query}</strong> {searchPath}
          <a
            href="javascript:void(0)"
            className="query-clear-link"
            onClick={this.clearSearchQuery}
          >
            clear search
          </a>
        </div>
      );
    }

    return (
      <div>
        {!hideHeader && (
          <h4>{selectTitle || 'Select yay(s) to add ' + topicsOf + ' to'}</h4>
        )}

        {!hideTopicsSelectMenuInput && topicsSelectMenuInput}

        {queryContent}

        {!hideTopicSelector && (
          <TopicSelector
            isLoading={isLoadingTopics}
            handleTopicsScroll={this.handleTopicsScroll}
            topics={topics}
            selectedTopics={selectedTopics}
            topicsOf={topicsOf}
            parentPath={parentPath}
            handleTopicSelect={this.handleTopicSelect}
            handleTopicBack={this.handleTopicBack}
            handleTopicClick={this.handleTopicClick}
            hasInput={false}
            isCollapsed={isCollapsed}
            hideHeader={hideHeader}
            hideAddTopicLink={hideAddTopicLink}
          />
        )}

        {!skipConfirmation && actionButton}
      </div>
    );
  }
}

TopicsSelectMenu.propTypes = {
  topicsOf: PropTypes.string,
  multiple: PropTypes.bool,
  hasInput: PropTypes.bool,
  stayOpen: PropTypes.bool,
  selectedTopics: PropTypes.array,
  selectTitle: PropTypes.string,
  actionButtonLabel: PropTypes.string,
  actionButtonHandler: PropTypes.func,
  actionButtonClass: PropTypes.string,
  isCollapsed: PropTypes.bool,
  startAt: PropTypes.string,
  path: PropTypes.array,
  currentUser: PropTypes.object,
  topics: PropTypes.array,
  currentTopic: PropTypes.object,
  addTopics: PropTypes.func
};

TopicsSelectMenu.defaultProps = {
  topicsOf: 'tip',
  multiple: true,
  hasInput: true,
  stayOpen: false,
  selectedTopics: [],
  selectTitle: null,
  actionButtonLabel: null,
  actionButtonHandler: null,
  actionButtonClass: 'btn-primary',
  isCollapsed: false,
  startAt: null,
  path: []
};

const mapDispatch = {
  addTopics
};

const mapState = state => {
  const sm = stateMappings(state);
  const currentTopic = sm.topics[sm.page.topicId];

  return {
    currentUser: sm.user,
    currentTopic: currentTopic,
    topics: getSortedTopicArray(state)
  };
};

export default connect(
  mapState,
  mapDispatch
)(TopicsSelectMenu);
