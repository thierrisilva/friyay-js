/* global vex */
import Ability from 'Lib/ability';
import api from './apiCalls';
import { getGroups } from 'Src/newRedux/database/groups/thunks';
import analytics from 'Lib/analytics';
import get from 'lodash/get';
import { addTopics } from 'Src/newRedux/database/topics/actions';
import { addCards, deleteCard, changeCard } from './actions';
import {
  getArchivedLabelId,
  returnBeforeAndAfterCardIdsFromItemOrder,
  returnRecordWithNewAttributes,
  mapRelationship,
  idFromSlug
} from 'Lib/utilities';
import { deNormalizeCard, normalizeCard, normalizeCards } from './schema';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { success, failure } from 'Utils/toast';
import { updateOrCreateTopicOrderFromCardMove } from 'Src/newRedux/database/topicOrders/abstractions';
import { getRelevantTopicOrderByTopic } from 'Src/newRedux/database/topicOrders/selectors';
import { batchActions } from 'redux-batch-enhancer';
import { logRollBarError } from 'Lib/rollbar';
import { removeCardFromDock } from 'Src/newRedux/interface/dock/thunks';

const PAGE_SIZE = 30;

//add and/or remove topic relationships from a card (does nothing for order!  Use in places like the left menu)
export const addRemoveCardFromTopics = (
  card,
  addTopicIds = [],
  removeTopicIds = [],
  removeFromParentCardId
) => async (dispatch, getState) => {
  let removeTopicIdsCopy = removeTopicIds.slice();
  const sm = stateMappings(getState());
  // if topic to remove in a card doesn't included in card that topics belongs to, find its descendants
  if (
    removeTopicIds.length > 0 &&
    removeTopicIds[0] !== null &&
    !card.relationships.topics.data.includes(removeTopicIds[0])
  ) {
    const { topics } = sm;
    const parentTopicToRemove = topics[removeTopicIds[0]];
    removeTopicIdsCopy = dispatch(
      getRightDescendants(parentTopicToRemove, card)
    ).map(topic => topic.id);
  }

  const cardTopics = [
    ...card.relationships.topics.data.filter(
      topicId => !removeTopicIdsCopy.includes(topicId)
    ),
    ...addTopicIds
  ];
  const cardUpdate = returnRecordWithNewAttributes({
    record: card,
    attributes: ['relationships.subtopics.data', 'relationships.topics.data'],
    values: [cardTopics, cardTopics]
  });

  if (removeFromParentCardId) {
    cardUpdate.relationships.follows_tip = { data: null };
  }

  await dispatch(updateCard(cardUpdate));
};

export const addRemoveAssignedUsersOnCard = (
  card,
  addUserIds = [],
  removeUserIds = []
) => async (dispatch, getState) => {
  const cardAssignedUsers = [
    ...card.relationships.tip_assignments.data.filter(
      userId => !removeUserIds.includes(userId)
    ),
    ...addUserIds
  ];
  const cardUpdate = returnRecordWithNewAttributes({
    record: card,
    attributes: ['relationships.tip_assignments.data'],
    values: [cardAssignedUsers]
  });

  dispatch(updateCard(cardUpdate));
};

export const addRemoveLabelsOnCard = (
  card,
  addLabelIds = [],
  removeLabelIds = []
) => async (dispatch, getState) => {
  const cardLabels = [
    ...card.relationships.labels.data.filter(
      labelId => !removeLabelIds.includes(labelId)
    ),
    ...addLabelIds
  ];
  const cardUpdate = returnRecordWithNewAttributes({
    record: card,
    attributes: ['relationships.labels.data'],
    values: [cardLabels]
  });

  dispatch(updateCard(cardUpdate));
};

export const archiveCard = (card, lastLocation) => async (
  dispatch,
  getState
) => {
  vex.dialog.confirm({
    unsafeMessage: `
      Are you sure you want to Archive this Card?
      <br /><br />
      You can use the label filters in the Action Bar to your right to view archived Cards.
    `,
    callback: async value => {
      if (value) {
        const cardUpdate = returnRecordWithNewAttributes({
          record: card,
          attributes: ['attributes.is_disabled'],
          values: [true]
        });
        await dispatch(
          changeAndPostActionOnCardOrRevert({
            original: card,
            update: cardUpdate,
            action: 'archive'
          })
        );
        await removeCardFromDock(card.id);
        dispatch(goToPathOneLevelUpFromCardDetails(lastLocation));
      }
    }
  });
};

