import React from 'react';
import PropTypes from 'prop-types';
import TopicPageActions from '../../actions/topic_page_actions';
import AppStore from '../../stores/app_store';
import TopicPageStore from '../../stores/topic_page_store';
import ItemPageStore from '../../stores/item_page_store';
import MainFormStore from '../../stores/main_form_store';
import Breadcrumb from '../shared/breadcrumb';
import PageContainer from './page_container';
import ItemsContainer from '../shared/items_container';
import TopicPageContent from './topic_page/topic_page_content';
import TopicTipFormPage from './topic_tip_form_page';
import TopicUpdateFormPage from './topic_update_form_page';
import tiphive from '../../lib/tiphive';
import analytics from '../../lib/analytics';
import Ability from '../../lib/ability';

class ExploreTopicPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      group: null,
      topic: null,
      isLoadingGroup: false,
      isLoadingTopic: false,
      subtopics: [],
      isLoadingSubtopics: false,
      items: [],
      itemsPagination: null,
      isLoadingItems: false,
      isFollowingTopic: false,
      isTopicFormOpen: false
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.resetStates = this.resetStates.bind(this);
    this.openTipForm = this.openTipForm.bind(this);
    this.onGroupLoad = this.onGroupLoad.bind(this);
    this.onTopicLoad = this.onTopicLoad.bind(this);
    this.onSubtopicsLoad = this.onSubtopicsLoad.bind(this);
    this.onTopicItemsLoad = this.onTopicItemsLoad.bind(this);
    this.onItemDestroy = this.onItemDestroy.bind(this);
    this.onMainFormTipCreate = this.onMainFormTipCreate.bind(this);
    this.onTopicUpdate = this.onTopicUpdate.bind(this);
    this.onMainFormQuestionCreate = this.onMainFormQuestionCreate.bind(this);
    this.onPaginationClick = this.onPaginationClick.bind(this);
    this.onScrollEnd = this.onScrollEnd.bind(this);
    this.handleFollowClick = this.handleFollowClick.bind(this);
    this.handleTopicEditClick = this.handleTopicEditClick.bind(this);
    this.onTopicFollowChange = this.onTopicFollowChange.bind(this);
    this.isFollowingTopic = this.isFollowingTopic.bind(this);
    this.loadTopicAndData = this.loadTopicAndData.bind(this);
    this.onSubtopicRemove = this.onSubtopicRemove.bind(this);
    this.onSubtopicAdd = this.onSubtopicAdd.bind(this);
  }

  componentDidMount() {
    AppStore.addEventListener(window.ELEMENT_SCROLL_EVENT, this.onScrollEnd);

    TopicPageStore.addEventListener(window.GROUP_LOAD_EVENT, this.onGroupLoad);
    TopicPageStore.addEventListener(window.TOPIC_LOAD_EVENT, this.onTopicLoad);
    TopicPageStore.addEventListener(
      window.TOPICS_LOAD_EVENT,
      this.onSubtopicsLoad
    );
    TopicPageStore.addEventListener(
      window.ITEMS_LOAD_EVENT,
      this.onTopicItemsLoad
    );
    TopicPageStore.addEventListener(
      window.TOPIC_FOLLOW_EVENT,
      this.onTopicFollowChange
    );
    TopicPageStore.addEventListener(
      window.TOPIC_UNFOLLOW_EVENT,
      this.onTopicFollowChange
    );
    TopicPageStore.addEventListener(
      window.REMOVE_SUBTOPIC_EVENT,
      this.onSubtopicRemove
    );
    TopicPageStore.addEventListener(
      window.ADD_SUBTOPIC_EVENT,
      this.onSubtopicAdd
    );

    ItemPageStore.addEventListener(window.DESTROY_EVENT, this.onItemDestroy);

    MainFormStore.addEventListener(
      window.TOPIC_CREATE_EVENT,
      this.onTopicUpdate
    );
    MainFormStore.addEventListener(
      window.TOPIC_UPDATE_EVENT,
      this.onTopicUpdate
    );
    MainFormStore.addEventListener(
      window.TIP_CREATE_EVENT,
      this.onMainFormTipCreate
    );
    MainFormStore.addEventListener(
      window.QUESTION_CREATE_EVENT,
      this.onMainFormQuestionCreate
    );

    // $(window).bind('keyup', 'ctrl+t', this.openTipForm);
    // $(window).bind('keyup', 'ctrl+e', this.handleTopicEditClick);

    let groupID = this.props.params.group_id;
    if (groupID) {
      this.setState({ isLoadingGroup: true });
      TopicPageActions.loadGroup(groupID);
    } else {
      this.loadTopicAndData();
    }
  }

  componentWillUnmount() {
    AppStore.removeEventListener(window.ELEMENT_SCROLL_EVENT, this.onScrollEnd);

    TopicPageStore.removeEventListener(
      window.GROUP_LOAD_EVENT,
      this.onGroupLoad
    );
    TopicPageStore.removeEventListener(
      window.TOPIC_LOAD_EVENT,
      this.onTopicLoad
    );
    TopicPageStore.removeEventListener(
      window.TOPICS_LOAD_EVENT,
      this.onSubtopicsLoad
    );
    TopicPageStore.removeEventListener(
      window.ITEMS_LOAD_EVENT,
      this.onTopicItemsLoad
    );
    TopicPageStore.removeEventListener(
      window.TOPIC_FOLLOW_EVENT,
      this.onTopicFollowChange
    );
    TopicPageStore.removeEventListener(
      window.TOPIC_UNFOLLOW_EVENT,
      this.onTopicFollowChange
    );
    TopicPageStore.removeEventListener(
      window.REMOVE_SUBTOPIC_EVENT,
      this.onSubtopicRemove
    );
    TopicPageStore.removeEventListener(
      window.ADD_SUBTOPIC_EVENT,
      this.onSubtopicAdd
    );

    ItemPageStore.removeEventListener(window.DESTROY_EVENT, this.onItemDestroy);

    MainFormStore.removeEventListener(
      window.TOPIC_CREATE_EVENT,
      this.onTopicUpdate
    );
    MainFormStore.removeEventListener(
      window.TOPIC_UPDATE_EVENT,
      this.onTopicUpdate
    );
    MainFormStore.removeEventListener(
      window.TIP_CREATE_EVENT,
      this.onMainFormTipCreate
    );
    MainFormStore.removeEventListener(
      window.QUESTION_CREATE_EVENT,
      this.onMainFormQuestionCreate
    );

    // $(window).unbind('keyup', this.openTipForm);
    // $(window).unbind('keyup', this.handleTopicEditClick);
  }

  // this method is to detect URL change, and then send appropriate requests with detected changes like page or filter.
  // Be careful or it will cause infinite loops.
  componentDidUpdate(prevProps) {
    let { params, location } = this.props;

    let oldGroupID = prevProps.params.group_id;
    let newGroupID = params.group_id;

    if (newGroupID && oldGroupID !== newGroupID) {
      this.setState({ group: null });
      this.resetStates();

      TopicPageActions.loadGroup(newGroupID);
      return false;
    }

    let oldTopicID = prevProps.params.topic_id;
    let newTopicID = params.topic_id;

    let prevQuery = prevProps.location.query;
    let currQuery = location.query;

    let oldItemType = prevQuery.item_type;
    let newItemType = currQuery.item_type;

    let oldPageNumber = prevQuery.page_number;
    let newPageNumber = currQuery.page_number;

    let pageSize = currQuery.page_size;

    let oldFilterType = prevQuery.filter_type;
    let newFilterType = currQuery.filter_type;

    let oldLabelIDs = prevQuery.filter_labels;
    let newLabelIDs = currQuery.filter_labels;

    if (
      newTopicID !== oldTopicID ||
      oldPageNumber !== newPageNumber ||
      oldFilterType !== newFilterType ||
      oldLabelIDs !== newLabelIDs
    ) {
      this.resetStates();

      TopicPageActions.loadTopic(newTopicID);
      TopicPageActions.loadSubtopics(newTopicID);
      TopicPageActions.loadTopicItemsByPage(
        newGroupID,
        newTopicID,
        newItemType,
        newPageNumber,
        pageSize,
        newFilterType,
        newLabelIDs
      );
    } else if (oldItemType !== newItemType) {
      TopicPageActions.loadTopicItemsByPage(
        newGroupID,
        newTopicID,
        newItemType,
        newPageNumber,
        pageSize,
        newFilterType,
        newLabelIDs
      );
    }
  }

  resetStates() {
    this.setState({
      topic: null,
      isLoadingGroup: false,
      isLoadingTopic: false,
      subtopics: [],
      isLoadingSubtopics: false,
      items: [],
      isLoadingItems: false,
      isFollowingTopic: this.isFollowingTopic()
    });
  }

  onSubtopicRemove() {
    this.setState({
      subtopics: TopicPageStore.getSubtopics()
    });
  }

  onSubtopicAdd() {
    this.setState({
      subtopics: TopicPageStore.getSubtopics()
    });
  }

  closeTopicForm = () =>
    this.setState(state => ({ ...state, isTopicFormOpen: false }));

  openTipForm() {
    let topic = this.state.topic;

    if (topic) {
      tiphive.hideAllModals();
      this.setState(state => ({ ...state, isTopicFormOpen: true }));
      analytics.track('Add Card Clicked');
    }
  }

  onGroupLoad() {
    let group = TopicPageStore.getGroup();
    analytics.track('Team Visited', {
      id: group.id,
      title: group.attributes.title
    });

    this.setState({
      group: group,
      isLoadingGroup: false
    });

    this.loadTopicAndData();
  }

  onTopicLoad() {
    let topic = TopicPageStore.getTopic();
    analytics.track('yay Visited', {
      id: topic.id,
      title: topic.attributes.title
    });

    this.setState({
      topic: topic,
      isLoadingTopic: false,
      isFollowingTopic: this.isFollowingTopic()
    });
  }

  onSubtopicsLoad() {
    let subtopics = TopicPageStore.getSubtopics();

    this.setState({
      subtopics: subtopics,
      isLoadingSubtopics: false
    });
  }

  onTopicItemsLoad() {
    let items = TopicPageStore.getTopicItems();
    let itemsPagination = TopicPageStore.getTopicItemsPagination();

    this.setState({
      items: items,
      itemsPagination: itemsPagination,
      isLoadingItems: false
    });
  }

  onItemDestroy() {
    let { params, location } = this.props;
    let groupID = params.group_id;
    let topicID = params.topic_id;

    let currQuery = location.query;

    let browserState = window.history.state;
    let stateFilterType;
    let stateFilterLabels;
    if (browserState) {
      stateFilterType = browserState.filter_type;
      stateFilterLabels = browserState.filter_labels;
    }

    let pageSize = currQuery.page_size;
    let filterType = stateFilterType || currQuery.filter_type;
    let labelIDs = stateFilterLabels || currQuery.filter_labels;

    this.setState({
      isLoadingItems: true
    });

    TopicPageActions.loadTopicItemsByPage(
      groupID,
      topicID,
      'tips',
      1,
      pageSize,
      filterType,
      labelIDs
    );
  }

  onMainFormTipCreate() {
    let { params, location } = this.props;
    let groupID = params.group_id;
    let topicID = params.topic_id;

    let currQuery = location.query;

    let browserState = window.history.state;
    let stateFilterType;
    let stateFilterLabels;
    if (browserState) {
      stateFilterType = browserState.filter_type;
      stateFilterLabels = browserState.filter_labels;
    }

    let pageSize = currQuery.page_size;
    let filterType = stateFilterType || currQuery.filter_type;
    let labelIDs = stateFilterLabels || currQuery.filter_labels;

    this.setState({
      isLoadingItems: true
    });

    TopicPageActions.loadTopicItemsByPage(
      groupID,
      topicID,
      'tips',
      1,
      pageSize,
      filterType,
      labelIDs
    );
  }

  onTopicUpdate(response) {
    let topic = response.data;

    this.setState({
      topic: topic
    });

    if (topic) {
      tiphive.hideAllModals();

      this.props.router.push('/yays/' + topic.attributes.slug);
    }
  }

  onMainFormQuestionCreate() {
    let { params, location } = this.props;
    let groupID = params.group_id;
    let topicID = params.topic_id;

    let currQuery = location.query;

    let browserState = window.history.state;
    let stateFilterType;
    let stateFilterLabels;
    if (browserState) {
      stateFilterType = browserState.filter_type;
      stateFilterLabels = browserState.filter_labels;
    }

    let pageSize = currQuery.page_size;
    let filterType = stateFilterType || currQuery.filter_type;
    let labelIDs = stateFilterLabels || currQuery.filter_labels;

    this.setState({
      isLoadingItems: true
    });

    TopicPageActions.loadTopicItemsByPage(
      groupID,
      topicID,
      'questions',
      1,
      pageSize,
      filterType,
      labelIDs
    );
  }

  onPaginationClick(nextPage) {
    let topicID = this.props.params.topic_id;
    let itemType = this.props.location.query.item_type;
    let pageNumber = parseInt(nextPage);

    if (!itemType) {
      itemType = 'tips';
    }

    this.props.router.push(
      '/yays/' +
        topicID +
        '?item_type=' +
        itemType +
        '&page_number=' +
        pageNumber
    );
  }

  onScrollEnd() {
    let { params, location } = this.props;
    let { isLoadingItems, itemsPagination } = this.state;

    if (itemsPagination) {
      let currentPage = itemsPagination.current_page;
      let totalPages = itemsPagination.total_pages;

      let groupID = params.group_id;
      let topicID = params.topic_id;

      let currQuery = location.query;

      let browserState = window.history.state;
      let stateFilterType;
      let stateFilterLabels;
      if (browserState) {
        stateFilterType = browserState.filter_type;
        stateFilterLabels = browserState.filter_labels;
      }

      let itemType = currQuery.item_type;
      let pageSize = currQuery.page_size;
      let filterType = stateFilterType || currQuery.filter_type;
      let labelIDs = stateFilterLabels || currQuery.filter_labels;

      if (currentPage < totalPages && !isLoadingItems) {
        this.setState({
          isLoadingItems: true
        });

        TopicPageActions.loadTopicItemsByPage(
          groupID,
          topicID,
          itemType,
          currentPage + 1,
          pageSize,
          filterType,
          labelIDs
        );
      }
    }
  }

  handleFollowClick(e) {
    e.preventDefault();
    let topic = this.state.topic;
    let isFollowingTopic = this.isFollowingTopic();

    if (isFollowingTopic) {
      vex.dialog.confirm({
        message: 'Are you sure you want to unfollow this topic?',
        callback(value) {
          if (value) {
            TopicPageActions.unfollowTopic(topic.id);
            analytics.track('Unfollowed yay', {
              id: topic.id,
              title: topic.attributes.title
            });
          }
        }
      });
    } else {
      TopicPageActions.followTopic(topic.id);
      analytics.track('Followed yay', {
        id: topic.id,
        title: topic.attributes.title
      });
    }
  }

  closeTopicUpdate = () =>
    this.setState(state => ({ ...state, isTopicUpdateOpen: false }));

  handleTopicEditClick(e) {
    e.preventDefault();
    let topic = this.state.topic;

    if (topic && Ability.can('update', 'self', topic)) {
      tiphive.hideAllModals();
      this.setState(state => ({ ...state, isTopicUpdateOpen: true }));
    }
  }

  onTopicFollowChange() {
    this.loadTopicAndData();
  }

  isFollowingTopic() {
    let topic = this.state.topic;
    if (!topic) {
      return false;
    }

    let relationships = topic.relationships;
    let userFollowers = relationships.user_followers.data;
    let _isFollowingTopic = false;

    $.each(userFollowers, (index, userFollower) => {
      if (parseInt(window.currentUser.id) === parseInt(userFollower.id)) {
        _isFollowingTopic = true;
      }
    });

    return _isFollowingTopic;
  }

  loadTopicAndData() {
    let { params, location } = this.props;
    let groupID = params.group_id;
    let topicID = params.topic_id;

    let currQuery = location.query;

    let { state } = window.history;

    let itemType = currQuery.item_type;
    let pageNumber = currQuery.page_number;
    let pageSize = currQuery.page_size;
    let filterType = state.filter_type || currQuery.filter_type;
    let labelIDs = state.filter_labels || currQuery.filter_labels;

    this.resetStates();
    this.setState({
      isLoadingTopic: true,
      isLoadingSubtopics: true,
      isLoadingItems: true
    });

    TopicPageActions.loadTopic(topicID);
    TopicPageActions.loadSubtopics(topicID);
    TopicPageActions.loadTopicItemsByPage(
      groupID,
      topicID,
      itemType,
      pageNumber,
      pageSize,
      filterType,
      labelIDs
    );
  }

  render() {
    let {
      group,
      topic,
      items,
      subtopics,
      isLoadingGroup,
      isLoadingTopic,
      isLoadingSubtopics,
      isLoadingItems,
      itemsPagination,
      isTopicFormOpen,
      isTopicUpdateOpen
    } = this.state;

    let { router, location, params } = this.props;

    let topicContent;
    if (topic) {
      let isFollowingTopic = this.isFollowingTopic();

      topicContent = (
        <TopicPageContent
          history={router}
          location={this.props.location}
          group={group}
          topic={topic}
          subtopics={subtopics}
          items={items}
          isLoadingGroup={isLoadingGroup}
          isLoadingTopic={isLoadingTopic}
          isLoadingSubtopics={isLoadingSubtopics}
          isLoadingItems={isLoadingItems}
          itemsPagination={itemsPagination}
          onPaginationClick={this.onPaginationClick}
          isFollowingTopic={isFollowingTopic}
          handleFollowClick={this.handleFollowClick}
          handleTopicEditClick={this.handleTopicEditClick}
        />
      );
    } else if (group) {
      topicContent = (
        <div className="topic-page">
          <Breadcrumb />

          <ItemsContainer
            history={router}
            location={location}
            items={items}
            group={group}
            isLoadingItems={isLoadingItems}
          />
        </div>
      );
    }

    return (
      <PageContainer
        history={router}
        location={location}
        params={params}
        group={group}
        topic={topic}
      >
        {topicContent}
        {isTopicFormOpen && (
          <TopicTipFormPage topic={topic} onClose={this.closeTopicForm} />
        )}
        {isTopicUpdateOpen && (
          <TopicUpdateFormPage topic={topic} onClose={this.closeTopicUpdate} />
        )}
      </PageContainer>
    );
  }
}

ExploreTopicPage.propTypes = {
  params: PropTypes.object,
  router: PropTypes.object,
  location: PropTypes.object
};

export default ExploreTopicPage;
