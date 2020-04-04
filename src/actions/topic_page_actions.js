import AppDispatcher from '../dispatchers/app_dispatcher';

const TopicPageActions = {
  loadGroup: groupID =>
    AppDispatcher.dispatch({
      actionType: 'LOAD_GROUP',
      groupID
    }),

  loadTopic: topicID => 
    AppDispatcher.dispatch({
      actionType: 'LOAD_TOPIC',
      topicID
    }),

  loadSubtopics: (topicID, groupID) => 
    AppDispatcher.dispatch({
      actionType: 'LOAD_SUBTOPICS',
      topicID,
      groupID
    }),

  loadTopicItemsByPage: (groupID, topicID, itemType, pageNumber = 1, pageSize = window.ITEMS_PER_PAGE, filterType, labelIDs) => 
    AppDispatcher.dispatch({
      actionType: 'LOAD_TOPIC_ITEMS_BY_PAGE',
      topicID: topicID,
      groupID: groupID,
      itemType: itemType,
      pageNumber: parseInt(pageNumber),
      pageSize: parseInt(pageSize),
      filterType: filterType,
      labelIDs: labelIDs
    }),

  removeItem: itemId =>
    AppDispatcher.dispatch({
      actionType: 'REMOVE_TOPIC_ITEM',
      itemId
    }),

  followTopic: topicID =>
    AppDispatcher.dispatch({
      actionType: 'FOLLOW_TOPIC',
      topicID: topicID
    }),

  unfollowTopic: topicID =>
    AppDispatcher.dispatch({
      actionType: 'UNFOLLOW_TOPIC',
      topicID: topicID
    }),

  starTopic: topicID => 
    AppDispatcher.dispatch({
      actionType: 'STAR_TOPIC',
      topicID: topicID
    }),

  unstarTopic: topicID =>
    AppDispatcher.dispatch({
      actionType: 'UNSTAR_TOPIC',
      topicID: topicID
    }),

  removeSubtopic: topicID =>
    AppDispatcher.dispatch({
      actionType: 'REMOVE_SUBTOPIC',
      topicID
    }),

  addSubtopic: topic =>
    AppDispatcher.dispatch({
      actionType: 'ADD_SUBTOPIC',
      topic
    }),

  updateSubtopic: (id, title) =>
    AppDispatcher.dispatch({
      actionType: 'UPDATE_SUBTOPIC',
      id,
      title
    }),
  onTaskLabelFilterClose: () =>
    AppDispatcher.dispatch({
      actionType: 'TASK_LABEL_FILTER_CLOSE'
    })
};

export default TopicPageActions;
