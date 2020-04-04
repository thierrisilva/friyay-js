import { createSelector } from 'reselect';
import compact from 'lodash/compact';
import get from 'lodash/get';
import moment from 'moment';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { cardFilters } from 'Lib/config/filters/cards';
import {
  archivedFilter,
  assignedFilter,
  createdDateFilter,
  creatorFilter,
  completedDateFilter,
  dueDateFilter,
  cardGroupFilter,
  labelFilter,
  startDateFilter,
  priorityFilters,
  topicFilter,
  nonNestedCardFilter,
  nonSubtopicCardFilter,
  nonCompletedCardFilter,
  nonUnCompletedCardFilter,
  searchCardsFilter
} from 'Lib/config/filters/other';
import { applyFilters, getArchivedLabelId } from 'Lib/utilities';
import {
  getRelevantTopicOrderForTopic,
  getRelevantTopicOrderByTopic
} from 'Src/newRedux/database/topicOrders/selectors';
import { getTopics } from 'Src/newRedux/database/topics/selectors';

const getCards = state => state._newReduxTree.database.cards;

//Seems cards can have no topics or subtopics.  Filter them out as they break things:
const hasTopicOrSubtopicFilter = () => card =>
  card.relationships.topics.data.length > 0 ||
  card.relationships.subtopics.data.length > 0;

export const getCardArray = createSelector(
  state => getCards(state),
  cards => Object.values(cards)
);

export const getCardsByCreator = createSelector(
  state => getCardArray(state),
  cards =>
    cards.reduce((a, b) => {
      const cardCreatorId = get(b, 'attributes.creator.id', '0');
      a[cardCreatorId] = a[cardCreatorId] ? [...a[cardCreatorId], b] : [b];
      return a;
    }, {})
);

const addCardToTopicAndParentTopicsInMap = (
  card,
  parentTopicId,
  topics,
  map
) => {
  let nextTopicId = parentTopicId; //not a string when sent from server
  if (nextTopicId) {
    do {
      const id = '' + nextTopicId;
      map[id] = map[id]
        ? [...map[id].filter(item => item.id != card.id), card]
        : [card];
      const nextParentTopic = topics[id];
      nextTopicId = get(nextParentTopic, 'attributes.parent_id', null);
    } while (!!nextTopicId);
  }
  return map;
};

export const getCardsByTopic = createSelector(
  state => getCardArray(state),
  state => getTopics(state),
  (cards, topics) => {
    return cards.reduce((a, b) => {
      const cardTopicIds = get(b, 'relationships.topics.data', '0');
      if (cardTopicIds) {
        cardTopicIds.forEach(topicId => {
          a = addCardToTopicAndParentTopicsInMap(b, topicId, topics, a);
        });
      }
      a['0'] = a['0'] ? [...a['0'], b] : [b]; //have reference to every card in the index key
      return a;
    }, {});
  }
);

export const getSortedCardsByTopic = createSelector(
  state => getCardsByTopic(state),
  state => getRelevantTopicOrderByTopic(state),
  (cardsByTopic, topicOrdersByTopic) =>
    Object.keys(cardsByTopic).reduce((a, b) => {
      const relevantOrder = topicOrdersByTopic[b];
      const cardOrder = relevantOrder
        ? get(relevantOrder, 'attributes.tip_order', [])
        : [];
      a[b] = sortByOrderAndCreatedDate(cardsByTopic[b], cardOrder) || [];
      return a;
    }, {})
);

export const getSortedFilteredCardsByTopic = createSelector(
  state => getSortedCardsByTopic(state),
  state => stateMappings(state).user,
  state => stateMappings(state).filters,
  state => stateMappings(state).people[stateMappings(state).page.personId],
  state => stateMappings(state).page.groupId,
  state => stateMappings(state).groups,
  state => getArchivedLabelId(state),
  state => stateMappings(state).page.topicId,
  state => stateMappings(state).search,
  (
    sortedCardsByTopic,
    user,
    filters,
    person,
    groupId,
    groups,
    archiveLabelId,
    topicId,
    search
  ) => {
    const filtersToApply = compact([
      !filters.includeArchivedCards && archivedFilter(archiveLabelId),
      assignedFilter(filters.assignedFilters),
      cardFilters[filters.cardFilter].filter({ user }),
      cardFilters['CREATED'].filter({ user: person }),
      groupId &&
        cardGroupFilter(
          get(groups[groupId], 'relationships.following_tips.data', [])
        ),
      completedDateFilter(filters.completedDateFilter),
      createdDateFilter(filters.createdDateFilter),
      creatorFilter(filters.creatorFilters),
      dueDateFilter(filters.dueDateFilter),
      labelFilter(filters.labelFilters),
      startDateFilter(filters.startDateFilter),
      priorityFilters(filters.priorityFilters),
      searchCardsFilter(search.searchCardsResult),
      !filters.includeCompletedCards && nonCompletedCardFilter,
      !filters.includeUnCompletedCards && nonUnCompletedCardFilter
    ]);

    const filtersToApplyWithIncludeSubtopicCardsFilter = compact([
      ...filtersToApply,
      !filters.includeSubtopicCards && nonSubtopicCardFilter(topicId),
      !filters.includeNestedCards && nonNestedCardFilter
    ]);

    return Object.keys(sortedCardsByTopic).reduce((a, b) => {
      const sortedCardsForTopic = sortedCardsByTopic[b];
      const filteredCards = applyFilters(
        sortedCardsForTopic,
        b === topicId
          ? filtersToApplyWithIncludeSubtopicCardsFilter
          : filtersToApply,
        true
      );
      a[b] = filteredCards;
      return a;
    }, {});
  }
);

