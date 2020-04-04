/* global vex */
import { stateMappings } from 'Src/newRedux/stateMappings';
import Ability from 'Lib/ability';
import analytics from 'Lib/analytics';
import {
  returnRecordWithRemovedOrReplacedValueInArrayForAttribute,
  toggleItemInclusionInArray
} from 'Lib/utilities';
import { success, failure } from 'Utils/toast';
import set from 'lodash/set';
import compact from 'lodash/compact';
import { addCards, changeCards } from 'Src/newRedux/database/cards/actions';
import { getCardsByTopic } from 'Src/newRedux/database/cards/selectors';
import { getGroups } from 'Src/newRedux/database/groups/thunks';
import { changeUser } from 'Src/newRedux/database/user/actions';
import { getTopicsByParentTopic } from './selectors';
import { getTopicFilters } from 'Src/newRedux/filters/selectors';
import {
  addTopics,
  changeTopic,
  changeTopics,
  deleteTopic,
  addTopicDesign,
  updateTopicDesign,
  deleteTopicDesign,
  activateTopicDesign,
  setDefaultDesign
} from './actions';
import api from './apiCalls';
import { deNormalizeTopic, normalizeTopic, normalizeTopics } from './schema';
import { updateOrCreateTopicOrderFromTopicMove } from 'Src/newRedux/database/topicOrders/abstractions';
import { batchActions } from 'redux-batch-enhancer';
import { mergeUserAttributes } from 'Src/newRedux/database/user/actions';
import { logRollBarError } from 'Lib/rollbar';
import { setSelectTopicDestinationModalOpen } from 'Src/newRedux/interface/modals/actions';
import { isDeletingTopic } from 'Src/newRedux/interface/loadIndicators/actions';
import { updateUserUiSettings } from 'Src/newRedux/database/user/thunks';
import { topicDesignLoader } from 'Src/newRedux/interface/views/actions';

export const createTopicDesign = newTopicDesign => async dispatch => {
  try {
    dispatch(topicDesignLoader({ topicDesignLoading: true }));
    const newServerDesign = await api.postTopicDesign(newTopicDesign);
    dispatch(addTopicDesign(newServerDesign.data));
    dispatch(selectTopicDesign(newServerDesign.data.data.id));
    dispatch(topicDesignLoader({ topicDesignLoading: false }));
    return newServerDesign;
  } catch (error) {
    failure('Unable to create new topic design');
    logRollBarError(error, 'warning', 'Create topic design Error');
    return null;
  }
};

export const changeTopicDesign = newTopicDesign => async dispatch => {
  try {
    dispatch(topicDesignLoader({ topicDesignLoading: true }));
    const {
      data: {
        data: { id, attributes }
      }
    } = await api.updateTopicDesign(newTopicDesign);
    dispatch(updateTopicDesign({ id, ...attributes }));
    dispatch(topicDesignLoader({ topicDesignLoading: false }));
    return;
  } catch (error) {
    failure('Unable to update topic design');
    logRollBarError(error, 'warning', 'Update topic design Error');
    return null;
  }
};

export const removeTopicDesign = (id, topic_id) => async dispatch => {
  try {
    dispatch(topicDesignLoader({ topicDesignLoading: true }));
    await api.deleteTopicDesign(id);
    dispatch(deleteTopicDesign({ id, topic_id }));
    dispatch(topicDesignLoader({ topicDesignLoading: false }));
    return '';
  } catch (error) {
    failure('Unable to delete topic design');
    logRollBarError(error, 'warning', 'Delete topic design Error');
    return null;
  }
};

export const selectTopicDesign = id => async dispatch => {
  try {
    dispatch(topicDesignLoader({ topicDesignLoading: true }));
    const topicDesign = await api.activateDesign(id);
    dispatch(activateTopicDesign(topicDesign.data));
    dispatch(topicDesignLoader({ topicDesignLoading: false }));
    return topicDesign;
  } catch (error) {
    failure('Unable to activate topic design');
    logRollBarError(error, 'warning', 'Activate topic design Error');
    return null;
  }
};

export const activateDefaultDesign = payload => async dispatch => {
  try {
    dispatch(topicDesignLoader({ topicDesignLoading: true }));
    const topicDesign = await api.defaultDesign(payload);
    dispatch(setDefaultDesign(payload));
    dispatch(topicDesignLoader({ topicDesignLoading: false }));
    return topicDesign;
  } catch (error) {
    failure('Failed to set default design');
    logRollBarError(error, 'warning', 'Activate topic design Error');
    return null;
  }
};

