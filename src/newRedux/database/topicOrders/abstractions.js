import { addTopicIdToTopicOrderNewOrChangeConfirmed } from 'Src/newRedux/session/actions';
import { createTopicOrder, updateTopicOrder } from './thunks';
import { getRelevantTopicOrderForTopic } from './selectors';
import { getSortedCardsForTopic } from 'Src/newRedux/database/cards/selectors';
import { instanceOfGetSortedTopicsForTopic } from 'Src/newRedux/database/topics/selectors';
import { stateMappings } from 'Src/newRedux/stateMappings';

export const updateOrCreateTopicOrderFromCardMove = ({
  afterCardId,
  beforeCardId,
  movedCardId,
  topicId
}) => async (dispatch, getState) => {
  const state = getState();
  const topicOrder = getRelevantTopicOrderForTopic(state, topicId); //hit the selector
  const hasAsked = stateMappings(
    state
  ).session.topicsUserHasConfirmedNewOrChangeOrder.includes(topicId);

  const cardOrder = getSortedCardsForTopic(state, topicId)
    .map(card => card.id)
    .filter(cardId => cardId != movedCardId);
  cardOrder.splice(
    beforeCardId
      ? cardOrder.indexOf(beforeCardId)
      : cardOrder.indexOf(afterCardId) + 1,
    0,
    movedCardId
  );

  if (topicOrder) {
    if (hasAsked) {
      dispatch(
        updateTopicOrder({
          id: topicOrder.id,
          attributes: { tip_order: cardOrder }
        })
      );
    } else {
      util_QueryUserForChangeOrNewOrder({
        cardOrder,
        dispatch,
        topicId,
        topicOrder
      });
    }
  } else {
    dispatch(createTopicOrder({ cardOrder, isDefault: true, topicId }));
  }
};

export const updateOrCreateTopicOrderFromTopicMove = ({
  afterTopicId,
  beforeTopicId,
  movedTopicId,
  parentTopicId
}) => async (dispatch, getState) => {
  const state = getState();
  const parentTopicIdOrDefault = parentTopicId || '0';
  const topicOrder = getRelevantTopicOrderForTopic(
    state,
    parentTopicIdOrDefault
  ); //hit the selector
  const hasAsked = stateMappings(
    state
  ).session.topicsUserHasConfirmedNewOrChangeOrder.includes(
    parentTopicIdOrDefault
  );
  const topicSelector = instanceOfGetSortedTopicsForTopic();

  let subtopicOrder = topicSelector(state, parentTopicIdOrDefault);

  subtopicOrder = subtopicOrder
    .map(subtopic => subtopic.id)
    .filter(subtopicId => subtopicId != movedTopicId);
  subtopicOrder.splice(
    beforeTopicId
      ? subtopicOrder.indexOf(beforeTopicId)
      : subtopicOrder.indexOf(afterTopicId) + 1,
    0,
    movedTopicId
  );

  if (topicOrder) {
    if (hasAsked) {
      dispatch(
        updateTopicOrder({
          id: topicOrder.id,
          attributes: { subtopic_order: subtopicOrder }
        })
      );
    } else {
      util_QueryUserForChangeOrNewOrder({
        subtopicOrder,
        dispatch,
        topicId: parentTopicIdOrDefault,
        topicOrder
      });
    }
  } else {
    dispatch(
      createTopicOrder({
        subtopicOrder,
        isDefault: true,
        topicId: parentTopicIdOrDefault
      })
    );
  }
};

export const updateOrCreateTopicOrderOnSheetViewColumnChange = ({
  topicId,
  columns
}) => async (dispatch, getState) => {
  const state = getState();
  const topicOrder = getRelevantTopicOrderForTopic(state, topicId); //hit the selector
  const hasAsked = stateMappings(
    state
  ).session.topicsUserHasConfirmedNewOrChangeOrder.includes(topicId);

  if (topicOrder) {
    if (hasAsked) {
      dispatch(
        updateTopicOrder({
          id: topicOrder.id,
          attributes: { sheet_view_column_order: columns }
        })
      );
    } else {
      util_QueryUserForChangeOrNewOrder({
        dispatch,
        topicId,
        topicOrder,
        sheetViewColumns: columns
      });
    }
  } else {
    dispatch(
      createTopicOrder({
        isDefault: true,
        topicId,
        sheetViewColumnOrder: columns
      })
    );
  }
};

const util_QueryUserForChangeOrNewOrder = ({
  cardOrder,
  dispatch,
  subtopicOrder,
  topicId,
  topicOrder,
  sheetViewColumns
}) => {
  const newCardOrder = cardOrder || topicOrder.attributes.tip_order;
  const newSubtopicOrder =
    subtopicOrder || topicOrder.attributes.subtopic_order;
  const newSheetViewColumnOrder =
    sheetViewColumns || topicOrder.attributes.sheet_view_column_order;

  const confirmAction = isChange => {
    if (isChange) {
      const tip_order = newCardOrder,
        subtopic_order = newSubtopicOrder,
        sheet_view_column_order = newSheetViewColumnOrder;
      dispatch(
        updateTopicOrder({
          id: topicOrder.id,
          attributes: { tip_order, subtopic_order, sheet_view_column_order }
        })
      );
    } else {
      dispatch(
        createTopicOrder({
          cardOrder,
          subtopicOrder,
          isDefault: true,
          topicId,
          sheetViewColumnOrder: sheetViewColumns
        })
      );
    }
    dispatch(addTopicIdToTopicOrderNewOrChangeConfirmed(topicId));
  };

  vex.dialog.open({
    message: `You are currently viewing ${
      topicOrder.attributes.name
    }.  Would you like to change this order or create a new one?`,
    buttons: [
      $.extend({}, vex.dialog.buttons.YES, {
        text: 'Change This Order',
        click: { call: () => confirmAction(true) }
      }),
      $.extend({}, vex.dialog.buttons.YES, {
        text: 'Create New Order',
        click: { call: () => confirmAction() }
      })
    ]
  });
};