export const getSortedFilteredCardsByTopicWithoutNestedCards = createSelector(
  state => getSortedFilteredCardsByTopic(state),
  cardsByTopic =>
    Object.keys(cardsByTopic).reduce((a, b) => {
      a[b] = cardsByTopic[b].filter(nonNestedCardFilter);
      return a;
    }, {})
);

export const getSortedFilteredCardsByTopicWithoutDescendants = createSelector(
  state => getSortedFilteredCardsByTopic(state),
  cardsByTopic =>
    Object.keys(cardsByTopic).reduce((a, b) => {
      a[b] = cardsByTopic[b].filter(card =>
        get(card, 'relationships.topics.data', []).includes(b)
      );
      return a;
    }, {})
);

export const getSortedFilteredNonNestedCardsByTopicWithoutDescendants = createSelector(
  state => getSortedFilteredCardsByTopic(state),
  cardsByTopic =>
    Object.keys(cardsByTopic).reduce((a, b) => {
      a[b] = cardsByTopic[b].filter(card => {
        return (
          get(card, 'relationships.topics.data', []).includes(b) &&
          !(
            card.relationships.follows_tip &&
            card.relationships.follows_tip.data
          )
        );
      });
      return a;
    }, {})
);

export const instanceOfGetSortedCardsForTopic = () => {
  const getSortedCardsForTopic = createSelector(
    //pass null for all cards
    (state, topicId) => topicId,
    (state, topicId) => getRelevantTopicOrderForTopic(state, topicId || '0'),
    state => getCardsByTopic(state),
    state => getCardArray(state),
    (topicId, topicOrder, cardsByTopic, allCards) => {
      const thisTopicsCards = topicId ? cardsByTopic[topicId] || [] : allCards;
      const results =
        sortByOrderAndCreatedDate(
          thisTopicsCards,
          get(topicOrder, 'attributes.tip_order', [])
        ) || [];
      return results;
    }
  );

  return getSortedCardsForTopic;
};

export const instanceOfGetSortedFilteredCardsForTopic = () => {
  const getSortedCardsForTopic = instanceOfGetSortedCardsForTopic();

  const getSortedFilteredCardsForTopic = createSelector(
    //pass null for all cards
    (state, topicId) => topicId,
    (state, topicId) => getSortedCardsForTopic(state, topicId),
    state => stateMappings(state).user,
    state => stateMappings(state).filters,
    state => stateMappings(state).people[stateMappings(state).page.personId],
    (topicId, sortedCards, user, filters, personPagePerson) => {
      const filtersToApply = [
        archivedFilter(filters.labelFilters),
        cardFilters[filters.cardFilter].filter({ user }),
        cardFilters['CREATED'].filter({ user: personPagePerson }),
        completedDateFilter(filters.completedDateFilter),
        createdDateFilter(filters.createdDateFilter),
        dueDateFilter(filters.dueDateFilter),
        labelFilter(filters.labelFilters),
        startDateFilter(filters.startDateFilter),
        priorityFilters(filters.priorityFilters)
      ];
      const filteredCards = applyFilters(sortedCards, filtersToApply, true);
      return filteredCards;
    }
  );

  return getSortedFilteredCardsForTopic;
};

export const getSortedCardsForTopic = instanceOfGetSortedCardsForTopic();
export const getSortedFilteredCardsForTopic = instanceOfGetSortedFilteredCardsForTopic();

//TODO: MH remove all selectors below:

//returns an array of cards filtered based on user-selected filters:
export const getFilteredCards = createSelector(
  [
    state => stateMappings(state).user.id,
    state => stateMappings(state).filters,
    state => stateMappings(state).cards
  ],
  (userId, filters, cards) => {
    const filtersToApply = [
      archivedFilter(filters.labelFilter),
      labelFilter(filters.labelFilter),
      cardFilters[filters.cardFilter].filter(userId),
      hasTopicOrSubtopicFilter()
    ];
    const filteredCards = applyFilters(cards, filtersToApply, true);
    return filteredCards;
  }
);

//returns the array of cards from the 'getFilteredCards' filtered to a specific topic, and ordered based on the selected order for that topic:
export const getOrderedFilteredCardsForTopic = createSelector(
  [
    (state, topicId) => topicId,
    (state, topicId) => getRelevantTopicOrderForTopic(state, topicId),
    state => getFilteredCards(state)
  ],
  (topicId, topicOrder, filteredCards) => {
    const thisTopicsCards = topicId
      ? applyFilters(filteredCards, [topicFilter(topicId)], true)
      : filteredCards;
    const results =
      sortByOrderAndCreatedDate(
        thisTopicsCards,
        get(topicOrder, 'attributes.tip_order', [])
      ) || [];
    return results;
  }
);

export const sortByOrderAndCreatedDate = (array, order) => {
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
    return (
      moment(b.attributes.created_at).unix() -
      moment(a.attributes.created_at).unix()
    );
  });
};
