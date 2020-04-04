import { getTopic, getTopics } from 'Src/newRedux/database/topics/thunks';

// const subtopicsForTopicsTest = ({ topicId, state, callHistory }) => {
//   return topicId ?
//     callHistory ?
//       callHistory.lastCall >= moment().unix() - 300
//       : state._newReduxTree.database.topics[ topicId ]
//           && state._newReduxTree.database.topics[ topicId ].relationships
//           && state._newReduxTree.database.topics[ topicId ].relationships.children.data.every( subtopicId =>
//             state._newReduxTree.database.topics[ subtopicId ] )
//     : true
// }
const topicsWithIdsTest = ({ topicIds, state, callHistory }) =>
  topicIds.every(
    id =>
      state._newReduxTree.topics[id] &&
      state._newReduxTree.topics[id].relationships
  );

const dmRequirements = {
  subtopicsForTopic: {
    action: ({ topicId }) => [
      getTopics,
      { parentTopicId: topicId, pageSize: 999 }
    ],
    key: ({ topicId }) => `subtopicsForTopic-${topicId}`,
    test: ({ topicId, callHistory }) =>
      topicId
        ? callHistory && callHistory.lastCall >= moment().unix() - 300
        : true
  },
  topic: {
    action: ({ topicId }) => [getTopic, { topicId: topicId }],
    key: ({ topicId }) => `topic-${topicId}`,
    test: ({ topicId, callHistory }) =>
      topicId
        ? callHistory && callHistory.lastCall >= moment().unix() - 300
        : true
  },
  topicWithSlug: {
    action: ({ topicSlug }) => [getTopic, { topicSlug: topicSlug }],
    key: ({ topicSlug }) => `topic-${topicSlug}`,
    test: ({ topicSlug, callHistory }) =>
      topicSlug
        ? callHistory && callHistory.lastCall >= moment().unix() - 300
        : true
  },
  topics: {
    action: () => [getTopics, {}],
    key: () => 'topics',
    test: ({ callHistory }) =>
      callHistory && callHistory.lastCall >= moment().unix() - 300
  },
  topicsWithAttributes: {
    action: ({ attributes }) => [getTopics, { ...attributes }],
    key: ({ attributes }) =>
      `topicsWithAttributes-${JSON.stringify(attributes)}`,
    test: ({ callHistory }) =>
      callHistory && callHistory.lastCall >= moment().unix() - 300
  },
  topicsWithIds: {
    action: topicIds => [getTopics, { topicIds }],
    key: () => 'topicsWithIds',
    test: topicsWithIdsTest
  }
};

export default dmRequirements;
