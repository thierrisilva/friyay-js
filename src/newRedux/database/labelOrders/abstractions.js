/* global vex */
import {
  addLabelOrderIdToLabelOrderNewOrChangeConfirmed,
  addTopicIdToNoSelectedLabelOrderInformed
} from 'Src/newRedux/session/actions';
import {
  createLabelOrder,
  updateLabelOrder,
  updateOrdersofLabels
} from './thunks';
import { getSelectedLabelOrder } from './selectors';
import { stateMappings } from 'Src/newRedux/stateMappings';

export const updateOrCreateLabelOrder = newOrder => async (
  dispatch,
  getState
) => {
  const state = getState();
  const sm = stateMappings(state);
  const confirmedNewOrChangeOrderIds =
    sm.session.labelOrdersUserHasConfirmedNewOrChangeOrder;
  const selectedLabelOrder = getSelectedLabelOrder(state);
  selectedLabelOrder
    ? confirmedNewOrChangeOrderIds.includes(selectedLabelOrder.id)
      ? dispatch(
          updateOrdersofLabels({
            id: selectedLabelOrder.id,
            attributes: { order: newOrder }
          })
        )
      : util_QueryUserForChangeOrNewOrder(
          selectedLabelOrder,
          { id: selectedLabelOrder.id, attributes: { order: newOrder } },
          dispatch
        )
    : dispatch(createLabelOrder({ attributes: { order: newOrder } }));
};

const util_QueryUserForChangeOrNewOrder = (
  selectedLabelOrder,
  updateOrCreateObject,
  dispatch
) => {
  const confirmAction = isChange => {
    isChange
      ? dispatch(updateOrdersofLabels(updateOrCreateObject))
      : dispatch(createLabelOrder(updateOrCreateObject));
    dispatch(
      addLabelOrderIdToLabelOrderNewOrChangeConfirmed(updateOrCreateObject.id)
    );
  };

  vex.dialog.open({
    message: `You are currently viewing ${
      selectedLabelOrder.attributes.name
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
