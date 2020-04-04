import AppDispatcher from '../dispatchers/app_dispatcher';

var TopicsColumnActions = {
  createTopic: function(title) {
    AppDispatcher.dispatch({
      actionType: 'TOPICS_COLUMN_CREATE_TOPIC',
      title: title
    });
  }
};

export default TopicsColumnActions;
