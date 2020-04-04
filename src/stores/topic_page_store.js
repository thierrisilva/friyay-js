import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';

let _pageGroup = {};
let _pageTopic = {};
let _pageTopicItems = [];
let _pageTopicItemsPagination = null;
let _pageTopicSubtopics = [];
let _subtopicsCards = {};

let loadGroupXHR = null;
let loadTopicXHR = null;
let loadSubtopicsXHR = null;
let loadTopicItemsByPageXHR = null;

const TopicPageStore = Object.assign({}, EventEmitter.prototype, {
  loadGroup(groupID) {
    let _this = this;

    APIRequest.abort(loadGroupXHR);

    loadGroupXHR = APIRequest.get({
      resource: 'groups/' + groupID
    });

    loadGroupXHR
      .done((response, status, xhr) => {
        _pageGroup = response.data;
        _this.emitEventWithData(window.GROUP_LOAD_EVENT, response);
      })
      .fail((xhr, status, error) => {
        if (status !== 'abort') {
          APIRequest.showErrorMessage('Unable to load team');
        }
      });
  },

  setSubtopicsCards(subtopicID, cards) {
    if (_subtopicsCards[subtopicID]) {
      _subtopicsCards[subtopicID]['cards'] = cards;
    } else {
      _subtopicsCards = Object.assign(_subtopicsCards, {
        [subtopicID]: {
          cards
        }
      });
    }
  },

  getSubtopicsCards(subtopicID) {
    if (_subtopicsCards[subtopicID]) {
      return _subtopicsCards[subtopicID]['cards'];
    } else {
      return null;
    }
  },

  loadTopic(topicID) {
    if (!topicID) {
      return;
    }

    let _this = this;

    APIRequest.abort(loadTopicXHR);

    loadTopicXHR = APIRequest.get({
      resource: 'topics/' + topicID
    });

    loadTopicXHR
      .done((response, status, xhr) => {
        _pageTopic = response.data;
        _this.emitEventWithData(window.TOPIC_LOAD_EVENT, response);
      })
      .fail((xhr, status, error) => {
        if (status !== 'abort') {
          APIRequest.showErrorMessage('Unable to load yay');
        }
      });
  },

  loadSubtopics(topicID, groupID) {
    if (!topicID) {
      return;
    }

    let _this = this;

    var filter = {};
    if (groupID) {
      filter['within_group'] = groupID;
    }

    APIRequest.abort(loadSubtopicsXHR);

    loadSubtopicsXHR = APIRequest.get({
      resource: 'topics',
      data: {
        parent_id: topicID.split('-')[0],
        page: {
          size: 999
        },
        filter,
        with_permissions: true
      }
    });

    loadSubtopicsXHR
      .done((response, status, xhr) => {
        _pageTopicSubtopics = response.data;
        _this.emitEventWithData(window.TOPICS_LOAD_EVENT, response);
      })
      .fail((xhr, status, error) => {
        if (status !== 'abort') {
          APIRequest.showErrorMessage('Unable to load SubTopics');
        }
      });
  },

  loadTopicItemsByPage(
    groupID,
    topicID,
    itemType,
    pageNumber,
    pageSize,
    filterType,
    labelIDs
  ) {
    let _this = this;

    itemType = itemType || 'tips';

    if (parseInt(pageNumber) === 1) {
      _this.clearTopicItems();
    }

    APIRequest.abort(loadTopicItemsByPageXHR);

    let filter;
    if (filterType === 'following') {
      filter = {
        topics: 'following',
        labels: labelIDs
      };
    } else {
      filter = {
        type: filterType,
        labels: labelIDs
      };
    }

    // because ID is actually a slug, we need to parse the integer ID to send to API
    let intGroupID;
    if (groupID) {
      intGroupID = groupID.split('-')[0];
      filter['within_group'] = intGroupID;
    }

    let intTopicID;
    if (topicID) {
      intTopicID = topicID.split('-')[0];
    }

    loadTopicItemsByPageXHR = APIRequest.get({
      resource: itemType,
      data: {
        group_id: intGroupID,
        topic_id: intTopicID,
        filter: filter,
        page: {
          number: pageNumber,
          size: pageSize
        }
      }
    });

    loadTopicItemsByPageXHR
      .done((response, status, xhr) => {
        $.each(response.data, (i, topicItem) => {
          let currentItem = null;
          $.each(_pageTopicItems, (j, pageTopicItem) => {
            if (
              pageTopicItem &&
              parseInt(pageTopicItem.id) === parseInt(topicItem.id)
            ) {
              currentItem = pageTopicItem;
              _pageTopicItems[j] = topicItem;
            }
          });

          if (!currentItem) {
            _pageTopicItems.push(topicItem);
          }
        });

        _pageTopicItemsPagination = response['meta'];
        _this.emitEventWithData(window.ITEMS_LOAD_EVENT, response);
      })
      .fail((xhr, status, error) => {
        if (status !== 'abort') {
          APIRequest.showErrorMessage('Unable to load yay ' + itemType);
        }
      });
  },

  followTopic(topicID) {
    let _this = this;

    let $followXHR = APIRequest.post({
      resource: 'topics/' + topicID + '/join'
    });

    $followXHR.done((response, status, xhr) => {
      _this.emitEventWithData(window.TOPIC_FOLLOW_EVENT, response);
    });
  },

  unfollowTopic(topicID) {
    let _this = this;

    let $unfollowXHR = APIRequest.post({
      resource: 'topics/' + topicID + '/leave'
    });

    $unfollowXHR.done((response, status, xhr) => {
      _this.emitEventWithData(window.TOPIC_UNFOLLOW_EVENT, response);
    });
  },

  starTopic(topicID) {
    let _this = this;

    let $followXHR = APIRequest.post({
      resource: 'topics/' + topicID + '/star'
    });

    $followXHR.done((response, status, xhr) => {
      _this.emitEventWithData(window.TOPIC_STAR_EVENT, response);
    });
  },

  unstarTopic(topicID) {
    let _this = this;

    let $unfollowXHR = APIRequest.post({
      resource: 'topics/' + topicID + '/unstar'
    });

    $unfollowXHR.done((response, status, xhr) => {
      _this.emitEventWithData(window.TOPIC_UNSTAR_EVENT, response);
    });
  },

  updateSubtopic(id, title) {
    APIRequest.patch({
      resource: `topics/${id}`,
      data: {
        data: {
          id,
          type: 'topics',
          attributes: {
            title
          }
        }
      }
    }).then(
      response => {
        const subtopic = _pageTopicSubtopics.find(
          subtopic => subtopic.id === id
        );
        subtopic.attributes.title = title;
        this.emitEventWithData(window.UPDATE_SUBTOPIC_EVENT, id);
        APIRequest.showSuccessMessage(`Subtopic ${title} was updated`);
      },
      error => {
        this.emitEventWithData(window.UPDATE_SUBTOPIC_ERROR, id);
        APIRequest.showErrorMessage('Unable to update subtopic');
      }
    );
  },

  onTaskLabelFilterClose: function() {
    this.emitEvent(window.TASK_LABEL_FILTER_CLOSE_EVENT);
  },

  removeItem: function(itemId) {
    _pageTopicItems = _pageTopicItems.filter(item => item.id !== itemId);
    this.emitEvent(window.ITEM_REMOVE_EVENT);
  },

  getGroup() {
    return _pageGroup;
  },

  getTopic() {
    return _pageTopic;
  },

  getSubtopics() {
    return _pageTopicSubtopics;
  },

  getTopicItems() {
    return _pageTopicItems;
  },

  getSubtopicById: id => _pageTopicSubtopics.find(topic => topic.id === id),

  getItemById: id => _pageTopicItems.find(item => item.attributes.slug === id),

  setItemByIndex: (index, newItem) => {
    const item = _pageTopicItems[index] || {};
    if (item.id === newItem.id) {
      _pageTopicItems[index] = newItem;
    }
  },

  getTopicItemsPagination() {
    return _pageTopicItemsPagination;
  },

  // clear loaded topic, subtopics and items
  clearAll() {
    _pageGroup = {};
    _pageTopic = {};
    _pageTopicItems = [];
    _pageTopicSubtopics = [];
  },

  clearTopicItems() {
    _pageTopicItems = [];
  },

  addSubtopic(topic) {
    _pageTopicSubtopics = [topic, ..._pageTopicSubtopics];
    this.emit(window.ADD_SUBTOPIC_EVENT);
  },

  removeSubtopic(topicId) {
    _pageTopicSubtopics = _pageTopicSubtopics.filter(
      topic => topic.id !== topicId
    );
    this.emit(window.REMOVE_SUBTOPIC_EVENT);
  },

  emitEvent(eventType) {
    this.emit(eventType);
  },

  emitEventWithData(eventType, eventData) {
    this.emit(eventType, eventData);
  },

  addEventListener(eventType, callback) {
    this.on(eventType, callback);
  },

  removeEventListener(eventType, callback) {
    this.removeListener(eventType, callback);
  }
});

