import {
  assocPath,
  inc,
  dec,
  compose,
  view,
  lensPath,
  concat,
  filter,
  uniqBy,
  prop
} from 'ramda';

import without from 'lodash/without';

const uniqById = uniqBy(prop('id'));

import toInt from 'lodash/toSafeInteger';
import { switchcaseF } from './utils';

import {
  GET_TIPS_FAILURE,
  GET_TIPS_SUCCESS,
  GET_TIPS_REQUEST,
  GET_TIPS_REQUEST_ROOT,
  GET_TIP_BY_SLUG_FAILURE,
  GET_TIP_BY_SLUG_SUCCESS,
  GET_TIP_BY_SLUG_REQUEST,
  REMOVE_TIP_SUCCESS,
  REMOVE_TIP_FAILURE,
  STAR_TIP_SUCCESS,
  STAR_TIP_FAILURE,
  UNSTAR_TIP_FAILURE,
  UNSTAR_TIP_SUCCESS,
  LIKE_TIP_FAILURE,
  LIKE_TIP_SUCCESS,
  UNLIKE_TIP_FAILURE,
  UNLIKE_TIP_SUCCESS,
  SAVE_TIP_FAILURE,
  SAVE_TIP_REQUEST,
  SAVE_TIP_SUCCESS,
  UPDATE_TIP_FAILURE,
  UPDATE_TIP_REQUEST,
  UPDATE_TIP_SUCCESS,
  ARCHIVE_TIP_FAILURE,
  ARCHIVE_TIP_SUCCESS,
  ARCHIVE_TIP_REQUEST,
  ASSIGN_LABEL_FAILURE,
  ASSIGN_LABEL_SUCCESS,
  UNASSIGN_LABEL_FAILURE,
  UNASSIGN_LABEL_SUCCESS,
  REMOVE_LABEL_SUCCESS,
  UPDATE_LABEL_SUCCESS,
  GET_TIPS_BY_USER_ID_REQUEST,
  GET_TIPS_BY_USER_ID_SUCCESS,
  GET_TIPS_BY_USER_ID_FAILURE,
  LOGOUT_USER,
  CHANGE_TOPIC_TIP_ORDER_SUCCESS,
  MOVE_TIP_FROM_TOPIC_SUCCESS,
  GET_TOPIC_REQUEST,
  REMOVE_ATTACHMENT_FROM_TIP,
  ADD_GROUP_SUCCESS,
  FILTER_GROUP_BY_SLUG,
  RESET_GROUP_FILTER,
  ADD_COMMENT_SUCCESS,
  REMOVE_COMMENT_SUCCESS,
  DELETE_TIP_IN_TASK_TOPIC_SUCCESS,
  FLUSH_TIP,
  TIP_CONNECTIONS_FAILURE,
  MOVE_CARD_AFTER_CARDS_IN_TOPIC_SUCCESS,
  COMPLETE_CARD_FAILURE,
  COMPLETE_CARD_REQUEST,
  RENAME_CARD_FAILURE,
  RENAME_CARD_REQUEST,
  UPDATE_CARD_DATES_REQUEST,
  UPDATE_CARD_DATES_FAILURE
} from 'AppConstants';

const initialState = {
  isSaving: null,
  isLoading: null,
  collection: [],
  tipBySlug: null,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0
};

const starTip = assocPath(['attributes', 'starred_by_current_user'], true);
const unstarTip = assocPath(['attributes', 'starred_by_current_user'], false);
const likes = view(lensPath(['attributes', 'likes_count']));
const incLikes = compose(inc, likes);
const decLikes = compose(dec, likes);
const comments = view(lensPath(['attributes', 'comments_count']));
const incComments = compose(inc, comments);
const decComments = compose(dec, comments);
const likeTip = assocPath(['attributes', 'liked_by_current_user'], true);
const unlikeTip = assocPath(['attributes', 'liked_by_current_user'], false);
const increaseCount = item =>
  assocPath(['attributes', 'likes_count'], incLikes(item), item);
const decreaseCount = item =>
  assocPath(['attributes', 'likes_count'], decLikes(item), item);
const increaseComments = item =>
  assocPath(['attributes', 'comments_count'], incComments(item), item);
const decreaseComments = item =>
  assocPath(['attributes', 'comments_count'], decComments(item), item);
const likeTipAndIncCount = compose(likeTip, increaseCount);
const unlikeTipAndDecCount = compose(unlikeTip, decreaseCount);
const deactivateTip = assocPath(['attributes', 'is_disabled'], true);
const assignLabel = assocPath(['relationships', 'labels', 'data']);
const viewLabels = view(lensPath(['relationships', 'labels', 'data']));

