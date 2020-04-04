import { switchcaseF } from './utils';
import {
  assocPath,
  inc,
  dec,
  compose,
  view,
  lensPath,
  __,
  concat,
  filter,
  reject,
  prop,
  equals,
  isNil,
  uniqBy,
  path,
  toLower,
  sortBy,
  replace
} from 'ramda';
import { VIEWS_ENUM } from 'Enums';
import toInt from 'lodash/toSafeInteger';
import find from 'lodash/find';
import {
  GET_TOPIC_REQUEST,
  GET_TOPIC_SUCCESS,
  GET_TOPIC_FAILURE,
  GET_TOPIC_GROUP_REQUEST,
  GET_TOPIC_GROUP_SUCCESS,
  GET_TOPIC_GROUP_FAILURE,
  GET_TOPIC_SUBTOPICS_REQUEST,
  GET_TOPIC_SUBTOPICS_SUCCESS,
  GET_TOPIC_SUBTOPICS_FAILURE,
  STAR_TOPIC_SUCCESS,
  STAR_TOPIC_FAILURE,
  UNSTAR_TOPIC_SUCCESS,
  UNSTAR_TOPIC_FAILURE,
  FOLLOW_TOPIC_SUCCESS,
  FOLLOW_TOPIC_FAILURE,
  UNFOLLOW_TOPIC_SUCCESS,
  UNFOLLOW_TOPIC_FAILURE,
  UPDATE_TOPIC_SUBTOPIC_SUCCESS,
  UPDATE_TOPIC_SUBTOPIC_FAILURE,
  SAVE_TOPIC_SUBTOPIC_FAILURE,
  GET_TOPIC_TIPS_REQUEST,
  GET_TOPIC_TIPS_SUCCESS,
  GET_TOPIC_TIPS_FAILURE,
  GET_TOPIC_TIPS_WIKI_REQUEST,
  GET_TOPIC_TIPS_WIKI_SUCCESS,
  GET_TOPIC_TIPS_WIKI_FAILURE,
  GET_SUBTOPIC_TIPS_WIKI_SUCCESS,
  STAR_TOPIC_TIP_SUCCESS,
  STAR_TOPIC_TIP_FAILURE,
  UNSTAR_TOPIC_TIP_SUCCESS,
  UNSTAR_TOPIC_TIP_FAILURE,
  LIKE_TOPIC_TIP_SUCCESS,
  LIKE_TOPIC_TIP_FAILURE,
  UNLIKE_TOPIC_TIP_SUCCESS,
  UNLIKE_TOPIC_TIP_FAILURE,
  CHANGE_TOPIC_TIP_ORDER_FAILURE,
  ADD_TOPIC_TIP_SUCCESS,
  ADD_TOPIC_TIP_FAILURE,
  REMOVE_TOPIC_TIP_SUCCESS,
  REMOVE_TOPIC_TIP_FAILURE,
  ADD_TIP_FROM_TOPIC_FAILURE,
  MOVE_TIP_FROM_TOPIC_FAILURE,
  UPDATE_TOPIC_VIEW_SUCCESS,
  UPDATE_TOPIC_VIEW_FAILURE,
  REORDER_TOPIC_TIP_FAILURE,
  UPDATE_TOPIC_SUCCESS,
  UPDATE_TOPIC_REQUEST,
  DELETE_SUBTOPIC_REQUEST,
  DELETE_SUBTOPIC_FAILURE,
  DELETE_SUBTOPIC_AND_MOVE_REQUEST,
  DELETE_SUBTOPIC_AND_MOVE_FAILURE,
  CHANGE_TASK_TOPIC_TIP_ORDER_SUCCESS,
  CHANGE_TOPIC_TIP_ORDER_WIKI_SUCCESS,
  CHANGE_TOPIC_TIP_ORDER_WIKI_FAILURE, 
  REORDER_TASK_TOPIC_TIP_SUCCESS,
  ADD_TIP_FROM_TASK_TOPIC_SUCCESS,
  MOVE_TIP_FROM_TASK_TOPIC_SUCCESS,
  SAVE_TIP_IN_TASK_TOPIC_REQUEST,
  SAVE_TIP_IN_TASK_TOPIC_SUCCESS,
  SAVE_TIP_IN_TOPIC_SUCCESS,
  SAVE_TIP_IN_TASK_TOPIC_FAILURE,
  SAVE_FIRST_TOPIC_REQUEST,
  SAVE_FIRST_TOPIC_SUCCESS,
  SAVE_FIRST_TOPIC_FAILURE,
  DELETE_TIP_IN_TASK_TOPIC_SUCCESS,
  DELETE_TIP_IN_TASK_TOPIC_FAILURE,
  ARCHIVE_TIP_IN_TASK_TOPIC_REQUEST,
  ARCHIVE_TIP_IN_TASK_TOPIC_SUCCESS,
  ARCHIVE_TIP_IN_TASK_TOPIC_FAILURE,
  UPDATE_TIP_IN_TASK_TOPIC_SUCCESS,
  CREATE_SUBTOPIC_IN_TASK_VIEW_REQUEST,
  CREATE_SUBTOPICS_WITH_TITLE_REQUEST,
  CREATE_SUBTOPIC_IN_TASK_VIEW_SUCCESS,
  CREATE_SUBTOPICS_WITH_TITLE_SUCCESS,
  UPDATE_TOPIC_IN_TASK_VIEW_SUCCESS,
  UPDATE_SUBTOPIC_IN_TASK_VIEW_SUCCESS,
  SAVE_TOPIC_SUBTOPIC_SUCCESS,
  REMOVE_GROUP_SUCCESS,
  UPDATE_TIP_SUCCESS,
  ASSIGN_LABEL_FAILURE,
  ASSIGN_LABEL_SUCCESS,
  UNASSIGN_LABEL_FAILURE,
  UNASSIGN_LABEL_SUCCESS,
  DELETE_TOPIC_SUCCESS,
  DELETE_TOPIC_AND_MOVE_SUCCESS,
  DELETE_SUBTOPIC_SUCCESS,
  DELETE_SUBTOPIC_AND_MOVE_SUCCESS,
  SET_SELECTED_TIP_FOR_WIKI_VIEW_SUCCESS,
  SET_SELECTED_TIP_FOR_WIKI_VIEW_FAILURE,
  SET_TIP_NESTED_TIPS_SUCCESS,
  SET_TIP_NESTED_TIPS_FAILURE,
  UPDATE_TIP_IN_TOPIC_REQUEST,
  UPDATE_TIP_IN_TOPIC_SUCCESS,
  UPDATE_TIP_IN_TOPIC_FAILURE,
SET_TOPIC_ACTIVE_VIEW_SUCCESS
} from 'AppConstants';

