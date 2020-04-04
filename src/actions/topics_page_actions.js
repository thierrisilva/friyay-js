import AppDispatcher from '../dispatchers/app_dispatcher';

var TopicsPageActions = {
  loadTopicsByPage: function(pageNumber, pageSize) {
    if (!pageNumber) {
      pageNumber = 1;
    }

    if (!pageSize) {
      pageSize = 35;
    }

    AppDispatcher.dispatch({
      actionType: 'LOAD_TOPICS_BY_PAGE',
      pageNumber: pageNumber,
      pageSize: pageSize
    });
  },

  loadTopicsByUserFollowed: function(userID, isFollowing, pageNumber, pageSize) {
    if (!pageNumber) {
      pageNumber = 1;
    }

    if (!pageSize) {
      pageSize = 35;
    }

    AppDispatcher.dispatch({
      actionType: 'LOAD_TOPICS_BY_USER_FOLLOWED',
      userID,
      isFollowing,
      pageNumber,
      pageSize
    });
  },

  followTopic: function(topicID) {
    AppDispatcher.dispatch({
      actionType: 'FOLLOW_HIVE',
      topicID: topicID
    });
  },

  unfollowTopic: function(topicID) {
    AppDispatcher.dispatch({
      actionType: 'UNFOLLOW_HIVE',
      topicID: topicID
    });
  }
};

export default TopicsPageActions;
