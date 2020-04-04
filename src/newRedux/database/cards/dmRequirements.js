import { getCards } from './thunks';

const dmRequirements = {
  cards: {
    action: () => [getCards, {}],
    key: () => 'cards',
    test: ({ callHistory }) =>
      callHistory && callHistory.lastCall >= moment().unix() - 30
  },
  cardsForLabel: {
    action: ({ labelId, topicId = null }) => [
      getCards,
      { labelId: labelId, topicId: topicId }
    ],
    key: ({ labelId, topicId = null }) => `cardsForLabel-${labelId}-${topicId}`,
    test: ({ callHistory }) =>
      callHistory && callHistory.lastCall >= moment().unix() - 30
  },
  cardsForPerson: {
    action: ({ personId }) => [getCards, { personId: personId }],
    key: ({ personId }) => `cardsForPerson-${personId}`,
    test: ({ callHistory }) =>
      callHistory && callHistory.lastCall >= moment().unix() - 30
  },
  cardsForTopic: {
    action: ({ topicId }) => [getCards, { topicId: topicId }],
    key: ({ topicId }) => `cardsForTopic-${topicId}`,
    test: ({ callHistory }) =>
      callHistory && callHistory.lastCall >= moment().unix() - 30
  },
  cardsWithAttributes: {
    action: ({ attributes }) => [getCards, { ...attributes }],
    key: ({ attributes }) =>
      `cardsWithAttributes-${JSON.stringify(attributes)}`,
    test: ({ callHistory }) =>
      callHistory && callHistory.lastCall >= moment().unix() - 30
  }
};

export default dmRequirements;