export const createTopic = newTopic => async (dispatch, getState) => {
  try {
    const newServerTopic = await api.postTopic(newTopic);
    const userFollowedTopics = [
      ...stateMappings(getState()).user.relationships.following_topics.data,
      newServerTopic.data.data.id
    ];
    //Add topic to redux, and add it to topics user follows (in redux only, as server does this for us, we just don't update the user_follows at this moment)
    dispatch(
      batchActions([
        addTopics(normalizeTopic(newServerTopic).topics),
        mergeUserAttributes({
          relationships: { following_topics: { data: userFollowedTopics } }
        })
      ])
    );

    analytics.track('Topic Created', {
      id: newServerTopic.data.data.id,
      title: newServerTopic.data.data.attributes.title
    });

    success('New yay created!');
    return newServerTopic;
  } catch (error) {
    failure('Unable to save new yay');
    logRollBarError(error, 'warning', 'Create yay Error');
    return null;
  }
};

export const getTopic = ({ topicSlug, topicId }) => async dispatch => {
  try {
    const topicData = await api.fetchTopic({ topicSlug, topicId });
    dispatch(addTopics(normalizeTopic(topicData).topics));
    return topicData;
  } catch (error) {
    failure('Unable to load yay');
    logRollBarError(error, 'warning', 'Get yay Error');
    return null;
  }
};

export const getTopics = ({
  createdBy,
  followedBy,
  pageNumber,
  pageSize,
  parentTopicId,
  sharedWith,
  type
}) => async (dispatch, getState) => {
  const sm = stateMappings(getState());
  const userId = sm.user.id;
  const topicFilters = getTopicFilters(getState());
  const filterToFollows =
    !followedBy && !topicFilters.map(filter => filter.key).includes('ALL');

  const fetchQueries = [
    createdBy && '&filter[created_by]=' + createdBy,
    followedBy && '&filter[followed_by_user]=' + followedBy,
    sharedWith && '&filter[shared_with]=' + sharedWith,
    type && '&filter[type]=' + type,
    parentTopicId && '&parent_id=' + parentTopicId,
    `&page[size]=${pageSize || 99}`,
    pageNumber && '&page[number]=' + pageNumber,
    filterToFollows && '&filter[followed_by_user]=' + userId //this to filter topics on personal workspace
  ];

  const fetchQuery = compact(fetchQueries).join('');
  try {
    const topicsData = await api.fetchTopics(fetchQuery);
    dispatch(addTopics(normalizeTopics(topicsData).topics));
    return topicsData;
  } catch (error) {
    failure('Unable to load yays');
    logRollBarError(error, 'warning', 'Get Topics Error');
    return null;
  }
};

export const moveTopicContents = ({ destinationTopicId, topicId }) => async (
  dispatch,
  getState
) => {
  try {
    const state = getState();
    const sm = stateMappings(state);
    const thisTopicsCards = getCardsByTopic(state)[topicId] || [];
    const destinationTopic = sm.topics[destinationTopicId];
    const cardUpdates = thisTopicsCards.map(card =>
      returnRecordWithRemovedOrReplacedValueInArrayForAttribute({
        record: card,
        attributePath: 'relationships.topics.data',
        oldValue: topicId,
        newValue: destinationTopicId
      })
    );

    const thisTopicsSubtopics = getTopicsByParentTopic(state)[topicId] || [];
    const topicUpdates = thisTopicsSubtopics.map(topic => {
      const topicClone = { ...topic };
      const topicPath = [destinationTopic, topicClone].map(top => ({
        id: top.id,
        type: 'topics',
        title: top.attributes.title,
        slug: top.attributes.slug
      }));
      set(topicClone, 'relationships.parent.data', destinationTopicId);
      set(topicClone, 'attributes.path', topicPath);
      return topicClone;
    });
    const data = {
      data: {
        alternate_topic_id: destinationTopicId,
        move_tip_ids: 'all'
      }
    };
    const serverUpdate = await api.postActionOnTopic({
      topicId: topicId,
      action: 'move',
      data
    });
    const normalizedTopic = normalizeTopic(serverUpdate).topics;
    dispatch(changeCards(cardUpdates));
    dispatch(changeTopics(topicUpdates));
    dispatch(addTopics(normalizedTopic));
    dispatch(setSelectTopicDestinationModalOpen(topicId, false, 'move'));
  } catch (error) {
    failure('Unable to move yay contents');
    logRollBarError(error, 'warning', 'Move Topic Error');
    return null;
  }
};