let droppedTipIndex;

const starTip = assocPath(['attributes', 'starred_by_current_user'], true);
const unstarTip = assocPath(['attributes', 'starred_by_current_user'], false);
const likes = view(lensPath(['attributes', 'likes_count']));
const incLikes = compose(inc, likes);
const decLikes = compose(dec, likes);
const likeTip = assocPath(['attributes', 'liked_by_current_user'], true);
const unlikeTip = assocPath(['attributes', 'liked_by_current_user'], false);
const increaseCount = item =>
  assocPath(['attributes', 'likes_count'], incLikes(item), item);
const decreaseCount = item =>
  assocPath(['attributes', 'likes_count'], decLikes(item), item);
const likeTipAndIncCount = compose(likeTip, increaseCount);
const unlikeTipAndDecCount = compose(unlikeTip, decreaseCount);
const deactivateTip = assocPath(['attributes', 'is_disabled'], true);
const assignLabel = assocPath(['relationships', 'labels', 'data']);
const viewLabels = view(lensPath(['relationships', 'labels', 'data']));

const uniqById = uniqBy(prop('id'));
const starTopic = assocPath(['attributes', 'starred_by_current_user'], true);
const unstarTopic = assocPath(['attributes', 'starred_by_current_user'], false);
const setViewTopic = assocPath(['attributes', 'default_view_id'], __);
const excludeTip = tipId =>
  reject(compose(equals(tipId),(prop('id'))));
const sortByTitleCaseInsensitive = sortBy(
  compose(toLower, replace(/[^a-zA-Z0-9 ]/g, ''), path(['attributes', 'title']))
);
const sortByDataTitleCaseInsensitive = sortBy(
  compose(toLower, replace(/[^a-zA-Z0-9 ]/g, ''), path(['data', 'attributes', 'title']))
);

const initialState = {
  group: null,
  isLoadingGroup: false,
  topic: null,
  isLoadingTopic: false,
  subtopics: [],
  isLoadingSubtopics: false,
  subtopicsWithTips: {}, // {'subtopicId1': [{tips, isLoading}],'subtopicId2': [{tips, isLoading}],...},
  isTopicUpdating: false,
  isTopicDeleting: false,
  isSaveTipInTaskTopicLoading: false,
  isSavingFirstTopic: false,
  isSubTopicInTaskViewSaving: false
};

const setGroupLoading = state => ({ ...state, isLoadingGroup: true });
const setTopicLoading = state => ({ ...state, isLoadingTopic: true });
const setSubtopicsLoading = state => ({
  ...state,
  isLoadingSubtopics: true,
  subtopics: []
});
const setTopicUpdating = state => ({ ...state, isTopicUpdating: true });

const starSubtopics = (isStar, subtopics, subtopicsId) => {
  subtopics.forEach((subtopic, index) => {
    if (subtopic.id === subtopicsId) {
      subtopics[index] = isStar ? starTopic(subtopic) : unstarTopic(subtopic);
    }
  });
  return [...subtopics];
};

const updateSubtopicTitle = (subtopics, id, title) => {
  subtopics.forEach((subtopic, index) => {
    if (subtopic.id === id) {
      subtopics[index].attributes.title = title;
    }
  });
  return [...subtopics];
};

const followTopic = (topic, userId) => {
  topic.relationships.user_followers.data.push({ id: userId, type: 'users' });
  return { ...topic };
};

const unfollowTopic = (topic, userId) => {
  const followedUsers = topic.relationships.user_followers.data.filter(
    user => user.id !== userId
  );
  topic.relationships.user_followers.data = followedUsers;
  return { ...topic };
};

const assignLabelSuccess = (state, payload) => {
  let subtopicsWithTips = {};

  for (let [key, value] of Object.entries(state.subtopicsWithTips)) {
    subtopicsWithTips = {
      ...subtopicsWithTips,
      [key]: {
        isLoading: value.isLoading,
        tips: value.tips.map(
          item =>
            toInt(item.id) === toInt(payload.id)
              ? assignLabel(concat([payload.label], viewLabels(item)))(item)
              : item
        )
      }
    };
  }

  return { ...state, subtopicsWithTips };
};

const unassignLabelSuccess = (state, payload) => {
  let subtopicsWithTips = {};

  for (let [key, value] of Object.entries(state.subtopicsWithTips)) {
    subtopicsWithTips = {
      ...subtopicsWithTips,
      [key]: {
        isLoading: value.isLoading,
        tips: value.tips.map(
          item =>
            toInt(item.id) === toInt(payload.id)
              ? assignLabel(
                filter(
                  label =>
                    toInt(label.id) !== toInt(payload.label.id),
                  viewLabels(item)
                )
              )(item)
              : item
        )
      }
    };
  }

  return { ...state, subtopicsWithTips };
};

const addSubtopic = (state, payload) => ({
  ...state,
  subtopics: sortByTitleCaseInsensitive([payload, ...state.subtopics])
});
const setTopicActiveViewSuccess = (state, {view: activeView}) => ({ ...state, activeView });

const setGroupSuccess = (state, payload) => ({
  ...state,
  isLoadingGroup: false,
  ...payload
});