export const changeAndPostActionOnCardOrRevert = ({
  original,
  update,
  action
}) => async dispatch => {
  dispatch(changeCard(update));
  try {
    await api.postActionOnCard(original.id, action);
  } catch (error) {
    failure('There was a problem saving your changes');
    logRollBarError(error, 'warning', 'changeAndPostActionOnCardOrRevert');
    dispatch(changeCard(original));
  }
};

export const createCard = ({
  attributes,
  relationships,
  domain
}) => async dispatch => {
  const deNormalizedCard = deNormalizeCard({ attributes, relationships });
  try {
    const dispatches = [];

    const newServerCard = await api.postCard(deNormalizedCard, domain);
    dispatches.push(
      addCards(
        normalizeCard({
          data: {
            data: mapRelationships(newServerCard.data.included)(
              newServerCard.data.data
            )
          }
        }).cards
      )
    );

    if (relationships.follows_tip && relationships.follows_tip.data) {
      dispatches.push(getCard(relationships.follows_tip.data));
    }

    dispatch(batchActions(dispatches));
    success('New card created!');

    analytics.track('Card Created', {
      id: newServerCard.data.data.id,
      title: newServerCard.data.data.attributes.title,
      topic_ids: newServerCard.data.data.relationships.topics.data.map(
        topic => topic.id
      ),
      topic_titles: newServerCard.data.data.relationships.topics.data.map(
        topic => topic.title
      )
    });

    return newServerCard;
  } catch (error) {
    failure('Unable to save new card');
    logRollBarError(error, 'warning', 'Create Card Error');
    return null;
  }
};

export const mapRelationships = included => cardDatum => {
  let mappedObject = cardDatum;

  for (let relation of [
    'share_settings',
    'topics',
    'labels',
    'tip_assignments',
    'attachments',
    'versions'
  ]) {
    mappedObject.relationships[relation].data = mapRelationship(
      cardDatum,
      included,
      relation
    );
  }
  mappedObject.relationships['nested_tips'].data = mapRelationship(
    cardDatum,
    included,
    'nested_tips',
    'tip_detail'
  );

  return mappedObject;
};

export const getCard = cardId => async dispatch => {
  try {
    const cardData = await api.fetchCard(cardId);
    const normalizedData = normalizeCard({
      data: {
        data: mapRelationships(cardData.data.included)(cardData.data.data)
      }
    });
    dispatch(
      batchActions([
        addCards(normalizedData.cards),
        addTopics(normalizedData.topics)
      ])
    );
  } catch (error) {
    failure('Unable to load card');
    logRollBarError(error, 'warning', `Get Card Error, id: ${cardId}`);
  }
};

export const getTipVersions = cardId => async (dispatch, getState) => {
  const id = idFromSlug(cardId);
  try {
    const cardData = await api.fetchVersions(id);
    const prevVersion = { ...getState()._newReduxTree.database.cards[id] };
    prevVersion.relationships.versions.data = cardData.data.data;
    var hash = {};
    hash[prevVersion['id']] = prevVersion;
    dispatch(batchActions([addCards(hash)]));
    var arr = [];
    cardData.data.data.forEach(val => {
      var attributes = val['attributes'];
      delete val['attributes'];
      Object.assign(val, attributes);
      arr.push(val);
    });
    return arr;
  } catch (error) {
    failure('Unable to load card');
    logRollBarError(error, 'warning', `Get Card Error, id: ${id}`);
  }
};

export const getCards = ({
  assignedId,
  cardIds = [],
  labelId,
  topicId,
  pageNumber,
  personId
}) => async (dispatch, getState) => {
  const relevantTopicOrderForTopic =
    getRelevantTopicOrderByTopic(getState())[topicId || '0'] || {};
  const cardsRequiredBasedOnOrder = [
    ...cardIds,
    ...get(relevantTopicOrderForTopic, 'attributes.tip_order', [])
  ];

  const fetchQueries = [
    assignedId && '&filter[assigned_to]=' + assignedId,
    labelId && '&filter[labels]=' + labelId,
    personId && '&filter[created_by]=' + personId,
    pageNumber && '&page[number]=' + pageNumber,
    topicId && '&topic_id=' + topicId,
    cardsRequiredBasedOnOrder && `&filter[tipIDs]=${cardsRequiredBasedOnOrder}`
  ];
  const fetchQuery = fetchQueries.join('');

  try {
    const cardsData = await api.fetchCards(fetchQuery);
    const normalizedData = normalizeCards({
      data: {
        data: cardsData.data.data.map(mapRelationships(cardsData.data.included))
      }
    });

    dispatch(
      batchActions([
        addCards(normalizedData.cards),
        addTopics(normalizedData.topics)
      ])
    );
    return cardsData;
  } catch (error) {
    failure('Unable to load cards');
    logRollBarError(error, 'warning', 'Get Cards Error');
  }
};

