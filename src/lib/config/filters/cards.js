import { stateMappings } from 'Src/newRedux/stateMappings';
import tiphive from 'Lib/tiphive';
import get from 'lodash/get';

export const cardFilters = {
  ALL: {
    key: 'ALL',
    name: 'All Cards',
    icon: 'globe',
    iconType: 'fontAwesome',
    contexts: ['domain', 'guestInGroup', 'support'],
    filter: () => card => true
  },
  LIKED: {
    key: 'LIKED',
    name: 'Cards I Liked',
    icon: 'heart',
    iconType: 'fontAwesome',
    contexts: ['domain', 'guestInGroup', 'support'],
    filter: () => card => card.attributes.liked_by_current_user
  },
  STARRED: {
    key: 'STARRED',
    name: 'Cards I Starred',
    icon: 'star',
    iconType: 'fontAwesome',
    contexts: ['domain', 'guestInGroup', 'support'],
    filter: () => card => card.attributes.starred_by_current_user
  },
  CREATED: {
    key: 'CREATED',
    name: 'My Cards',
    icon: 'user',
    iconType: 'fontAwesome',
    contexts: ['domain', 'guestInGroup', 'support'],
    filter: ({ user }) => card =>
      user ? card.attributes.creator.id == user.id : true
  },
  FOLLOWED_TOPICS: {
    key: 'FOLLOWED_TOPICS',
    name: 'Cards From yays I Follow',
    icon: 'topic',
    iconType: 'fontAwesome',
    contexts: ['domain', 'guestInGroup', 'support'],
    filter: ({ user }) => card =>
      card.relationships.topics.data.some(topicId =>
        get(user, 'relationships.following_topics.data', []).includes(topicId)
      )
  }
};

export const cardFilterForView = {
  BASIC: {
    includeNested: true,
    includeSubtopicCards: false,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  GRID: {
    includeNested: true,
    includeSubtopicCards: true,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  SMALL_GRID: {
    includeNested: true,
    includeSubtopicCards: true,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  PAGES: {
    includeNested: true,
    includeSubtopicCards: false,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  DOC: {
    includeNested: true,
    includeSubtopicCards: false,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  WIKI: {
    includeNested: true,
    includeSubtopicCards: false,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  CARD: {
    includeNested: true,
    includeSubtopicCards: true,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  MESSAGE_BOARD: {
    includeNested: true,
    includeSubtopicCards: true,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  TODO: {
    includeNested: false,
    includeSubtopicCards: true,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  KANBAN: {
    includeNested: true,
    includeSubtopicCards: true,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  ASSIGNED: {
    includeNested: true,
    includeSubtopicCards: true,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  PRIORITIZE: {
    includeNested: true,
    includeSubtopicCards: true,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  GOAL: {
    includeNested: true,
    includeSubtopicCards: true,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  PLANNING: {
    includeNested: true,
    includeSubtopicCards: true,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  TIMELINE: {
    includeNested: true,
    includeSubtopicCards: true,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  CALENDAR: {
    includeNested: true,
    includeSubtopicCards: true,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  LIST: {
    includeNested: true,
    includeSubtopicCards: true,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  TASK: {
    includeNested: true,
    includeSubtopicCards: false,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  SHEET: {
    includeNested: false,
    includeSubtopicCards: false,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  ESTIMATION: {
    includeNested: false,
    includeSubtopicCards: false,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  DOCUMENT: {
    includeNested: true,
    includeSubtopicCards: true,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  },
  INDEX: {
    includeNested: true,
    includeSubtopicCards: false,
    includeCompletedCards: true,
    includeUnCompletedCards: true
  }
};