const removeGroupSuccess = (state, payload) => ({
  ...state,

  group:
    state.group !== null
      ? state.group.id === payload ? null : state.group
      : state.group
});

const setTopicSuccess = (state, payload) => ({
  ...state,
  isLoadingTopic: false,
  topic: payload
});

const setSubtopicsSuccess = (state, { subtopics }) => ({
  ...state,
  isLoadingSubtopics: false,
  subtopics
});

const starTopicSuccess = (state, payload) => ({
  ...state,
  topic:
    state.topic !== null && state.topic.id === payload
      ? starTopic(state.topic)
      : state.topic,
  subtopics:
    state.topic !== null && state.topic.id !== payload
      ? starSubtopics(true, state.subtopics, payload)
      : state.subtopics
});
const unstarTopicSuccess = (state, payload) => ({
  ...state,
  topic:
    state.topic !== null && state.topic.id === payload
      ? unstarTopic(state.topic)
      : state.topic,
  subtopics:
    state.topic !== null && state.topic.id !== payload
      ? starSubtopics(false, state.subtopics, payload)
      : state.subtopics
});

const followTopicSuccess = (state, { topic: { id: topicId }, userId }) => ({
  ...state,
  topic:
    state.topic !== null && state.topic.id === topicId
      ? followTopic(state.topic, userId)
      : state.topic
});
const unfollowTopicSuccess = (state, { topicId, userId }) => ({
  ...state,
  topic:
    state.topic !== null && state.topic.id === topicId
      ? unfollowTopic(state.topic, userId)
      : state.topic
});

const updateTopicSubtopicSucess = (state, { topicId, title }) => ({
  ...state,
  subtopics: updateSubtopicTitle(state.subtopics, topicId, title)
});
const setTopicTipsSuccess = (state, { tips, topicId }) => ({
  ...state,
  subtopicsWithTips: {
    ...state.subtopicsWithTips,
    [topicId]: { tips, isLoading: false }
  }
});


const setTopicTipsLoading = (state, { topicId }) => ({
  ...state,
  subtopicsWithTips: {
    ...state.subtopicsWithTips,
    [topicId]: {
      tips:
        (state.subtopicsWithTips[topicId] &&
          state.subtopicsWithTips[topicId].tips) ||
        undefined,
      isLoading: true
    }
  }
});

const starTipSuccess = (state, { tipId, topicId }) => ({
  ...state,
  subtopicsWithTips: {
    ...state.subtopicsWithTips,
    [topicId]: {
      ...state.subtopicsWithTips[topicId],
      tips: state.subtopicsWithTips[topicId].tips.map(
        item => (item.id === tipId ? starTip(item) : item)
      )
    }
  }
});

const unstarTipSuccess = (state, { tipId, topicId }) => ({
  ...state,
  subtopicsWithTips: topicId
    ? {
      ...state.subtopicsWithTips,
      [topicId]: {
        ...state.subtopicsWithTips[topicId],
        tips: state.subtopicsWithTips[topicId].tips.map(
          item => (item.id === tipId ? unstarTip(item) : item)
        )
      }
    }
    : {}
});

const likeTipSuccess = (state, { tipId, topicId }) => ({
  ...state,
  subtopicsWithTips: {
    ...state.subtopicsWithTips,
    [topicId]: {
      ...state.subtopicsWithTips[topicId],
      tips: state.subtopicsWithTips[topicId].tips.map(
        item => (item.id === tipId ? likeTipAndIncCount(item) : item)
      )
    }
  }
});

const unlikeTipSuccess = (state, { tipId, topicId }) => ({
  ...state,
  subtopicsWithTips: {
    ...state.subtopicsWithTips,
    [topicId]: {
      ...state.subtopicsWithTips[topicId],
      tips: state.subtopicsWithTips[topicId].tips.map(
        item => (item.id === tipId ? unlikeTipAndDecCount(item) : item)
      )
    }
  }
});


const reorderTips = (tips, toItem, fromItem) => {
  const newTips = [...tips];
  let fromItemData = { ...newTips[fromItem] };
  newTips[fromItem] = newTips[toItem];
  newTips[toItem] = fromItemData;
  return newTips;
};


const changeTaskTopicTipOrderSuccess = (
  state,
  {
    query: { dragIndex, hoverIndex, tip, fromTopic: { id: fromTopicId } },
    toTopic: { id: toTopicId }
  }
) => {
  const fromTopicTips = state.subtopicsWithTips[fromTopicId].tips;
  let previousTipDragIndex;

  // dragging tip into another subtopics
  if (fromTopicId !== toTopicId) {
    const toTopicTips = state.subtopicsWithTips[toTopicId].tips;
    const isDragTipIndex = toTopicTips.findIndex(x => x.id === tip.id);
    return {
      ...state,
      subtopicsWithTips: {
        ...state.subtopicsWithTips,
        [toTopicId]: {
          ...state.subtopicsWithTips[toTopicId],
          tips: isDragTipIndex !== -1 ?
            reorderTips(toTopicTips, hoverIndex, isDragTipIndex) : [
              ...toTopicTips.slice(0, hoverIndex),
              tip,
              ...toTopicTips.slice(hoverIndex)
            ]
        }
      }
    };
  }

  previousTipDragIndex = fromTopicTips.findIndex(data => data.id === tip.id);
  return {
    ...state,
    subtopicsWithTips: {
      ...state.subtopicsWithTips,
      [fromTopicId]: {
        ...state.subtopicsWithTips[fromTopicId],
        tips: reorderTips(
          fromTopicTips,
          hoverIndex,
          previousTipDragIndex !== -1 ? previousTipDragIndex : dragIndex
        )
      }
    }
  };
};

const addTopicTipSuccess = (state, { topicId, tip }) => ({
  ...state,
  subtopicsWithTips: {
    ...state.subtopicsWithTips,
    [topicId]: {
      ...state.subtopicsWithTips[topicId],
      tips: state.subtopicsWithTips[topicId].tips.filter(x => x.id === tip.id).length ?
        state.subtopicsWithTips[topicId].tips : [
          ...state.subtopicsWithTips[topicId].tips, tip
        ]

    }
  }
});

