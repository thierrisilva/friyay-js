import AppDispatcher from '../dispatchers/app_dispatcher';

var LeftMenuTopicActions = {
  loadAll: function(groupID, filterType, userID) {
    AppDispatcher.dispatch({
      actionType: 'LEFT_MENU_TOPIC_LOAD_ALL',
      groupID: groupID,
      filterType,
      userID
    });
  },

  create: function(title, groupID) {
    AppDispatcher.dispatch({
      actionType: 'LEFT_MENU_TOPIC_CREATE',
      title: title,
      groupID: groupID
    });
  },

  starTopic: function(topicID) {
    AppDispatcher.dispatch({
      actionType: 'LEFT_MENU_STAR_HIVE',
      topicID
    });
  },

  unstarTopic: function(topicID) {
    AppDispatcher.dispatch({
      actionType: 'LEFT_MENU_UNSTAR_HIVE',
      topicID
    });
  }
};

export default LeftMenuTopicActions;