export const moveTopic = ({
  afterTopicId,
  beforeTopicId,
  parentTopicId,
  topic
}) => dispatch => {
  if (afterTopicId || beforeTopicId) {
    dispatch(
      updateOrCreateTopicOrderFromTopicMove({
        afterTopicId,
        beforeTopicId,
        movedTopicId: topic.id,
        parentTopicId
      })
    );
  }
};

export const moveOrCopyTopicInOrToTopic = ({
  afterTopicId,
  beforeTopicId,
  topic,
  fromTopicId,
  toTopicId
}) => dispatch => {
  if (Ability.can('update', 'self', topic)) {
    const dispatches = [];

    if (fromTopicId && toTopicId && fromTopicId != toTopicId) {
      const attributes = { parent_id: toTopicId };
      dispatches.push(updateTopic({ id: topic.id, attributes }));
    }

    if (afterTopicId || beforeTopicId) {
      dispatches.push(
        updateOrCreateTopicOrderFromTopicMove({
          afterTopicId,
          beforeTopicId,
          movedTopicId: topic.id,
          parentTopicId: toTopicId
        })
      );
    }

    dispatch(batchActions(dispatches));
  } else {
    failure("You don't have permission to move that topic!");
  }
};

export const removeTopic = topicId => async (dispatch, getState) => {
  vex.dialog.confirm({
    message: 'Are you sure you want to delete this yay?',
    callback: async value => {
      if (value) {
        dispatch(isDeletingTopic(topicId));
        try {
          await api.deleteTopic(topicId);
        } catch (error) {
          failure('Unable to remove yay');
          dispatch(isDeletingTopic(null));
        }

        const sm = stateMappings(getState());
        const thisTopic = sm.topics[topicId];
        dispatch(deleteTopic(topicId));

        const history = sm.routing.routerHistory;
        const rootUrl = sm.page.rootUrl;
        const baseUrl = rootUrl == '/' ? rootUrl : rootUrl + '/';
        const topicPath = thisTopic.attributes.path;
        const prevTopic = topicPath[topicPath.length - 2];
        const slug = prevTopic ? prevTopic.slug : '';

        const currentPath = sm.routing.routerHistory.location.pathname;
        currentPath === '/'
          ? history.push(`${baseUrl}`)
          : history.push(`${baseUrl}yays/${slug}`);
      }
    }
  });
};

export const removeTopicAndMoveContent = (
  topicId,
  destinationTopicId
) => async (dispatch, getState) => {
  const sm = stateMappings(getState());
  const thisTopic = sm.topics[topicId];

  try {
    const originalTopicsCards = getCardsByTopic(getState())[topicId] || [];
    const originalTopicsSubtopics =
      getTopicsByParentTopic(getState())[topicId] || [];

    const cardUpdates = originalTopicsCards.reduce((a, b) => {
      const updatedCard = { ...b };
      set(
        updatedCard,
        'relationships.topics.data',
        updatedCard.relationships.topics.data.map(id =>
          id == topicId ? destinationTopicId : id
        )
      );
      set(a, `${b.id}`, updatedCard);
      return a;
    }, {});

    const subtopicUpdates = originalTopicsSubtopics.map(topic =>
      returnRecordWithRemovedOrReplacedValueInArrayForAttribute({
        record: topic,
        attributePath: 'attribute.parent_id',
        oldValue: topicId,
        newValue: destinationTopicId,
        isArrayAttrubuteValue: false
      })
    );
    //
    // const subtopicUpdates = originalTopicsSubtopics.reduce( (a, b) => {
    //   const updatedTopic = { ...b };
    //   set( updatedTopic, 'relationships.parent_topic.data', destinationTopicId);
    //   set( a, `${b.id}`, updatedTopic );
    //   return a;
    // }, {});
    dispatch(
      batchActions([
        deleteTopic(topicId),
        addCards(cardUpdates),
        changeTopics(subtopicUpdates)
      ])
    );

    const history = sm.routing.routerHistory;
    const rootUrl = sm.page.rootUrl;
    const baseUrl = rootUrl == '/' ? rootUrl : rootUrl + '/';
    const slug = sm.topics[destinationTopicId].attributes.slug;
    history.push(`${baseUrl}yays/${slug}`);

    await api.deleteTopicAndMoveContent(topicId, destinationTopicId);
  } catch (error) {
    failure('Unable to remove yay');
    dispatch(addTopics({ [thisTopic.id]: thisTopic }));
  }
};