const removeTopicTipSuccess = (state, { topicId, tip }) => ({
  ...state,
  subtopicsWithTips: {
    ...state.subtopicsWithTips,
    [topicId]: {
      ...state.subtopicsWithTips[topicId],
      tips: state.subtopicsWithTips[topicId].tips.filter(x => x.id !== tip.id)
    }
  }
});

const addTipIntoTaskTopicSuccess = (state, { tip, toTopic: { id: topicId } }) => {
  const removeTopicsTip = excludeTip(tip.id)(state.subtopicsWithTips[topicId].tips);

  droppedTipIndex = isNil(droppedTipIndex) ? 0 : droppedTipIndex;

  return {
    ...state,
    subtopicsWithTips: {
      ...state.subtopicsWithTips,
      [topicId]: {
        ...state.subtopicsWithTips[topicId],

        tips: uniqById([
          ...removeTopicsTip.slice(0, droppedTipIndex),
          tip,
          ...removeTopicsTip.slice(droppedTipIndex)
        ])
      }
    }
  };
};

const moveTipIntoTaskTopicSuccess = (state, { tip, fromTopic, toTopic }) => {
  const fromTopicId = fromTopic.id;
  const toTopicId = toTopic.id;
  const fromTopicWithTips = state.subtopicsWithTips[fromTopicId];
  const toTopicWithTips = state.subtopicsWithTips[toTopicId];
  const removeTopicsTips = toTopicWithTips.tips.filter(x => x.id !== tip.id);
  droppedTipIndex = isNil(droppedTipIndex) ? 0 : droppedTipIndex;

  const newState = {
    ...state,
    subtopicsWithTips: {
      ...state.subtopicsWithTips,
      [fromTopicId]: {
        ...fromTopicWithTips,
        tips: fromTopicWithTips.tips.filter(x => x.id !== tip.id)
      },
      [toTopicId]: {
        ...toTopicWithTips,
        tips: uniqById([
          ...removeTopicsTips.slice(0, droppedTipIndex),
          tip,
          ...removeTopicsTips.slice(droppedTipIndex)
        ])
      }
    }
  };
  return newState;
};

const updateTopicViewSuccess = (state, payload) => ({
  ...state,
  topic: setViewTopic(payload)(state.topic)
});

const reorderTaskTopicTipSuccess = (state, { dragIndex = 0 }) => {
  droppedTipIndex = dragIndex;
  return state;
};

const updateTopicSuccess = (state, { topic }) => ({
  ...state,
  topic,
  isTopicUpdating: false
});

const deleteSubtopicRequest = (state, { topicID }) => ({
  ...state,
  subtopics: state.subtopics.filter(x => x.id !== topicID)
});

const setSaveTipInTaskTopicLoading = state => ({
  ...state,
  isSaveTipInTaskTopicLoading: true
});
const setUpdateTipInTopicLoading = state => ({...state, isUpdatingTipInTopicLoading: true});
const setSaveTipInTaskTopicSuccess = (state, { tip, topicId }) => ({
  ...state,
  isSaveTipInTaskTopicLoading: false,
  subtopicsWithTips: {
    ...state.subtopicsWithTips,
    [topicId]: {
      tips: [tip, ...state.subtopicsWithTips[topicId].tips]
    }
  }
});

const setSaveTipInTopicSuccess= (state, {tip, topicId, parentTipId}) =>{
  let newCard = {"id": tip.id,"topic": tip.relationships.topics.data[0] , "title": tip.attributes.title,
  isCard:true,"relationships": tip.relationships, "attributes": tip.attributes, "parent_tip": parentTipId};
  return({
      ...state,
      wiki: {
        ...state.wiki,
        newlyAddedTip: newCard
      }
    })
};

const updateTipInTopicSuccess = (state, {tip, topicId, view: activeTipView}) => {
  if(activeTipView !== VIEWS_ENUM.WIKI )
    {
      for(let key in state.subtopicsWithTips) {
        if(state.subtopicsWithTips.hasOwnProperty(key)) {
          state.subtopicsWithTips[key] ={
            ...state.subtopicsWithTips[key],
            tips: state.subtopicsWithTips[key].tips.map(
              item => (item.id === tip.id ? tip : item)
            )
          }
        }
      }
      return ({
        ...state,
        isUpdatingTipInTopicLoading: false,
        subtopicsWithTips: {...state.subtopicsWithTips},
        wiki: {
          ...state.wiki,
          selectedTip: activeTipView === VIEWS_ENUM.WIKI ?  tip : state.wiki.selectedTip
        }
      })
    }
    else
    {
      let topic = tip.relationships.topics.data.filter(x=>x.id == topicId);     
      let card = {"id": tip.id,"topic": (topic !== null && topic !== undefined && topic.length > 0 ? topic[0] : tip.relationships.topics.data[0]) , 
      "title": tip.attributes.title, "isCard":true,"relationships": tip.relationships, "attributes": tip.attributes};
      return({
        ...state,
        wiki: {
          ...state.wiki,
          updatedTip: card
        }
      })
    }
};

const deleteTipInTaskTopicSuccess = (state, {tipId, topicId, view:activeTipView }) =>{ 
    if(activeTipView !== VIEWS_ENUM.WIKI )
    {
      return ({
        ...state,
        subtopicsWithTips: {
          ...state.subtopicsWithTips,
          [topicId]: {
            ...state.subtopicsWithTips[topicId],
            tips: state.subtopicsWithTips[topicId].tips.filter(x => x.id !== tipId)
          }
        }
      })
  }
  else
  {
    return ({
      ...state,
      wiki: {
        ...state.wiki,
        selectedTip:((state.subtopicsWithTipsWiki[0] !== undefined && state.subtopicsWithTipsWiki[0].isCard === true)?state.subtopicsWithTipsWiki[0]:null)
      }
    })
  }
}

