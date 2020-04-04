import AppDispatcher from '../dispatchers/app_dispatcher';

const ExplorePageActions = {
  loadTopicsByPage: function(pageNumber, pageSize) {
    if (!pageNumber) {
      pageNumber = 1;
    }

    if (!pageSize) {
      pageSize = 15;
    }

    AppDispatcher.dispatch({
      actionType: 'LOAD_TOPICS_BY_PAGE',
      pageNumber: pageNumber,
      pageSize: pageSize
    });
  },

  followTopic: function(topicID) {
    AppDispatcher.dispatch({
      actionType: 'EXPLORE_FOLLOW_TOPIC',
      topicID: topicID
    });
  },

  loadUsersByPage: function(pageNumber, pageSize) {
    if (!pageNumber) {
      pageNumber = 1;
    }

    if (!pageSize) {
      pageSize = 15;
    }

    AppDispatcher.dispatch({
      actionType: 'LOAD_USERS_BY_PAGE',
      pageNumber: pageNumber,
      pageSize: pageSize
    });
  },

  followUser: function(userID) {
    AppDispatcher.dispatch({
      actionType: 'FOLLOW_USER',
      userID: userID
    });
  }
};

export default ExplorePageActions;