export const toggleFollowTopic = topicId => async (dispatch, getState) => {
  const userFollowedTopics = [
    ...stateMappings(getState()).user.relationships.following_topics.data
  ];
  const revisedFollows = toggleItemInclusionInArray(
    topicId,
    userFollowedTopics
  );

  dispatch(
    changeUser({
      relationships: { following_topics: { data: revisedFollows } }
    })
  );
  api.postActionOnTopic({
    topicId: topicId,
    action: userFollowedTopics.includes(topicId) ? 'leave' : 'join'
  });
};

export const toggleStarTopic = topicId => async (dispatch, getState) => {
  const topic = stateMappings(getState()).topics[topicId];
  const topicIsStarred = topic.attributes.starred_by_current_user;
  api.postActionOnTopic({
    topicId: topicId,
    action: topicIsStarred ? 'unstar' : 'star'
  });
  dispatch(
    changeTopic({
      id: topicId,
      attributes: {
        ...topic.attributes,
        starred_by_current_user: !topicIsStarred
      },
      relationships: topic.relationships
    })
  );
};

export const updateTopic = ({
  attributes = {},
  id,
  relationships = {}
}) => async (dispatch, getState) => {
  const prevVersion = { ...getState()._newReduxTree.database.topics[id] };
  if (Ability.can('update', 'self', prevVersion)) {
    const newVersion = {
      ...prevVersion,
      attributes: { ...prevVersion.attributes, ...attributes },
      relationships: { ...prevVersion.relationships, ...relationships }
    };
    dispatch(changeTopic(newVersion));
    try {
      const updates = { id, attributes, relationships };
      const updatedTopic = await api.patchTopic(deNormalizeTopic(updates));
      //next line as share settings is generated at server:
      dispatch(
        batchActions([
          addTopics(normalizeTopic(updatedTopic).topics),
          // Should group followers change
          getGroups()
        ])
      );
      success('yay updated');
    } catch (error) {
      failure('Unable to save changes');
      logRollBarError(error, 'warning', 'Update Topic Error');
      dispatch(changeTopic(prevVersion));
    }
  } else {
    failure("You don't have permission to make changes to this yay");
  }
};

export const viewTopic = ({ topicId, topicSlug }) => (dispatch, getState) => {
  const sm = stateMappings(getState());
  const history = sm.routing.routerHistory;
  const rootUrl = sm.page.rootUrl;
  const baseUrl = rootUrl == '/' ? rootUrl : rootUrl + '/';
  const slug =
    topicSlug || stateMappings(getState()).topics[topicId].attributes.slug;
  history.push(`${baseUrl}yays/${slug}`);
};

/**
 * Toggle hide/show cards of a topic.
 *
 * @param {Object}  topic
 * @return {Void}
 */
export const toggleHideCards = (topic, setAsDefault = false) => {
  return async (dispatch, getState) => {
    const sm = stateMappings(getState());
    const { topics, user, page } = sm;
    // copy object to prevent direct state mutation
    const topicCopy = { ...topics[topic.id] };

    const { attributes } = topicCopy;
    const { cards_hidden } = attributes;
    topicCopy.attributes.cards_hidden = !cards_hidden;

    try {
      // Optimistic UI, revert when failed.
      const currentSettings = user.attributes.ui_settings.my_topics_view.find(
        item => item.id === page.topicId
      );
      const updatedSettings = [
        ...user.attributes.ui_settings.my_topics_view.filter(
          item => item.id !== page.topicId
        ),
        {
          id: page.topicId,
          view: currentSettings ? currentSettings.view : null,
          cards_hidden: !currentSettings.cards_hidden,
          subtopic_view: currentSettings.subtopic_view,
          subtopic_panel_visible: !currentSettings.subtopic_panel_visible
            ? false
            : true
        }
      ];
      const newSettings = { my_topics_view: updatedSettings };
      dispatch(updateUserUiSettings({ newSettings }));

      if (setAsDefault) {
        dispatch(changeTopic(topicCopy));
        await api.patchTopic(topicCopy);
      }
    } catch (err) {
      dispatch(changeTopic({ ...topic }));
      failure('Unable to update yay');
      console.error(err);
    }
  };
};

/**
 * Determine whether topic has its cards hidden.
 *
 * @param {Object}  topic
 * @return  {Boolean}
 */
export const isCardsHidden = topic => {
  return (dispatch, getState) => {
    const sm = stateMappings(getState());
    const { user } = sm;
    const { my_topics_view } = user.attributes.ui_settings;
    const myTopicView = my_topics_view.find(item => item.id === topic.id);

    return (
      (myTopicView && myTopicView.cards_hidden) ||
      (topic && topic.attributes.cards_hidden)
    );
  };
};