const flushTips = state => ({
  ...state,
  collection: [],
  tipBySlug: null,
  isLoading: null
});
const flushTipBySlug = state => ({
  ...state,
  tipBySlug: null
});
const setLoading = state => ({ ...state, error: null, isLoading: true });
const setLoadingRoot = state => ({ ...state, error: null, collection: [], isLoading: true });
const setUserTipsLoading = (state, payload) => ({
  ...state,
  error: null,
  isLoading: true,
  collection: payload === 1 ? [] : state.collection,
  currentPage: payload
});
const setTopicTipsLoading = state => ({
  ...state,
  isLoading: true,
  error: null,
  collection: [],
  currentPage: 1,
  totalPages: 1,
  totalCount: 0
});
const setError = (state, payload) => ({
  ...state,
  isLoading: false,
  error: payload
});
const getTipSuccess = (state, payload) => ({
  ...state,
  isLoading: false,
  tipBySlug: payload
});
const getTipsSuccess = (state, payload) => ({
  ...state,
  isLoading: false,
  tipBySlug: null,
  collection:
    payload.currentPage === 1
      ? uniqById(payload.tips)
      : uniqById([...state.collection, ...payload.tips]),
  totalCount: payload.totalCount,
  totalPages: payload.totalPages,
  currentPage: payload.currentPage
});
const removeTip = (state, payload) => ({
  ...state,
  collection: state.collection.filter(({ id }) => id !== payload)
});
const removeTipFromTask = (state, { tipId }) => ({
  ...state,
  collection: state.collection.filter(({ id }) => id !== tipId)
});
const archiveTipRequest = (state, payload) => ({
  ...state,
  collection: state.collection.map(
    item => item.id === payload ? deactivateTip(item) : item
  )
});
const archiveTipSuccess = (state, payload) => ({
  ...state,
  collection: state.collection.map(
    item => (item.id === payload.id ? payload : item)
  )
});
const starTipSuccess = (state, payload) => ({
  ...state,
  tipBySlug:
    state.tipBySlug !== null && state.tipBySlug.id === payload
      ? starTip(state.tipBySlug)
      : state.tipBySlug,
  collection: state.collection.map(
    item => (item.id === payload ? starTip(item) : item)
  )
});
const unstarTipSuccess = (state, payload) => ({
  ...state,
  tipBySlug:
    state.tipBySlug !== null && state.tipBySlug.id === payload
      ? unstarTip(state.tipBySlug)
      : state.tipBySlug,
  collection: state.collection.map(
    item => (item.id === payload ? unstarTip(item) : item)
  )
});
const likeTipSuccess = (state, payload) => ({
  ...state,
  tipBySlug:
    state.tipBySlug !== null && state.tipBySlug.id === payload
      ? likeTipAndIncCount(state.tipBySlug)
      : state.tipBySlug,
  collection: state.collection.map(
    item => (item.id === payload ? likeTipAndIncCount(item) : item)
  )
});
const unlikeTipSuccess = (state, payload) => ({
  ...state,
  tipBySlug:
    state.tipBySlug !== null && state.tipBySlug.id === payload
      ? unlikeTipAndDecCount(state.tipBySlug)
      : state.tipBySlug,
  collection: state.collection.map(
    item => (item.id === payload ? unlikeTipAndDecCount(item) : item)
  )
});

const commentTipSuccess = (state, payload) => ({
  ...state,
  tipBySlug:
    state.tipBySlug !== null && state.tipBySlug.id === payload.attributes.commentable_id
      ? increaseComments(state.tipBySlug)
      : state.tipBySlug,
  collection: state.collection.map(
    item => toInt(item.id) === toInt(payload.attributes.commentable_id)
      ? increaseComments(item)
      : item
  )
});
const uncommentTipSuccess = (state, payload) => ({
  ...state,
  tipBySlug:
    state.tipBySlug !== null && state.tipBySlug.id === payload.tipId
      ? decreaseComments(state.tipBySlug)
      : state.tipBySlug,
  collection: state.collection.map(
    item => toInt(item.id) === toInt(payload.tipId)
      ? decreaseComments(item)
      : item
  )
});