const archiveTipInTaskTopicRequest = (state, { tipId, topicId }) => ({
  ...state,
  subtopicsWithTips: {
    ...state.subtopicsWithTips,
    [topicId]: {
      ...state.subtopicsWithTips[topicId],
      tips: state.subtopicsWithTips[topicId].tips.map(
        item => (item.id === tipId ? deactivateTip(item) : item)
      )
    }
  }
});

const archiveTipInTaskTopicSuccess = (state, {tip, topicId, view:activeTipView}) =>{ 
  if(activeTipView !== VIEWS_ENUM.WIKI )
    {
      return({
        ...state,
        subtopicsWithTips: {
          ...state.subtopicsWithTips,
          [topicId]: {
            ...state.subtopicsWithTips[topicId],
            tips: state.subtopicsWithTips[topicId].tips.map(
              item => (item.id === tip.id ? tip : item)
            )
          }
        }
      })
  }
  else
  {
    return ({
      ...state,
      wiki: {
        ...state.wiki,
         selectedTip:((state.subtopicsWithTipsWiki[0] !== undefined && state.subtopicsWithTipsWiki[0].isCard === true)?state.subtopicsWithTipsWiki[0]:null)
      }
    })
  }
};

const updateTipInTaskTopicSuccess = (state, { tip, topicId }) => ({
  ...state,
  subtopicsWithTips: {
    ...state.subtopicsWithTips,
    [topicId]: {
      ...state.subtopicsWithTips[topicId],
      tips: state.subtopicsWithTips[topicId].tips.map(
        item => (item.id === tip.id ? tip : item)
      )
    }
  }
});

function addSubtopicInTopic(topicSubTopics, parentId, subtopic) {
  topicSubTopics.forEach(({ data }, index) => {
    const dataSubTopics = data.relationships.descendants.data;
    if (data.id === String(parentId)) {
      dataSubTopics.unshift(subtopic);
      topicSubTopics[index].data.relationships.descendants.data = dataSubTopics;
    } else {
      addSubtopicInTopic(dataSubTopics, parentId, subtopic);
    }
  });
  return topicSubTopics;
}

const createSubTopicInTaskViewLoading = state => ({
  ...state,
  isSubTopicInTaskViewSaving: true
});
const createSubTopicInTaskViewSuccess = (state, { subtopic }) => {
  let updateQuery;
  const parentId = subtopic.relationships.parent.data.id;
  const topicSubTopics = state.topic.relationships.descendants.data;
  const pushSubTopic = { data: subtopic };
  if (state.topic.id === String(parentId)) {
    updateQuery = {
      data: sortByDataTitleCaseInsensitive([pushSubTopic, ...topicSubTopics])
    };
  } else {
    const updatedSubTopics = addSubtopicInTopic(
      topicSubTopics,
      parentId,
      pushSubTopic
    );
    updateQuery = {
      data: sortByDataTitleCaseInsensitive(updatedSubTopics)
    };
  }
  return {
    ...state,
    isSubTopicInTaskViewSaving: false,
    topic: {
      ...state.topic,
      relationships: {
        ...state.topic.relationships,
        descendants: updateQuery
      }
    },

    subtopics:
      state.topic.id === String(parentId)
        ? sortByTitleCaseInsensitive([subtopic, ...state.subtopics])
        : state.subtopics
  };
};

const createSubTopicWithTitleSuccess= (state, {subtopic}) => {
  let card = {"id": subtopic.id, "title": subtopic.attributes.title,"attributes" : subtopic.attributes,
   "relationships": subtopic.relationships, isCard:false }
  return({
    ...state,
    isSubTopicInTaskViewSaving: false,
    wiki: {
        ...state.wiki,
        updatedSubTopic: card
    }
  })
};

function updateSubtopicInTopic(topicSubTopics, subtopic) {
  topicSubTopics.forEach(({ data }, index) => {
    const dataSubTopics = data.relationships.descendants.data;
    if (data.id === subtopic.id) {
      topicSubTopics[index].data = subtopic;
    } else {
      updateSubtopicInTopic(dataSubTopics, subtopic);
    }
  });
  return topicSubTopics;
}

function updateSubtopicTitleInTopic(topicSubTopics, topicId, title) {
  topicSubTopics.forEach(({ data }, index) => {
    const dataSubTopics = data.relationships.descendants.data;
    if (data.id === topicId) {
      topicSubTopics[index].data.attributes.title = title;
    } else {
      updateSubtopicTitleInTopic(dataSubTopics, topicId, title);
    }
  });
  return topicSubTopics;
}

const updateTopicInTaskViewSuccess = (state, { topic }) => {
  const topicSubTopics = state.topic.relationships.descendants.data;
  const updatedSubtopic = updateSubtopicInTopic(topicSubTopics, topic);
  return {
    ...state,
    isTopicUpdating: false,
    topic: {
      ...state.topic,
      relationships: {
        ...state.topic.relationships,
        descendants: { data: updatedSubtopic }
      }
    }
  };
};

const updateSubtopicInTaskViewSuccess = (state, { topicId, title }) => {
  const topicSubTopics = state.topic.relationships.descendants.data;
  const updatedSubtopic = updateSubtopicTitleInTopic(
    topicSubTopics,
    topicId,
    title
  );
  return {
    ...state,
    topic: {
      ...state.topic,
      relationships: {
        ...state.topic.relationships,
        descendants: { data: updatedSubtopic }
      }
    }
  };
};
const setSelectedTipForWikiView = (state, {tip}) => ({
  ...state, 
  wiki: {selectedTip: tip}, 
  subtopicsWithTipsWiki : (tip !== null ? [...state.subtopicsWithTipsWiki]: [])
});

const setTipNestedTipsSuccess = (state, {tipId, tips}) => ({
  ...state,
  tipsWithNestedTips: {
    ...state.tipsWithNestedTips,
    [tipId]: {tips}
  }
});

