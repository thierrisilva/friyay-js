import AppDispatcher from '../dispatchers/app_dispatcher';

var MainFormActions = {
  createTip: function(
    title,
    body,
    expiredAt,
    topicIDs,
    sharingItemIDs,
    attachmentIDs,
    labelsIDs
  ) {
    AppDispatcher.dispatch({
      actionType: 'CREATE_TIP',
      title: title,
      body: body,
      expiredAt: expiredAt,
      topicIDs: topicIDs,
      sharingItemIDs: sharingItemIDs,
      attachmentIDs: attachmentIDs,
      labelIDs: labelsIDs
    });
  },

  createTopic: function(
    title,
    description,
    sharingItemIDs,
    adminUserIDs,
    topicPermissionData,
    domain
  ) {
    AppDispatcher.dispatch({
      actionType: 'CREATE_TOPIC',
      title: title,
      description: description,
      sharingItemIDs: sharingItemIDs,
      adminUserIDs: adminUserIDs,
      topicPermissionData: topicPermissionData,
      domain
    });
  },

  updateTopic: function(
    topicID,
    title,
    description,
    sharingItemIDs,
    adminUserIDs,
    topicPermissionData,
    fromTaskList
  ) {
    AppDispatcher.dispatch({
      actionType: 'UPDATE_TOPIC',
      topicID: topicID,
      title: title,
      description: description,
      sharingItemIDs: sharingItemIDs,
      adminUserIDs: adminUserIDs,
      topicPermissionData: topicPermissionData,
      fromTaskList
    });
  },

  updateTopicTitle: function(topicID, title, fromTaskList) {
    AppDispatcher.dispatch({
      actionType: 'UPDATE_TOPIC_TITLE',
      topicID: topicID,
      title: title,
      fromTaskList
    });
  },

  deleteTopic: function(topicID, fromTaskList) {
    AppDispatcher.dispatch({
      actionType: 'DELETE_TOPIC',
      topicID: topicID,
      fromTaskList
    });
  },

  deleteTopicAndMove: function(topicID, newTopicID) {
    AppDispatcher.dispatch({
      actionType: 'DELETE_TOPIC_AND_MOVE',
      topicID: topicID,
      newTopicID: newTopicID
    });
  },

  moveTopic: function(topicID, newTopicID, newTopicSlug) {
    AppDispatcher.dispatch({
      actionType: 'MOVE_TOPIC',
      topicID: topicID,
      newTopicID: newTopicID,
      newTopicSlug: newTopicSlug
    });
  },

  createSubtopic: function(
    title,
    description,
    sharingItemIDs,
    parentID,
    fromTaskList,
    fromLeftSubtopicMenu,
    fromTopicsGrid
  ) {
    AppDispatcher.dispatch({
      actionType: 'CREATE_SUBTOPIC',
      title,
      description,
      sharingItemIDs,
      parentID,
      fromTaskList,
      fromLeftSubtopicMenu,
      fromTopicsGrid
    });
  },

  createSubtopicWithTitle: (title, parentID) => {
    AppDispatcher.dispatch({
      actionType: 'CREATE_SUBTOPIC_WITH_TITLE',
      title,
      parentID
    });
  },

  createSubtopicWithTitleInSubtopicMenu: (title, parentID) => {
    AppDispatcher.dispatch({
      actionType: 'CREATE_SUBTOPIC_WITH_TITLE_IN_SUBTOPIC_MENU',
      title,
      parentID
    });
  },

  deleteSubtopic: function(topicID) {
    AppDispatcher.dispatch({
      actionType: 'DELETE_SUBTOPIC',
      topicID
    });
  },

  deleteSubtopicAndMove: function(topicID, newTopicID) {
    AppDispatcher.dispatch({
      actionType: 'DELETE_SUBTOPIC_AND_MOVE',
      topicID,
      newTopicID
    });
  },

  createQuestion: function(title, body, topicIDs) {
    AppDispatcher.dispatch({
      actionType: 'CREATE_QUESTION',
      title: title,
      body: body,
      topicIDs: topicIDs
    });
  },

  updateItem: function(
    id,
    itemType,
    title,
    body,
    expiredAt,
    topicIDs,
    sharingItemIDs,
    attachmentIDs,
    labelIDs
  ) {
    AppDispatcher.dispatch({
      actionType: 'UPDATE_ITEM',
      id: id,
      itemType: itemType,
      title: title,
      body: body,
      expiredAt: expiredAt,
      topicIDs: topicIDs,
      sharingItemIDs: sharingItemIDs,
      attachmentIDs: attachmentIDs,
      labelIDs
    });
  },

  // update item without notifying
  updateItemSilent: function(
    id,
    itemType,
    title,
    body,
    expiredAt,
    topicIDs,
    sharingItemIDs,
    attachmentIDs,
    labelIDs
  ) {
    AppDispatcher.dispatch({
      actionType: 'UPDATE_ITEM_SILENT',
      id: id,
      itemType: itemType,
      title: title,
      body: body,
      expiredAt: expiredAt,
      topicIDs: topicIDs,
      sharingItemIDs: sharingItemIDs,
      attachmentIDs: attachmentIDs,
      labelIDs
    });
  },

  createGroup: function(title, description, userIDs) {
    AppDispatcher.dispatch({
      actionType: 'CREATE_GROUP',
      title: title,
      description: description,
      userIDs: userIDs
    });
  },

  updateGroup: function(id, title, description, userIDs) {
    AppDispatcher.dispatch({
      actionType: 'UPDATE_GROUP',
      id: id,
      title: title,
      description: description,
      userIDs: userIDs
    });
  },

  deleteGroup: function(groupID) {
    AppDispatcher.dispatch({
      actionType: 'DELETE_GROUP',
      groupID: groupID
    });
  }
};

export default MainFormActions;