TopicPageStore.dispatchToken = AppDispatcher.register(payload => {
  switch (payload.actionType) {
    case 'LOAD_GROUP':
      TopicPageStore.loadGroup(payload.groupID);
      break;

    case 'LOAD_TOPIC':
      TopicPageStore.loadTopic(payload.topicID);
      break;

    case 'LOAD_SUBTOPICS':
      TopicPageStore.loadSubtopics(payload.topicID, payload.groupID);
      break;

    case 'LOAD_TOPIC_ITEMS_BY_PAGE':
      TopicPageStore.loadTopicItemsByPage(
        payload.groupID,
        payload.topicID,
        payload.itemType,
        payload.pageNumber,
        payload.pageSize,
        payload.filterType,
        payload.labelIDs
      );
      break;

    case 'REMOVE_TOPIC_ITEM':
      TopicPageStore.removeItem(payload.itemId);
      break;

    case 'FOLLOW_TOPIC':
      TopicPageStore.followTopic(payload.topicID);
      break;

    case 'UNFOLLOW_TOPIC':
      TopicPageStore.unfollowTopic(payload.topicID);
      break;

    case 'STAR_TOPIC':
      TopicPageStore.starTopic(payload.topicID);
      break;

    case 'UNSTAR_TOPIC':
      TopicPageStore.unstarTopic(payload.topicID);
      break;

    case 'REMOVE_SUBTOPIC':
      TopicPageStore.removeSubtopic(payload.topicID);
      break;

    case 'ADD_SUBTOPIC':
      TopicPageStore.addSubtopic(payload.topic);
      break;

    case 'UPDATE_SUBTOPIC':
      TopicPageStore.updateSubtopic(payload.id, payload.title);
      break;

    case 'TASK_LABEL_FILTER_CLOSE':
      TopicPageStore.onTaskLabelFilterClose();
      break;

    default:
    // no op
  }
});

export default TopicPageStore;
