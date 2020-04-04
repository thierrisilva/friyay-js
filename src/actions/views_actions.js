import AppDispatcher from '../dispatchers/app_dispatcher';

var ViewsPageActions = {
  loadViews: function() {
    AppDispatcher.dispatch({
      actionType: 'VIEWS_LOAD'
    });
  },

  updateTopicView: function(topicID, viewID) {
    AppDispatcher.dispatch({
      actionType: 'TOPIC_VIEW_CHANGE',
      topicID,
      viewID
    });
  },

};

export default ViewsPageActions;
