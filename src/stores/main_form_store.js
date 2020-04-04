import { EventEmitter } from 'events';
import { browserHistory } from 'react-router';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';
import analytics from '../lib/analytics';
import TopicPageActions from '../actions/topic_page_actions';

const MainFormStore = Object.assign({}, EventEmitter.prototype, {
  buildTopicsData: function(topicIDs) {
    if (topicIDs) {
      const subtopicsData = [];
      $(topicIDs).each(function(index, topicID) {
        subtopicsData.push({ id: topicID, type: 'topics' });
      });

      return { data: subtopicsData };
    }
    return null;
  },

  builLabelsData: function(labelIDs) {
    if (labelIDs) {
      const labelsData = [];
      $(labelIDs).each(function(index, labelID) {
        labelsData.push({ id: labelID, type: 'labels' });
      });

      if (!labelsData.length) {
        labelsData.push({ id: '', type: 'labels' });
      }

      return { data: labelsData };
    }
    return null;
  },

  buildUsersData: function(sharingItemIDs) {
    if (sharingItemIDs) {
      const usersData = [];
      $.each(sharingItemIDs, function(index, sharingItemID) {
        const itemData = sharingItemID.split('-');
        if (itemData[0] !== 'users' && itemData[0] !== 'emails') {
          // next item
          return true;
        }

        usersData.push({ id: itemData[1], type: itemData[0] });
      });

      if (usersData.length === 0) {
        return null;
      }

      return { data: usersData };
    }
    return null;
  },

  buildGroupsData: function(sharingItemIDs) {
    if (sharingItemIDs) {
      const groupsData = [];
      $(sharingItemIDs).each(function(index, sharingItemID) {
        const itemData = sharingItemID.split('-');
        if (itemData[0] !== 'groups') {
          // next item
          return true;
        }

        groupsData.push({ id: itemData[1], type: itemData[0] });
      });

      if (groupsData.length === 0) {
        return null;
      }

      return { data: groupsData };
    }
    return null;
  },

  buildAdminRolesData: function(adminUserIDs) {
    if (adminUserIDs) {
      const adminRolesData = [];
      $(adminUserIDs).each(function(index, userID) {
        const itemData = userID.split('-');
        if (itemData[0] !== 'users') {
          // next item
          return true;
        }

        adminRolesData.push({ name: 'admin', user_id: itemData[1] });
      });

      return { data: adminRolesData };
    }
    return null;
  },

  buildAttachmentsData: function(attachmentIDs) {
    if (attachmentIDs) {
      const attachmentsData = [];
      $(attachmentIDs).each(function(index, attachmentID) {
        attachmentsData.push({ id: attachmentID, type: 'attachments' });
      });
      if (!attachmentsData.length) {
        attachmentsData.push({ id: '', type: 'attachments' });
      }

      return { data: attachmentsData };
    }
    return null;
  },

  createTip: function(
    title,
    body,
    expiredAt,
    topicIDs,
    sharingItemIDs,
    attachmentIDs,
    lableIDs
  ) {
    const _this = this;

    const topics = MainFormStore.buildTopicsData(topicIDs);
    const users = MainFormStore.buildUsersData(sharingItemIDs);
    const groups = MainFormStore.buildGroupsData(sharingItemIDs);
    const attachments = MainFormStore.buildAttachmentsData(attachmentIDs);
    const labels = MainFormStore.builLabelsData(lableIDs);

    const $createXHR = APIRequest.post({
      resource: 'tips',
      data: {
        data: {
          type: 'tips',
          attributes: {
            title: title,
            body: body,
            expiration_date: expiredAt
          },
          relationships: {
            subtopics: topics,
            labels: labels,
            user_followers: users,
            group_followers: groups,
            attachments: attachments
          }
        }
      }
    });

    $createXHR
      .done(function(response, status, xhr) {
        _this.emitEventWithData(window.TIP_CREATE_EVENT, response);
        APIRequest.showSuccessMessage('Card added');

        const topicIDs = [];
        const topicTitles = [];
        $.each(response.data.relationships.topics.data, function(index, topic) {
          topicIDs.push(topic.id);
          topicTitles.push(topic.title);
        });

        analytics.track('Card Created', {
          id: response.data.id,
          title: response.data.attributes.title,
          topic_ids: topicIDs,
          topic_titles: topicTitles
        });
      })
      .fail(function(xhr, status, error) {
        APIRequest.showErrorMessage(xhr.responseJSON.errors.title);
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
    const _this = this;

    const users = MainFormStore.buildUsersData(sharingItemIDs);
    const groups = MainFormStore.buildGroupsData(sharingItemIDs);
    const admins = MainFormStore.buildAdminRolesData(adminUserIDs);

    const $createXHR = APIRequest.post({
      resource: 'topics',
      domain,
      data: {
        data: {
          type: 'topics',
          attributes: {
            title: title,
            description: description
          },
          relationships: {
            user_followers: users,
            group_followers: groups,
            roles: admins,
            topic_permission: topicPermissionData
          }
        }
      }
    });

    $createXHR
      .done(function(response, status, xhr) {
        _this.emitEventWithData(window.TOPIC_CREATE_EVENT, response);
        APIRequest.showSuccessMessage('yay added');
      })
      .fail(function(xhr, status, error) {
        const responseJSON = xhr.responseJSON;

        const errors = responseJSON.errors;
        const detail = errors.detail;

        APIRequest.showErrorMessage(errors.title);

        if (detail && detail.resourceUrl) {
          $('#primary-modal').modal('hide');

          APIRequest.showInfoMessage(
            'That yay already exists. Redirecting to the existing yay.'
          );
          browserHistory.push('/' + detail.resourceUrl);
        }
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
    const _this = this;

    const users = MainFormStore.buildUsersData(sharingItemIDs);
    const groups = MainFormStore.buildGroupsData(sharingItemIDs);
    const admins = MainFormStore.buildAdminRolesData(adminUserIDs);

    const $updateXHR = APIRequest.patch({
      resource: 'topics/' + topicID,
      data: {
        data: {
          type: 'topics',
          attributes: {
            title: title,
            description: description
          },
          relationships: {
            user_followers: users,
            group_followers: groups,
            roles: admins,
            topic_permission: topicPermissionData
          }
        }
      }
    });

    $updateXHR
      .done(function(response, status, xhr) {
        if (fromTaskList) {
          _this.emitEventWithData(
            window.TASK_LIST_TOPIC_UPDATE_EVENT,
            response
          );
        } else {
          _this.emitEventWithData(window.TOPIC_UPDATE_EVENT, response);
        }
        APIRequest.showSuccessMessage('yay updated');
      })
      .fail(function(xhr, status, error) {
        APIRequest.showErrorMessage(xhr.responseJSON.errors.detail);
      });
  },

  updateTopicTitle: function(topicID, title, fromTaskList) {
    var _this = this;
    var $updateXHR = APIRequest.patch({
      resource: 'topics/' + topicID,
      data: {
        data: {
          type: 'topics',
          attributes: {
            title: title
          }
        }
      }
    });

    $updateXHR
      .done(function(response, status, xhr) {
        if (fromTaskList) {
          _this.emitEventWithData(
            window.TASK_LIST_TOPIC_UPDATE_EVENT,
            response
          );
        } else {
          _this.emitEventWithData(window.TOPIC_UPDATE_EVENT, response);
        }
        APIRequest.showSuccessMessage('yay updated');
      })
      .fail(function(xhr, status, error) {
        APIRequest.showErrorMessage(xhr.responseJSON.errors.detail);
      });
  },

  deleteTopic: function(topicID, isSubtopic = false, fromTaskList) {
    APIRequest.delete({
      resource: `topics/${topicID}`
    })
      .done(() => {
        if (!isSubtopic) {
          this.emitEvent(
            fromTaskList
              ? window.TASK_LIST_TOPIC_DESTROY_EVENT
              : window.TOPIC_DESTROY_EVENT
          );
        } else {
          TopicPageActions.removeSubtopic(topicID);
        }

        APIRequest.showSuccessMessage(
          isSubtopic ? 'yay deleted' : 'yay deleted'
        );
      })
      .fail(xhr => {
        APIRequest.showErrorMessage(xhr.responseJSON.errors.detail);
      });
  },

  deleteTopicAndMove: function(topicID, newTopicID, isSubtopic = false) {
    APIRequest.delete({
      resource: `topics/${topicID}`,
      data: {
        data: {
          alternate_topic_id: newTopicID,
          move_tip_ids: 'all'
        }
      }
    })
      .done(() => {
        if (!isSubtopic) {
          this.emitEvent(window.TOPIC_DESTROY_EVENT);
        } else {
          TopicPageActions.removeSubtopic(topicID);
        }

        APIRequest.showSuccessMessage(
          isSubtopic ? 'yay deleted' : 'yay deleted'
        );
      })
      .fail(xhr => {
        APIRequest.showErrorMessage(xhr.responseJSON.errors.detail);
      });
  },

  moveTopic: function(topicID, newTopicID, newTopicSlug) {
    const _this = this;

    const $moveXHR = APIRequest.post({
      resource: 'topics/' + topicID + '/move',
      data: {
        data: {
          alternate_topic_id: newTopicID,
          move_tip_ids: 'all'
        }
      }
    });

    $moveXHR
      .done(function(response, status, xhr) {
        _this.emitEventWithData(window.TOPIC_MOVE_EVENT, newTopicSlug);
        APIRequest.showSuccessMessage('yay moved');
      })
      .fail(function(xhr, status, error) {
        APIRequest.showErrorMessage(xhr.responseJSON.errors.detail);
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
    const _this = this;

    const users = MainFormStore.buildUsersData(sharingItemIDs);
    const groups = MainFormStore.buildGroupsData(sharingItemIDs);

    const $createXHR = APIRequest.post({
      resource: 'topics',
      data: {
        data: {
          type: 'topics',
          attributes: {
            title: title,
            description: description,
            parent_id: parentID
          },
          relationships: {
            user_followers: users,
            group_followers: groups
          }
        }
      }
    });

    $createXHR
      .done(function(response, status, xhr) {
        if (fromTaskList) {
          _this.emitEventWithData(
            window.TASK_LIST_TOPIC_CREATE_EVENT,
            response
          );
        } else if (fromLeftSubtopicMenu) {
          _this.emitEventWithData(
            window.SUBHIVE_NAV_FILTER_TOPIC_CREATE_EVENT,
            response
          );
        } else if (fromTopicsGrid) {
          response['noRedirect'] = true;
          _this.emitEventWithData(window.HEX_TOPIC_CREATE_EVENT, response);
          TopicPageActions.addSubtopic(response.data);
        } else {
          _this.emitEventWithData(window.TOPIC_CREATE_EVENT, response);
        }
        APIRequest.showSuccessMessage('SubTopic added');
      })
      .fail(function(xhr, status, error) {
        const responseJSON = xhr.responseJSON;

        const errors = responseJSON.errors;
        const detail = errors.detail;

        APIRequest.showErrorMessage(errors.title);

        if (detail && detail.resourceUrl) {
          $('#primary-modal').modal('hide');

          APIRequest.showInfoMessage(
            'That SubTopic already exists at this level. Redirecting to the existing SubTopic.'
          );
        }
      });
  },

  createQuestion: function(title, body, topicIDs) {
    const _this = this;
    const subtopicsData = [];
    $(topicIDs).each(function(index, topicID) {
      subtopicsData.push({ id: topicID, type: 'topics' });
    });

    const $createXHR = APIRequest.post({
      resource: 'questions',
      data: {
        data: {
          type: 'questions',
          attributes: {
            title: title,
            body: body
          },
          relationships: {
            subtopics: { data: subtopicsData }
          }
        }
      }
    });

    $createXHR
      .done(function(response, status, xhr) {
        _this.emitEventWithData(window.QUESTION_CREATE_EVENT, response);
        APIRequest.showSuccessMessage('Question added');
      })
      .fail(function(xhr, status, error) {
        APIRequest.showErrorMessage(xhr.responseJSON.errors.title);
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
    const _this = this;
    const topics = MainFormStore.buildTopicsData(topicIDs);
    const users = MainFormStore.buildUsersData(sharingItemIDs);
    const groups = MainFormStore.buildGroupsData(sharingItemIDs);
    const attachments = MainFormStore.buildAttachmentsData(attachmentIDs);
    const labels = MainFormStore.builLabelsData(labelIDs);

    const $updateXHR = APIRequest.patch({
      resource: itemType + '/' + id,
      data: {
        data: {
          type: itemType,
          attributes: {
            title: title,
            body: body,
            expiration_date: expiredAt
          },
          relationships: {
            subtopics: topics,
            labels: labels,
            user_followers: users,
            group_followers: groups,
            attachments: attachments
          }
        }
      }
    });

    $updateXHR
      .done(function(response, status, xhr) {
        _this.emitEventWithData(window.ITEM_UPDATE_EVENT, response);
        APIRequest.showSuccessMessage('Item updated');
      })
      .fail(function(xhr, status, error) {
        APIRequest.showErrorMessage(xhr.responseJSON.errors.title);
      });
  },

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
    const _this = this;

    const topics = MainFormStore.buildTopicsData(topicIDs);
    const users = MainFormStore.buildUsersData(sharingItemIDs);
    const groups = MainFormStore.buildGroupsData(sharingItemIDs);
    const attachments = MainFormStore.buildAttachmentsData(attachmentIDs);
    const labels = MainFormStore.builLabelsData(labelIDs);

    const $updateXHR = APIRequest.patch({
      resource: itemType + '/' + id,
      data: {
        data: {
          type: itemType,
          attributes: {
            title: title,
            body: body,
            expiration_date: expiredAt
          },
          relationships: {
            subtopics: topics,
            labels: labels,
            user_followers: users,
            group_followers: groups,
            attachments: attachments
          }
        }
      }
    });

    $updateXHR.done(function(response, status, xhr) {
      _this.emitEventWithData(window.ITEM_UPDATE_SILENT_EVENT, response);
    });
  },

  createGroup: function(title, description, userIDs) {
    const _this = this;

    const users = MainFormStore.buildUsersData(userIDs);

    const $createXHR = APIRequest.post({
      resource: 'groups',
      data: {
        data: {
          type: 'groups',
          attributes: {
            title: title,
            description: description
          },
          relationships: {
            user_followers: users
          }
        }
      }
    });

    $createXHR
      .done(function(response, status, xhr) {
        _this.emitEventWithData(window.GROUP_CREATE_EVENT, response);
        APIRequest.showSuccessMessage('Team created');
      })
      .fail(function(xhr, status, error) {
        const responseJSON = xhr.responseJSON;

        const errors = responseJSON.errors;
        const detail = errors.detail;

        APIRequest.showErrorMessage(errors.title);

        if (detail && detail.resourceUrl) {
          $('#primary-modal').modal('hide');

          APIRequest.showInfoMessage(
            'That Team already exists. Redirecting to the existing Team.'
          );
          browserHistory.push('/' + detail.resourceUrl);
        }
      });
  },

  updateGroup: function(groupID, title, description, userIDs) {
    const _this = this;

    const users = MainFormStore.buildUsersData(userIDs);

    const $updateXHR = APIRequest.patch({
      resource: 'groups/' + groupID,
      data: {
        data: {
          type: 'groups',
          attributes: {
            title: title,
            description: description
          },
          relationships: {
            user_followers: users
          }
        }
      }
    });

    $updateXHR
      .done(function(response, status, xhr) {
        _this.emitEventWithData(window.GROUP_UPDATE_EVENT, response);
        APIRequest.showSuccessMessage('Team updated');
      })
      .fail(function(xhr, status, error) {
        APIRequest.showErrorMessage(xhr.responseJSON.errors.detail);
      });
  },

  deleteGroup: function(groupID) {
    const _this = this;

    const $deleteXHR = APIRequest.delete({
      resource: 'groups/' + groupID
    });

    $deleteXHR
      .done(function(response, status, xhr) {
        _this.emitEventWithData(window.GROUP_DESTROY_EVENT, groupID);
        APIRequest.showSuccessMessage('Team deleted');
      })
      .fail(function(xhr, status, error) {
        APIRequest.showErrorMessage(xhr.responseJSON.errors.detail);
      });
  },

  emitEvent: function(eventType) {
    this.emit(eventType);
  },

  emitEventWithData: function(eventType, eventData) {
    this.emit(eventType, eventData);
  },

  addEventListener: function(eventType, callback) {
    this.on(eventType, callback);
  },

  removeEventListener: function(eventType, callback) {
    this.removeListener(eventType, callback);
  }
});

// Register callback to handle all updates
MainFormStore.dispatchToken = AppDispatcher.register(function(payload) {
  let id,
    itemType,
    title,
    body,
    expiredAt,
    description,
    topicID,
    newTopicID,
    newTopicSlug,
    topicIDs,
    sharingItemIDs,
    userIDs,
    adminUserIDs,
    topicPermissionData,
    attachmentIDs,
    parentID,
    groupID,
    labelIDs,
    fromTaskList,
    fromLeftSubtopicMenu,
    fromTopicsGrid,
    domain;

  switch (payload.actionType) {
    case 'CREATE_TIP':
      title = payload.title;
      body = payload.body;
      expiredAt = payload.expiredAt;
      topicIDs = payload.topicIDs;
      sharingItemIDs = payload.sharingItemIDs;
      attachmentIDs = payload.attachmentIDs;
      labelIDs = payload.labelIDs;
      MainFormStore.createTip(
        title,
        body,
        expiredAt,
        topicIDs,
        sharingItemIDs,
        attachmentIDs,
        labelIDs
      );
      break;

    case 'CREATE_TOPIC':
      title = payload.title;
      description = payload.description;
      sharingItemIDs = payload.sharingItemIDs;
      adminUserIDs = payload.adminUserIDs;
      topicPermissionData = payload.topicPermissionData;
      domain = payload.domain;
      MainFormStore.createTopic(
        title,
        description,
        sharingItemIDs,
        adminUserIDs,
        topicPermissionData,
        domain
      );
      break;

    case 'UPDATE_TOPIC':
      topicID = payload.topicID;
      title = payload.title;
      description = payload.description;
      sharingItemIDs = payload.sharingItemIDs;
      adminUserIDs = payload.adminUserIDs;
      topicPermissionData = payload.topicPermissionData;
      fromTaskList = payload.fromTaskList;
      MainFormStore.updateTopic(
        topicID,
        title,
        description,
        sharingItemIDs,
        adminUserIDs,
        topicPermissionData,
        fromTaskList
      );
      break;

    case 'UPDATE_TOPIC_TITLE':
      topicID = payload.topicID;
      title = payload.title;
      fromTaskList = payload.fromTaskList;
      MainFormStore.updateTopicTitle(topicID, title, fromTaskList);
      break;

    case 'DELETE_TOPIC':
      topicID = payload.topicID;
      fromTaskList = payload.fromTaskList;
      MainFormStore.deleteTopic(topicID, false, fromTaskList);
      break;

    case 'DELETE_TOPIC_AND_MOVE':
      topicID = payload.topicID;
      newTopicID = payload.newTopicID;
      MainFormStore.deleteTopicAndMove(topicID, newTopicID);
      break;

    case 'DELETE_SUBTOPIC':
      topicID = payload.topicID;
      MainFormStore.deleteTopic(topicID, true);
      break;

    case 'DELETE_SUBTOPIC_AND_MOVE':
      topicID = payload.topicID;
      newTopicID = payload.newTopicID;
      MainFormStore.deleteTopicAndMove(topicID, newTopicID, true);
      break;

    case 'MOVE_TOPIC':
      topicID = payload.topicID;
      newTopicID = payload.newTopicID;
      newTopicSlug = payload.newTopicSlug;
      MainFormStore.moveTopic(topicID, newTopicID, newTopicSlug);
      break;

    case 'CREATE_SUBTOPIC':
      title = payload.title;
      description = payload.description;
      sharingItemIDs = payload.sharingItemIDs;
      parentID = payload.parentID;
      fromTaskList = payload.fromTaskList;
      fromLeftSubtopicMenu = payload.fromLeftSubtopicMenu;
      fromTopicsGrid = payload.fromTopicsGrid;
      MainFormStore.createSubtopic(
        title,
        description,
        sharingItemIDs,
        parentID,
        fromTaskList,
        fromLeftSubtopicMenu,
        fromTopicsGrid
      );
      break;

    case 'CREATE_SUBTOPIC_WITH_TITLE':
      MainFormStore.createSubtopic(payload.title, '', null, payload.parentID);
      break;

    case 'CREATE_SUBTOPIC_WITH_TITLE_IN_SUBTOPIC_MENU':
      MainFormStore.createSubtopic(
        payload.title,
        '',
        null,
        payload.parentID,
        false,
        true,
        false
      );
      break;

    case 'CREATE_QUESTION':
      title = payload.title;
      body = payload.body;
      topicIDs = payload.topicIDs;
      MainFormStore.createQuestion(title, body, topicIDs);
      break;

    case 'UPDATE_ITEM':
      id = payload.id;
      itemType = payload.itemType;
      title = payload.title;
      body = payload.body;
      expiredAt = payload.expiredAt;
      topicIDs = payload.topicIDs;
      sharingItemIDs = payload.sharingItemIDs;
      attachmentIDs = payload.attachmentIDs;
      labelIDs = payload.labelIDs;
      MainFormStore.updateItem(
        id,
        itemType,
        title,
        body,
        expiredAt,
        topicIDs,
        sharingItemIDs,
        attachmentIDs,
        labelIDs
      );
      break;

    case 'UPDATE_ITEM_SILENT':
      id = payload.id;
      itemType = payload.itemType;
      title = payload.title;
      body = payload.body;
      expiredAt = payload.expiredAt;
      topicIDs = payload.topicIDs;
      sharingItemIDs = payload.sharingItemIDs;
      attachmentIDs = payload.attachmentIDs;
      labelIDs = payload.labelIDs;
      MainFormStore.updateItemSilent(
        id,
        itemType,
        title,
        body,
        expiredAt,
        topicIDs,
        sharingItemIDs,
        attachmentIDs,
        labelIDs
      );
      break;

    case 'CREATE_GROUP':
      title = payload.title;
      description = payload.description;
      userIDs = payload.userIDs;
      MainFormStore.createGroup(title, description, userIDs);
      break;

    case 'UPDATE_GROUP':
      id = payload.id;
      title = payload.title;
      description = payload.description;
      userIDs = payload.userIDs;
      MainFormStore.updateGroup(id, title, description, userIDs);
      break;

    case 'DELETE_GROUP':
      groupID = payload.groupID;
      MainFormStore.deleteGroup(groupID);
      break;

    default:
    // no op
  }
});

export default MainFormStore;