const saveRequest = state => ({ ...state, isSaving: true });
const saveSuccess = (state, payload) => ({
  ...state,
  isSaving: false,
  collection: [payload, ...state.collection]
});
const updateSuccess = (state, payload) => ({
  ...state,
  isSaving: false,
  tipBySlug:
    state.tipBySlug !== null && state.tipBySlug.id === payload.id
      ? payload
      : state.tipBySlug,
  collection: state.collection.map(
    item => (item.id === payload.id ? payload : item)
  )
});
const saveFailure = (state, payload) => ({
  ...state,
  isSaving: false,
  error: payload
});
const assignLabelSuccess = (state, payload) => ({
  ...state,
  collection: state.collection.map(
    item =>
      toInt(item.id) === toInt(payload.id)
        ? assignLabel(concat([payload.label], viewLabels(item)))(item)
        : item
  )
});
const unassignLabelSuccess = (state, payload) => {
  if(state.tipBySlug){
    return {
      ...state,
      tipBySlug: {
        ...state.tipBySlug,
        relationships: {
          ...state.tipBySlug.relationships,
          labels: {
            ...state.tipBySlug.relationships.labels,
              data: state.tipBySlug.relationships.labels.data.filter(
                label =>
                  toInt(label.id) !== toInt(payload.label.id)
              )
            }
          }
        }
      }
    }
  else{
    return {
      ...state,
      collection: state.collection.map(
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
      )}
    }
  };
const removeLabelSuccess = (state, payload) => ({
  ...state,
  collection: state.collection.map(item => {
    const labels = item.relationships.labels.data;
    item.relationships.labels.data = labels.filter(
      label => toInt(label.id) !== toInt(payload)
    );
    return item;
  })
});
const updateLabelSuccess = (state, payload) => ({
  ...state,
  collection: state.collection.map(item => {
    const { relationships: { labels: { data: labels } } } = item;
    item.relationships.labels.data = labels.map(
      label =>
        toInt(label.id) === toInt(payload.id)
          ? {
              id: payload.id,
              name: payload.attributes.name,
              kind: payload.attributes.kind,
              color: payload.attributes.color
            }
          : label
    );
    return item;
  })
});

const moveCardAfterCardsInTopicSuccess = (state, payload ) => {
  const updatedCollection = state.collection.filter(card => card.id != payload.card.id)
  updatedCollection.splice(payload.precedingTipsIds.length, 0, payload.card);
  return { ...state, collection: [...updatedCollection] }
}


const reorderTips = (tips, toItem, fromItem) => {
  const newTips = [...tips];
  let fromItemData = { ...newTips[fromItem] };
  newTips[fromItem] = newTips[toItem];
  newTips[toItem] = fromItemData;
  return newTips;
};

const changeTopicTipOrderSuccess = (
  state,
  { query: { dragIndex, hoverIndex } }
) => {
  const newState = {
    ...state,
    collection: reorderTips(state.collection, hoverIndex, dragIndex)
  };
  return newState;
};

const moveTipIntoTopicSuccess = (state, { tip }) => ({
  ...state,
  collection: state.collection.filter(x => x.id !== tip.id)
});
const removeAttachment = (state, payload) => {
  let tipBySlug = state.tipBySlug;

  if (tipBySlug !== null && tipBySlug.id === payload.tipId) {
    let { documents = [], images = [] } = tipBySlug.attributes.attachments_json;
    if (documents.length > 0) {
      documents = documents.filter(
        ({ id }) => toInt(id) !== toInt(payload.attachmentId)
      );
    }

    if (images.length > 0) {
      images = documents.filter(
        ({ id }) => toInt(id) !== toInt(payload.attachmentId)
      );
    }

    tipBySlug.attributes.attachments_json.documents = documents;
    tipBySlug.attributes.attachments_json.images = images;
  }

  return {
    ...state,
    collection: state.collection.map(tip => {
      if (tip.id === payload.tipId) {
        let { documents = [], images = [] } = tip.attributes.attachments_json;
        if (documents.length > 0) {
          documents = documents.filter(
            ({ id }) =>
              toInt(id) !== toInt(payload.attachmentId)
          );
        }

        if (images.length > 0) {
          images = documents.filter(
            ({ id }) =>
              toInt(id) !== toInt(payload.attachmentId)
          );
        }

        tip.attributes.attachments_json.documents = documents;
        tip.attributes.attachments_json.images = images;
      }

      return tip;
    }),
    tipBySlug
  };
};

const setCardCompletionPercentage = (
  state,
  id,
  completed_percentage,
  completion_date
) => {
  return {
    ...state,
    collection: state.collection.map(card => {
      if (card.id === id) {
        return {
          ...card,
          attributes: {
            ...card.attributes,
            completed_percentage,
            completion_date
          }
        };
      }

      return card;
    })
  };
};

const completeCardRequest = (state, { id, completion, date }) =>
  setCardCompletionPercentage(state, id, completion, date);

const completeCardFailure = (state, { id, previousDate, previousValue }) =>
  setCardCompletionPercentage(state, id, previousValue, previousDate);

const setCardTitle = (state, id, title) => {
  return {
    ...state,
    collection: state.collection.map(card => {
      if (card.id === id) {
        return {
          ...card,
          attributes: { ...card.attributes, title }
        };
      }

      return card;
    })
  }
};

const renameCardRequest = (state, { id, title }) => setCardTitle(state, id, title);
const renaemCardFailure = (state, { id, previousValue }) => setCardTitle(state, id, previousValue);

