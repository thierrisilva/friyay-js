import { createSelector } from 'reselect';
import { stateMappings } from 'Src/newRedux/stateMappings';
import compact from 'lodash/compact';
import get from 'lodash/get';
import { topicFilters } from 'Lib/config/filters/topics';
import { applyFilters } from 'Lib/utilities';
import {
  getRelevantTopicOrderForTopic,
  getRelevantTopicOrderByTopic
} from 'Src/newRedux/database/topicOrders/selectors';
import { topicGroupFilter } from 'Lib/config/filters/other';

export const getTopics = state => state._newReduxTree.database.topics;

export const getTopicArray = createSelector(
  state => getTopics(state),
  topics => Object.values(topics)
);

export const getSortedTopicArray = createSelector(
  state => getTopicArray(state),
  topics =>
    topics.sort((a, b) =>
      a.attributes.title
        .toLowerCase()
        .localeCompare(b.attributes.title.toLowerCase())
    )
);

export const getTopicsByParentTopic = createSelector(
  state => getTopicArray(state),
  topics =>
    topics.reduce((a, b) => {
      const parentTopicId = b.attributes.path
        ? b.attributes.path.length > 1
          ? b.attributes.path[b.attributes.path.length - 2].id
          : 0
        : 'exclude'; //this because topics coming nested in cards (that we use for path component) don't have their path with them

      a[parentTopicId] = a[parentTopicId] ? [...a[parentTopicId], b] : [b];
      return a;
    }, {})
);

export const getSortedTopicsByParentTopic = createSelector(
  state => getTopicsByParentTopic(state),
  state => getRelevantTopicOrderByTopic(state),
  (topicsByTopic, topicOrdersByTopic) =>
    Object.keys(topicsByTopic).reduce((a, b) => {
      const relevantOrder = topicOrdersByTopic[b];
      const subtopicOrder = relevantOrder
        ? get(relevantOrder, 'attributes.subtopic_order', [])
        : [];
      a[b] = sortByOrderAndAlpha(topicsByTopic[b], subtopicOrder) || [];
      return a;
    }, {})
);

export const getSortedFilteredTopicsByParentTopic = createSelector(
  state => getSortedTopicsByParentTopic(state),
  state => stateMappings(state).filters.topicFilters,
  state => stateMappings(state).user,
  state => stateMappings(state).page.groupId,
  state => stateMappings(state).groups,
  (sortedTopicsByTopic, topicFilterKeys, user, groupId, groups) =>
    Object.keys(sortedTopicsByTopic).reduce((a, b) => {
      const sortedTopicsForTopic = sortedTopicsByTopic[b];
      const filters = compact([
        ...topicFilterKeys.map(key => topicFilters[key].filter(user)),
        groupId &&
          topicGroupFilter(
            get(groups[groupId], 'relationships.following_topics.data', [])
          )
      ]);
      const filteredTopicsForTopic = applyFilters(
        sortedTopicsForTopic,
        filters,
        true
      );
      a[b] = filteredTopicsForTopic;
      return a;
    }, {})
);

export const instanceOfGetSortedTopicsForTopic = () => {
  const getSortedTopicsForTopic = createSelector(
    //pass null for  topics
    (state, topicId) => topicId,
    (state, topicId) => getRelevantTopicOrderForTopic(state, topicId || '0'),
    state => getTopicArray(state),
    (topicId, topicOrder, topics) => {
      const topicsOrSubtopics = topics.filter(topic =>
        topicId && topicId != '0'
          ? topic.attributes.kind == 'Subtopic' &&
            topic.attributes.path[topic.attributes.path.length - 2].id ==
              topicId
          : topic.attributes.kind == 'Hive'
      );
      return (
        sortByOrderAndAlpha(
          topicsOrSubtopics,
          get(topicOrder, 'attributes.subtopic_order', [])
        ) || []
      );
    }
  );

  return getSortedTopicsForTopic;
};

export const instanceOfGetSortedFilteredTopicsForTopic = () => {
  const getSortedTopicsForTopic = instanceOfGetSortedTopicsForTopic();

  const getSortedFilteredTopicsForTopic = createSelector(
    //pass null as topicId for topics
    (state, topicId) => getSortedTopicsForTopic(state, topicId),
    state => stateMappings(state).filters.topicFilters,
    state => stateMappings(state).user,
    (sortedTopics, topicFilterKeys, user) => {
      const filters = topicFilterKeys.map(key =>
        topicFilters[key].filter(user)
      );
      const filteredTopics = applyFilters(sortedTopics, filters, true);
      return filteredTopics;
    }
  );

  return getSortedFilteredTopicsForTopic;
};

export const getSortedTopicsForTopic = instanceOfGetSortedTopicsForTopic();
export const getSortedFilteredTopicsForTopic = instanceOfGetSortedFilteredTopicsForTopic();

export const sortByOrderAndAlpha = (array, order) => {
  return [...array].sort((a, b) => {
    if (order && order.includes(a.id) && order.includes(b.id)) {
      return order.indexOf(a.id) - order.indexOf(b.id);
    }
    if (order && order.includes(a.id)) {
      return -1;
    }
    if (order && order.includes(b.id)) {
      return 1;
    }

    return a.attributes.title
      .toLowerCase()
      .localeCompare(b.attributes.title.toLowerCase());
  });
};