const setTopicTipsWikiLoading = (state, {topicId, isSubtopic}) => ({ 
  ...state,
  subtopicsWithTipsWiki:(isSubtopic ? [...state.subtopicsWithTipsWiki]: []),
    wiki: {
      ...state.wiki,
      isLoading : (isSubtopic ? false: true)
    }
});

const changeTopicTipOrderWikiSuccess= (state, {treeData}) =>
{
  return({ 
  ...state,
  subtopicsWithTipsWiki: treeData.treeData
})
};

let childCards={};
const setTopicTipsWikiSuccess = (state, { tips, topicId, topic }) => {   
  let cardMap = [];
    let subTopicCardsMap = {};
    let cardsWithoutSubTopics = [];
    let nestedCards = {};
    let cardsTree=[];
    let subtopicTree=[];   
    if(tips !== undefined && topic !== null && topic !== undefined)
    {
    for (let i = 0, length = tips.length; length > i; i += 1) {
        cardMap[tips[i].id] = tips[i];      
        let subtopicsList =  tips[i].relationships.subtopics.data.filter(x => x.hive_slug === topic.attributes.slug);
        if (subtopicsList !== null && subtopicsList !== undefined && subtopicsList.length > 0) {
            for (let j = 0, sLength = subtopicsList.length; j < sLength; j++) {
                let cards1 = [];
              
                if (subTopicCardsMap[subtopicsList[j].id] != undefined) {
                    cards1 = subTopicCardsMap[subtopicsList[j].id];
                }
                cards1.push({ "id":tips[i].id, "title": tips[i].attributes.title,"topic":subtopicsList[j], "isCard":true,"relationships": tips[i].relationships, "attributes": tips[i].attributes });
                subTopicCardsMap[subtopicsList[j].id] = cards1;
            }
            for (let j = 0, sLength = tips[i].relationships.nested_tips.data.length; j < sLength; j++) {
              childCards[tips[i].relationships.nested_tips.data[j].id]=true;
            }
        }
        else {
            cardsWithoutSubTopics.push(tips[i]);
            for (let j = 0, sLength = tips[i].relationships.nested_tips.data.length; j < sLength; j++) {
              childCards[tips[i].relationships.nested_tips.data[j].id]=true;
            }
        }
    }
    if(topic !== null && topic !== undefined)
    {
      let subTopics = topic.relationships.descendants.data;         
      subtopicTree = getSubTopicTree(subTopics, subTopicCardsMap, cardMap, cardsTree);    
      cardsTree = getCardsTree(cardsWithoutSubTopics, cardMap,false,cardsTree, topic, null);     
      return ({
        ...state,
        subtopicsWithTipsWiki: [...cardsTree, ...subtopicTree],
        wiki: {
          ...state.wiki,
          isLoading : false
        }
        })
    }
  }
  return ({
  ...state,
  subtopicsWithTipsWiki: [...state.subtopicsWithTipsWiki],
  wiki: {
    ...state.wiki,
    isLoading : false
  }
  })
};

const setSubTopicTipsWikiSuccess = (state, { tips, topicId, topic }) => {
  let cardMap = [];
    let subTopicCardsMap = {};
    let cardsWithoutSubTopics = [];
    let nestedCards = {};
    let cardsTree=[];
    let subtopicTree=[];   
    if(tips !== undefined)
    {     
    for (let i = 0, length = tips.length; length > i; i += 1) {
        cardMap[tips[i].id] = tips[i];
        if(tips[i].relationships.topics.data.length > 0)
        {
          if (find(tips[i].relationships.topics.data, { id: topicId })) {
            cardsWithoutSubTopics.push(tips[i]);
          }
        }        
    }   
    if(topic !== null && topic !== undefined)
    {
      cardsTree = getCardsTree(cardsWithoutSubTopics, cardMap,false,cardsTree, topic, null);
      
      let updatedSubtopicsWithTipsWiki = state.subtopicsWithTipsWiki;
      if(updatedSubtopicsWithTipsWiki !== undefined && updatedSubtopicsWithTipsWiki !== null)
      {
        addSubtopicCards(updatedSubtopicsWithTipsWiki, topicId, cardsTree);    
      }    
      return ({
        ...state,
        subtopicsWithTipsWiki: [...updatedSubtopicsWithTipsWiki]
        })
    }
  }
  return ({
  ...state,
  subtopicsWithTipsWiki: [...state.subtopicsWithTipsWiki]
  })
};

const addSubtopicCards = (subtopicTips, subtopicId, cardsTree) =>
{
  if(subtopicTips !== undefined && subtopicTips !== null)
  {
    subtopicTips.map((item) => {
      if(item.isCard == false)
      {
        if(item.id == subtopicId)
        {
          let childrenWithoutTempCard = (item.children !== undefined ? item.children.filter(x=>x.isTemp !== true) : []);
          item.children = [...cardsTree, ...childrenWithoutTempCard]
        }
        else
        {
          addSubtopicCards(item.children, subtopicId, cardsTree)
        }
      }
    });
  }
}

const getCardsTree = (cards, cardMap,isChild,cardsTree, topic, parent_tip) => {
  
  for(let i=0,length=cards.length;i<length;i++)
  {
      let item = cards[i];
      if(item !== undefined && item !== null)
      {
        if(isChild==false && childCards[item.id]==true)
        {
          continue;
        }

        let children = [];      
        if (!item.hasOwnProperty("attributes")) {
            item = cardMap[item.id];
        }

        if (item !== undefined && item !== null && item.relationships !== undefined && item.relationships !== null &&
          item.relationships.nested_tips !== undefined && item.relationships.nested_tips !== null &&
          item.relationships.nested_tips.data !== undefined &&  item.relationships.nested_tips.data !== null &&
          item.relationships.nested_tips.data.length > 0) {
            children = getCardsTree(item.relationships.nested_tips.data, cardMap,true,[],topic, item.id);
        }

        if(item !== undefined && item !== null)
        {
          cardsTree.push({"id": item.id,"topic": topic, "title": item.attributes.title,isCard:true,
          "relationships": item.relationships, "attributes": item.attributes, children: children,
          "parent_tip": parent_tip });
        }
      }
  }
  return cardsTree;
}

