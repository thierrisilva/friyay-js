import React from 'react';
import { Link } from 'react-router-dom';

import ExplorePageActions from '../../../actions/explore_page_actions';
import LeftMenuTopicActions from '../../../actions/left_menu_topic_actions';

import AppStore from '../../../stores/app_store';
import ExplorePageStore from '../../../stores/explore_page_store';
import LeftMenuTopicStore from '../../../stores/left_menu_topic_store';

import ExploreTopicItem from './explore_topic_item';
import ExploreTopicSuggestedItem from './explore_topics_suggested_item';
import ExploreTopicItemInput from './explore_topic_item_input';
import Masonry from 'react-masonry-component';

import analytics from '../../../lib/analytics';
import APIRequest from '../../../lib/ApiRequest';
import createClass from 'create-react-class';

var ExploreTopicsContent = createClass({
  getDefaultProps: function() {
    return {
      exploreHeader: 'EXPLORE TOPICS',
      showNext: false,
      nextURL: '/',
      showInput: false,
      isModal: true
    };
  },

  getInitialState: function() {
    return {
      topics: [],
      suggestedTopics: [],
      topicsPagination: null,
      isLoadingTopics: false
    };
  },

  componentDidMount: function() {
    var _this = this;

    if (_this.props.isModal) {
      AppStore.addEventListener(window.MODAL_SCROLL_EVENT, _this.onScrollEnd);
    } else {
      AppStore.addEventListener(window.SCROLL_EVENT, _this.onScrollEnd);
    }

    ExplorePageStore.addEventListener(
      window.TOPIC_FOLLOW_EVENT,
      _this.onTopicFollow
    );
    ExplorePageStore.addEventListener(
      window.TOPICS_LOAD_EVENT,
      _this.onTopicsLoad
    );
    LeftMenuTopicStore.addEventListener(
      window.TOPIC_CREATE_EVENT,
      _this.onTopicCreate
    );

    this.setState({
      topics: [],
      isLoadingTopics: true
    });

    ExplorePageActions.loadTopicsByPage(1, null);

    if (window.isSubdomain) {
      _this.loadSuggestedTopics();
    }
  },

  componentWillUnmount: function() {
    var _this = this;

    if (_this.props.isModal) {
      AppStore.removeEventListener(
        window.MODAL_SCROLL_EVENT,
        _this.onScrollEnd
      );
    } else {
      AppStore.removeEventListener(window.SCROLL_EVENT, _this.onScrollEnd);
    }

    ExplorePageStore.removeEventListener(
      window.TOPICS_LOAD_EVENT,
      _this.onTopicsLoad
    );
    ExplorePageStore.removeEventListener(
      window.TOPIC_FOLLOW_EVENT,
      _this.onTopicFollow
    );
    LeftMenuTopicStore.removeEventListener(
      window.TOPIC_CREATE_EVENT,
      _this.onTopicCreate
    );
  },

  loadSuggestedTopics: function() {
    var _this = this;

    var $loadSuggestedTopics = APIRequest.get({
      resource: 'topics/suggested_topics'
    });

    $loadSuggestedTopics.done(function(response, status, xhr) {
      _this.setState({
        suggestedTopics: response['data']
      });
    });
  },

  onTopicsLoad: function() {
    var topics = ExplorePageStore.getTopics();
    var topicsPagination = ExplorePageStore.getTopicsPagination();

    this.setState({
      topics: topics,
      topicsPagination: topicsPagination,
      isLoadingTopics: false
    });
  },

  onScrollEnd: function() {
    var isLoadingTopics = this.state.isLoadingTopics;
    var topicsPagination = this.state.topicsPagination;

    var currentPage = topicsPagination.current_page;
    var totalPages = topicsPagination.total_pages;

    if (currentPage < totalPages && !isLoadingTopics) {
      this.setState({
        isLoadingTopics: true
      });

      ExplorePageActions.loadTopicsByPage(currentPage + 1, null);
    }
  },

  onTopicFollow: function() {
    this.setState({
      topics: [],
      isLoadingTopics: true
    });

    ExplorePageActions.loadTopicsByPage(1, null);
  },

  onTopicCreate: function() {
    this.loadSuggestedTopics();
  },

  handleFollowClick: function(e) {
    e.preventDefault();
    var $followLink = $(e.target);

    var topicID = $followLink[0].dataset.topicId;
    ExplorePageActions.followTopic(topicID);

    analytics.track('Followed yay', { id: topicID });
  },

  handleSuggestedTopicCreate: function(suggestedTopic) {
    var attributes = suggestedTopic.attributes;

    LeftMenuTopicActions.create(attributes.title, null);
  },

  render: function() {
    var _this = this;

    var topics = this.state.topics;
    var suggestedTopics = this.state.suggestedTopics;
    var isLoadingTopics = this.state.isLoadingTopics;
    var exploreHeader = this.props.exploreHeader;
    var showNext = this.props.showNext;
    var nextURL = this.props.nextURL;
    var showInput = this.props.showInput;

    var nextButton;
    if (showNext) {
      nextButton = (
        <span className="pull-right">
          <Link to={nextURL} className="btn btn-default btn-next">
            &#8594;
          </Link>
        </span>
      );
    }

    var loadingIndicator;
    if (isLoadingTopics) {
      loadingIndicator = (
        <p className="text-center">
          <img src="/images/ajax-loader.gif" />
        </p>
      );
    }

    if (!isLoadingTopics && topics.length === 0) {
      loadingIndicator = 'There are no recommended topics.';
    }

    var topicsItems = [];
    if (topics.length > 0) {
      for (var i = 0; i < topics.length; i++) {
        var topic = topics[i];
        var topicItem = (
          <ExploreTopicItem
            topic={topic}
            key={'topic-item-' + topic.id}
            handleFollowClick={this.handleFollowClick}
            handleTopicClick={this.props.handleTopicClick}
          />
        );
        topicsItems.push(topicItem);
      }
    }

    var topicInput;
    if (showInput) {
      if (window.isSubdomain && suggestedTopics.length > 0) {
        var suggestedTopicItems = suggestedTopics.slice(0, 4);
        $(suggestedTopicItems).each(function(index, suggestedTopic) {
          var suggestedTopicItem = (
            <ExploreTopicSuggestedItem
              key={'topic-suggested-item-' + suggestedTopic.id}
              suggestedTopic={suggestedTopic}
              handleSuggestedTopicCreate={_this.handleSuggestedTopicCreate}
            />
          );
          topicsItems.unshift(suggestedTopicItem);
        });
      }

      topicInput = <ExploreTopicItemInput key={'topic-item-input'} />;
      topicsItems.unshift(topicInput);
    }

    var topicItemsContent;
    if (topicsItems.length > 0) {
      topicItemsContent = (
        <Masonry
          history={this.props.history}
          location={this.props.location}
          className="items-container"
          id="topics-container"
          options={{
            itemSelector: '.topic-item',
            isFitWidth: true,
            columnWidth: 300,
            gutter: 15
          }}
        >
          {topicsItems}
          <div className="clearfix" />
        </Masonry>
      );
    }

    return (
      <div className="explore-main-content">
        <h1 className="text-center content-header">
          {exploreHeader}
          {nextButton}
        </h1>
        {topicItemsContent}
        {loadingIndicator}
      </div>
    );
  }
});

export default ExploreTopicsContent;