const setCardDates = (state, { id, start_date, due_date }) => {
  return {
    ...state,
    collection: state.collection.map(card => {
      if (card.id === id) {
        return {
          ...card,
          attributes: {
            ...card.attributes,
            start_date,
            due_date
          }
        };
      }

      return card;
    })
  };
};

const reset = () => initialState;

const tips = (state = initialState, { type, payload }) =>
  switchcaseF({
    [GET_TIP_BY_SLUG_REQUEST]: setLoading,
    [GET_TIPS_REQUEST]: setLoading,
    [GET_TIPS_REQUEST_ROOT]: setLoadingRoot,
    [GET_TIP_BY_SLUG_SUCCESS]: getTipSuccess,
    [GET_TIPS_SUCCESS]: getTipsSuccess,
    [GET_TIP_BY_SLUG_FAILURE]: setError,
    [GET_TIPS_FAILURE]: setError,
    [REMOVE_TIP_SUCCESS]: removeTip,
    [ARCHIVE_TIP_REQUEST]: archiveTipRequest,
    [ARCHIVE_TIP_SUCCESS]: archiveTipSuccess,
    [ARCHIVE_TIP_FAILURE]: setError,
    [REMOVE_TIP_FAILURE]: setError,
    [STAR_TIP_SUCCESS]: starTipSuccess,
    [UNSTAR_TIP_FAILURE]: starTipSuccess,
    [STAR_TIP_FAILURE]: unstarTipSuccess,
    [UNSTAR_TIP_SUCCESS]: unstarTipSuccess,
    [LIKE_TIP_SUCCESS]: likeTipSuccess,
    [UNLIKE_TIP_FAILURE]: likeTipSuccess,
    [LIKE_TIP_FAILURE]: unlikeTipSuccess,
    [UNLIKE_TIP_SUCCESS]: unlikeTipSuccess,
    [UPDATE_TIP_REQUEST]: saveRequest,
    [SAVE_TIP_REQUEST]: saveRequest,
    [SAVE_TIP_SUCCESS]: saveSuccess,
    [UPDATE_TIP_SUCCESS]: updateSuccess,
    [UPDATE_TIP_FAILURE]: saveFailure,
    [SAVE_TIP_FAILURE]: saveFailure,
    [ASSIGN_LABEL_SUCCESS]: assignLabelSuccess,
    [UNASSIGN_LABEL_FAILURE]: assignLabelSuccess,
    [ASSIGN_LABEL_FAILURE]: unassignLabelSuccess,
    [UNASSIGN_LABEL_SUCCESS]: unassignLabelSuccess,
    [REMOVE_LABEL_SUCCESS]: removeLabelSuccess,
    [UPDATE_LABEL_SUCCESS]: updateLabelSuccess,
    [GET_TIPS_BY_USER_ID_FAILURE]: setError,
    [GET_TIPS_BY_USER_ID_REQUEST]: setUserTipsLoading,
    [GET_TIPS_BY_USER_ID_SUCCESS]: getTipsSuccess,
    [LOGOUT_USER]: reset,
    [CHANGE_TOPIC_TIP_ORDER_SUCCESS]: changeTopicTipOrderSuccess,
    [MOVE_TIP_FROM_TOPIC_SUCCESS]: moveTipIntoTopicSuccess,
    [GET_TOPIC_REQUEST]: setTopicTipsLoading,
    [REMOVE_ATTACHMENT_FROM_TIP]: removeAttachment,
    [FILTER_GROUP_BY_SLUG]: flushTips,
    [RESET_GROUP_FILTER]: flushTips,
    [ADD_GROUP_SUCCESS]: flushTips,
    [ADD_COMMENT_SUCCESS]: commentTipSuccess,
    [REMOVE_COMMENT_SUCCESS]: uncommentTipSuccess,
    [DELETE_TIP_IN_TASK_TOPIC_SUCCESS]: removeTipFromTask,
    [FLUSH_TIP]: flushTipBySlug,
    [TIP_CONNECTIONS_FAILURE] : setError,
    [MOVE_CARD_AFTER_CARDS_IN_TOPIC_SUCCESS]: moveCardAfterCardsInTopicSuccess,
    [COMPLETE_CARD_REQUEST]: completeCardRequest,
    [COMPLETE_CARD_FAILURE]: completeCardFailure,
    [RENAME_CARD_REQUEST]: renameCardRequest,
    [RENAME_CARD_FAILURE]: renaemCardFailure,
    [UPDATE_CARD_DATES_REQUEST]: setCardDates,
    [UPDATE_CARD_DATES_FAILURE]: setCardDates
  })(state)(type)(state, payload);

export default tips;