const getSubTopicTree= (subTopics, subTopicCardsMap,cardMap, cardsTree) => {
  subTopics = subTopics.map((item) => {
      let children = [];
      if (item.data.relationships.descendants.data.length > 0) {
          children = getSubTopicTree(item.data.relationships.descendants.data, subTopicCardsMap);
      }
      if (subTopicCardsMap[item.data.id] != null && subTopicCardsMap[item.data.id] != undefined) {          
          let temporaryCard=[];
          temporaryCard.push({"title": "", isTemp : true });         
          children = [...temporaryCard, ...children]
      }
      return {"id": item.data.id, "title": item.data.attributes.title,"attributes" : item.data.attributes, "relationships": item.data.relationships, isCard:false,isEdit:false, children: children }
  });
  return subTopics;
}

const setError = (state, payload) => ({
  ...state,
  error: payload
});
const setCreatingFirstTopic = state => ({
  ...state,
  isSavingFirstTopic: true
});
const createdFirstTopic = (state, payload) => ({
  ...state,
  isSavingFirstTopic: false,
  topic: payload
});
const setFirstTopicError = (state, payload) => ({
  ...state,
  isSavingFirstTopic: false,
  error: payload
});
const updateTipSuccess = (state, payload) => {
  let subtopicsWithTips = {};

  for (let [key, value] of Object.entries(state.subtopicsWithTips)) {
    subtopicsWithTips[key] = {
      isLoading: value.isLoading,
      tips: value.tips.map(item => (item.id === payload.id ? payload : item))
    };
  }

  return { ...state, subtopicsWithTips };
};



function removeSubtopicInTopic(topicSubTopics, topicId) {
  topicSubTopics.forEach(({ data }) => {
    const dataSubTopics = data.relationships.descendants.data;
    if (data.id === topicId) {
      topicSubTopics = topicSubTopics.filter(
        topic => topic.data.id !== topicId
      );
    } else {
      removeSubtopicInTopic(dataSubTopics, topicId);
    }
  });
  return topicSubTopics;
}

const removeTopic = (state, payload) => {
  const topicSubtopic = state.topic.relationships.descendants.data;
  const updatedSubtopics = removeSubtopicInTopic(topicSubtopic, payload.topicId);
  return {
    ...state,
    topic: {
      ...state.topic,
      relationships: {
        ...state.topic.relationships,
        descendants: { data: updatedSubtopics }
      }
    },
    subtopics: state.subtopics.filter(
      topic => topic.id !== payload.topicId
    )
  };
};