//similar to addRemoveCardFromTopics but also takes into consideration the order of cards
export const moveOrCopyCardInOrToTopic = ({
  afterCardId,
  beforeCardId,
  card,
  fromParentCardId,
  fromTopicId,
  toTopicId
}) => (dispatch, getState) => {
  if (Ability.can('update', 'self', card)) {
    const sm = stateMappings(getState());

    const dispatches = [];

    if (
      (fromTopicId && toTopicId && fromTopicId != toTopicId) ||
      fromParentCardId
    ) {
      const topicIdToRemoveFrom = sm.utilities.shiftKeyDown
        ? []
        : [fromTopicId];
      dispatches.push(
        addRemoveCardFromTopics(
          card,
          [toTopicId],
          topicIdToRemoveFrom,
          fromParentCardId
        )
      );
    }

    if (afterCardId || beforeCardId) {
      dispatches.push(
        updateOrCreateTopicOrderFromCardMove({
          afterCardId,
          beforeCardId,
          movedCardId: card.id,
          topicId: toTopicId
        })
      );
    }
    dispatch(batchActions(dispatches));
  } else {
    failure("You don't have permission to move that card!");
  }
};

export const nestCardUnderCard = ({
  nestedCard,
  parentCard,
  fromTopicId,
  toTopicId,
  itemOrder
}) => async (dispatch, getState) => {
  if (Ability.can('update', 'self', nestedCard)) {
    const sm = stateMappings(getState());
    const dispatches = [];
    if (fromTopicId && toTopicId && fromTopicId != toTopicId) {
      const topicIdToRemoveFrom = sm.utilities.shiftKeyDown
        ? []
        : [fromTopicId];

      dispatches.push(
        addRemoveCardFromTopics(nestedCard, [toTopicId], topicIdToRemoveFrom)
      );
    }

    let {
      afterCardId,
      beforeCardId
    } = returnBeforeAndAfterCardIdsFromItemOrder(nestedCard.id, itemOrder);
    if (itemOrder.length < 2) {
      afterCardId = parentCard.id;
      beforeCardId = null;
    }

    dispatches.push(
      moveOrCopyCardInOrToTopic({
        afterCardId,
        beforeCardId,
        card: nestedCard,
        fromTopicId,
        toTopicId
      })
    );
    const relationships = { follows_tip: { data: parentCard.id } };
    const updateCardAction = updateCard({ id: nestedCard.id, relationships });
    await updateCardAction(dispatch, getState);

    const prevParentData = nestedCard.relationships.follows_tip.data;
    if (prevParentData) {
      dispatches.push(getCard(prevParentData));
      dispatches.push(getCard(parentCard.id));
    }
    dispatch(batchActions(dispatches));
  } else {
    failure("You don't have permission to move that card!");
  }
};

export const removeCard = (cardId, lastLocation) => async (
  dispatch,
  getState
) => {
  vex.dialog.confirm({
    message: 'Are you sure you want to delete this card?',
    callback: async value => {
      if (value) {
        const thisCard = getState()._newReduxTree.database.cards[cardId];
        dispatch(
          batchActions([deleteCard(cardId), removeCardFromDock(cardId)])
        );
        try {
          await api.deleteCard(cardId);
          dispatch(goToPathOneLevelUpFromCardDetails(lastLocation));
        } catch (error) {
          failure('Unable to remove card');
          logRollBarError(
            error,
            'warning',
            `Remove Card Error, card id: ${cardId}`
          );
          dispatch(addCards({ [thisCard.id]: thisCard }));
        }
      }
    }
  });
};