const topic = (state = initialState, { type, payload }) =>
  switchcaseF({
    [GET_TOPIC_REQUEST]: setTopicLoading,
    [GET_TOPIC_GROUP_REQUEST]: setGroupLoading,
    [GET_TOPIC_SUBTOPICS_REQUEST]: setSubtopicsLoading,
    [GET_TOPIC_SUCCESS]: setTopicSuccess,
    [GET_TOPIC_GROUP_SUCCESS]: setGroupSuccess,
    [GET_TOPIC_SUBTOPICS_SUCCESS]: setSubtopicsSuccess,
    [GET_TOPIC_FAILURE]: setError,
    [GET_TOPIC_GROUP_FAILURE]: setError,
    [GET_TOPIC_SUBTOPICS_FAILURE]: setError,
    [STAR_TOPIC_SUCCESS]: starTopicSuccess,
    [STAR_TOPIC_FAILURE]: setError,
    [UNSTAR_TOPIC_SUCCESS]: unstarTopicSuccess,
    [UNSTAR_TOPIC_FAILURE]: setError,
    [FOLLOW_TOPIC_SUCCESS]: followTopicSuccess,
    [FOLLOW_TOPIC_FAILURE]: setError,
    [UNFOLLOW_TOPIC_SUCCESS]: unfollowTopicSuccess,
    [UNFOLLOW_TOPIC_FAILURE]: setError,
    [UPDATE_TOPIC_SUBTOPIC_SUCCESS]: updateTopicSubtopicSucess,
    [UPDATE_TOPIC_SUBTOPIC_FAILURE]: setError,
    [SAVE_TOPIC_SUBTOPIC_FAILURE]: setError,
    [GET_TOPIC_TIPS_REQUEST]: setTopicTipsLoading,
    [GET_TOPIC_TIPS_SUCCESS]: setTopicTipsSuccess,
    [GET_TOPIC_TIPS_FAILURE]: setError,
    [GET_TOPIC_TIPS_WIKI_REQUEST]: setTopicTipsWikiLoading,
    [GET_TOPIC_TIPS_WIKI_SUCCESS]: setTopicTipsWikiSuccess,
    [GET_SUBTOPIC_TIPS_WIKI_SUCCESS]: setSubTopicTipsWikiSuccess,
    [GET_TOPIC_TIPS_WIKI_FAILURE]: setError,
    [STAR_TOPIC_TIP_FAILURE]: unstarTipSuccess,
    [STAR_TOPIC_TIP_SUCCESS]: starTipSuccess,
    [UNSTAR_TOPIC_TIP_FAILURE]: setError,
    [UNSTAR_TOPIC_TIP_SUCCESS]: unstarTipSuccess,
    [UNLIKE_TOPIC_TIP_FAILURE]: setError,
    [UNLIKE_TOPIC_TIP_SUCCESS]: unlikeTipSuccess,
    [LIKE_TOPIC_TIP_SUCCESS]: likeTipSuccess,
    [LIKE_TOPIC_TIP_FAILURE]: setError,
    [CHANGE_TASK_TOPIC_TIP_ORDER_SUCCESS]: changeTaskTopicTipOrderSuccess,
    [CHANGE_TOPIC_TIP_ORDER_FAILURE]: setError,
    [CHANGE_TOPIC_TIP_ORDER_WIKI_SUCCESS]: changeTopicTipOrderWikiSuccess,
    [CHANGE_TOPIC_TIP_ORDER_WIKI_FAILURE]: setError,    
    [ADD_TOPIC_TIP_SUCCESS]: addTopicTipSuccess,
    [ADD_TOPIC_TIP_FAILURE]: setError,
    [REMOVE_TOPIC_TIP_SUCCESS]: removeTopicTipSuccess,
    [REMOVE_TOPIC_TIP_FAILURE]: setError,
    [ADD_TIP_FROM_TASK_TOPIC_SUCCESS]: addTipIntoTaskTopicSuccess,
    [ADD_TIP_FROM_TOPIC_FAILURE]: setError,
    [MOVE_TIP_FROM_TASK_TOPIC_SUCCESS]: moveTipIntoTaskTopicSuccess,
    [MOVE_TIP_FROM_TOPIC_FAILURE]: setError,
    [UPDATE_TOPIC_VIEW_SUCCESS]: updateTopicViewSuccess,
    [UPDATE_TOPIC_VIEW_FAILURE]: setError,
    [REORDER_TASK_TOPIC_TIP_SUCCESS]: reorderTaskTopicTipSuccess,
    [REORDER_TOPIC_TIP_FAILURE]: setError,
    [UPDATE_TOPIC_REQUEST]: setTopicUpdating,
    [UPDATE_TOPIC_SUCCESS]: updateTopicSuccess,
    [DELETE_SUBTOPIC_REQUEST]: deleteSubtopicRequest,
    [DELETE_SUBTOPIC_FAILURE]: setError,
    [DELETE_SUBTOPIC_AND_MOVE_REQUEST]: deleteSubtopicRequest,
    [DELETE_SUBTOPIC_AND_MOVE_FAILURE]: setError,
    [SAVE_TIP_IN_TASK_TOPIC_REQUEST]: setSaveTipInTaskTopicLoading,
    [SAVE_TIP_IN_TASK_TOPIC_SUCCESS]: setSaveTipInTaskTopicSuccess,
    [SAVE_TIP_IN_TASK_TOPIC_FAILURE]: setError,
    [SAVE_TIP_IN_TOPIC_SUCCESS] : setSaveTipInTopicSuccess,
    [SAVE_FIRST_TOPIC_REQUEST]: setCreatingFirstTopic,
    [SAVE_FIRST_TOPIC_SUCCESS]: createdFirstTopic,
    [SAVE_FIRST_TOPIC_FAILURE]: setFirstTopicError,
    [DELETE_TIP_IN_TASK_TOPIC_SUCCESS]: deleteTipInTaskTopicSuccess,
    [DELETE_TIP_IN_TASK_TOPIC_FAILURE]: setError,
    [ARCHIVE_TIP_IN_TASK_TOPIC_REQUEST]: archiveTipInTaskTopicRequest,
    [ARCHIVE_TIP_IN_TASK_TOPIC_SUCCESS]: archiveTipInTaskTopicSuccess,
    [ARCHIVE_TIP_IN_TASK_TOPIC_FAILURE]: setError,
    [UPDATE_TIP_IN_TASK_TOPIC_SUCCESS]: updateTipInTaskTopicSuccess,
    [CREATE_SUBTOPIC_IN_TASK_VIEW_REQUEST]: createSubTopicInTaskViewLoading,
    [CREATE_SUBTOPIC_IN_TASK_VIEW_SUCCESS]: createSubTopicInTaskViewSuccess,
    [CREATE_SUBTOPICS_WITH_TITLE_SUCCESS] : createSubTopicWithTitleSuccess,
    [UPDATE_TOPIC_IN_TASK_VIEW_SUCCESS]: updateTopicInTaskViewSuccess,
    [UPDATE_SUBTOPIC_IN_TASK_VIEW_SUCCESS]: updateSubtopicInTaskViewSuccess,
    [SAVE_TOPIC_SUBTOPIC_SUCCESS]: addSubtopic,
    [ASSIGN_LABEL_SUCCESS]: assignLabelSuccess,
    [UNASSIGN_LABEL_FAILURE]: assignLabelSuccess,
    [ASSIGN_LABEL_FAILURE]: unassignLabelSuccess,
    [UNASSIGN_LABEL_SUCCESS]: unassignLabelSuccess,
    [REMOVE_GROUP_SUCCESS]: removeGroupSuccess,
    // [SAVE_TIP_SUCCESS]: saveTipSuccess,
    [UPDATE_TIP_SUCCESS]: updateTipSuccess,
    [DELETE_TOPIC_SUCCESS]: removeTopic,
    [DELETE_TOPIC_AND_MOVE_SUCCESS]: removeTopic,
    [DELETE_SUBTOPIC_SUCCESS]: removeTopic,
    [DELETE_SUBTOPIC_AND_MOVE_SUCCESS]: removeTopic,
    [SET_SELECTED_TIP_FOR_WIKI_VIEW_SUCCESS]: setSelectedTipForWikiView,
    [SET_SELECTED_TIP_FOR_WIKI_VIEW_FAILURE]: setError,
    [SET_TIP_NESTED_TIPS_SUCCESS]: setTipNestedTipsSuccess,
    [SET_TIP_NESTED_TIPS_FAILURE]: setError,
    [UPDATE_TIP_IN_TOPIC_REQUEST]: setUpdateTipInTopicLoading,
    [UPDATE_TIP_IN_TOPIC_SUCCESS]: updateTipInTopicSuccess,
    [UPDATE_TIP_IN_TOPIC_FAILURE]: setError,
    [SET_TOPIC_ACTIVE_VIEW_SUCCESS]: setTopicActiveViewSuccess
  })(state)(type)(state, payload);

export default topic;