export const toggleLikeCard = card => async (dispatch, getState) => {
  const {
    attributes: { liked_by_current_user, likes_count }
  } = card;
  const newLikesCount = liked_by_current_user
    ? likes_count - 1
    : likes_count + 1;

  const cardUpdate = returnRecordWithNewAttributes({
    record: card,
    attributes: ['attributes.liked_by_current_user', 'attributes.likes_count'],
    values: [!liked_by_current_user, newLikesCount]
  });
  await dispatch(
    changeAndPostActionOnCardOrRevert({
      original: card,
      update: cardUpdate,
      action: liked_by_current_user ? 'unlike' : 'like'
    })
  );
};

export const toggleStarCard = card => async (dispatch, getState) => {
  const {
    attributes: { starred_by_current_user }
  } = card;
  const cardUpdate = returnRecordWithNewAttributes({
    record: card,
    attributes: ['attributes.starred_by_current_user'],
    values: [!starred_by_current_user]
  });
  await dispatch(
    changeAndPostActionOnCardOrRevert({
      original: card,
      update: cardUpdate,
      action: starred_by_current_user ? 'unstar' : 'star'
    })
  );
};

export const updateCard = ({
  attributes = {},
  id,
  relationships = {}
}) => async (dispatch, getState) => {
  const prevVersion = { ...getState()._newReduxTree.database.cards[id] };

  const newVersion = {
    ...prevVersion,
    attributes: { ...prevVersion.attributes, ...attributes },
    relationships: { ...prevVersion.relationships, ...relationships }
  };

  newVersion.attributes.is_disabled = newVersion.relationships.labels.data.includes(
    getArchivedLabelId(getState())
  );

  dispatch(changeCard(newVersion));
  try {
    const updatedCard = await api.patchCard(deNormalizeCard(newVersion));

    const normalizedData = normalizeCard({
      data: {
        data: mapRelationships(updatedCard.data.included)(updatedCard.data.data)
      }
    });
    dispatch(
      batchActions([
        addCards(normalizedData.cards),
        addTopics(normalizedData.topics),
        // in case group followers changed
        getGroups()
      ])
    );

    return updatedCard;
  } catch (error) {
    failure('Unable to save changes');
    logRollBarError(error, 'warning', `Update Card Error, card id: ${id}`);
    dispatch(changeCard(prevVersion));
    return null;
  }
};

export const updateCardVersion = ({ attributes = {}, id }) => async (
  dispatch,
  getState
) => {
  const prevVersion = { ...getState()._newReduxTree.database.cards[id] };

  const newVersion = {
    ...prevVersion,
    attributes: { ...prevVersion.attributes, ...attributes }
  };

  dispatch(changeCard(newVersion));
};

export const viewCard = ({ cardId, cardSlug }) => (dispatch, getState) => {
  const sm = stateMappings(getState());

  const history = sm.routing.routerHistory;
  const path = history.location.pathname;
  const baseUrl =
    path == '/'
      ? path
      : path.includes('/cards/')
      ? `${path.split('/cards/')[0]}/`
      : `${path}/`;

  const slug = cardSlug || sm.cards[cardId].attributes.slug;

  history.push(`${baseUrl}cards/${slug}`);
};

/**
 * Go back from card details
 *
 * @return {Void}
 */
export const goToPathOneLevelUpFromCardDetails = lastLocation => {
  return (dispatch, getState) => {
    const state = getState();
    const sm = stateMappings(state);
    const {
      routing: { routerHistory }
    } = sm;
    const {
      location: { pathname }
    } = routerHistory;
    const index = pathname.indexOf('/cards/');
    if (index === -1) {
      return;
    }

    //should go back if it pushes the route and then user hits navigator back it goes to nowhere.
    lastLocation ? routerHistory.goBack() : routerHistory.push('/');
  };
};

/**
 * Get right topic descendants on a card by parent topic
 *
 * @param {Object}  parentTopic
 * @param {Object}  card
 * @return {[Object]}
 */
export const getRightDescendants = (parentTopic, card) => {
  return (dispatch, getState) => {
    const sm = stateMappings(getState());
    const { topics } = sm;
    // childTopicIds, find which is the right descendant here
    const childTopicIds = card.relationships.topics.data;
    // entryChildTopics, topics object which card belongs to
    const entryChildTopics = [];
    childTopicIds.forEach(id => {
      entryChildTopics.push(topics[id]);
    });
    // offspring, store the finding
    const offspring =
      parentTopic &&
      entryChildTopics.filter(childTopic =>
        childTopic.attributes.path
          .map(topicPath => topicPath.id)
          .includes(parentTopic.id)
      );
    return offspring;
  };
};
