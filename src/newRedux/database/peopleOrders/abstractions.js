/* global vex */
import { addPeopleOrderIdToPeopleOrderNewOrChangeConfirmed, addTopicIdToNoSelectedPeopleOrderInformed } from 'Src/newRedux/session/actions';
import { createPeopleOrder, updatePeopleOrder } from './thunks';
import { getSelectedPeopleOrder } from './selectors';
import { stateMappings } from 'Src/newRedux/stateMappings';


export const updateOrCreatePeopleOrder = ( newOrder ) => async( dispatch, getState ) => {
  const state = getState();
  const sm = stateMappings( state );
  const confirmedNewOrChangeOrderIds = sm.session.peopleOrdersUserHasConfirmedNewOrChangeOrder;
  const selectedPeopleOrder = getSelectedPeopleOrder( state );
  
  selectedPeopleOrder
    ? confirmedNewOrChangeOrderIds.includes( selectedPeopleOrder.id )
      ? dispatch ( updatePeopleOrder({ id: selectedPeopleOrder.id, attributes: { order: newOrder }}) )
      : util_QueryUserForChangeOrNewOrder( selectedPeopleOrder, { id: selectedPeopleOrder.id, attributes: { order: newOrder }}, dispatch)
    : dispatch ( createPeopleOrder({ attributes: { order: newOrder }}) );
}


const util_QueryUserForChangeOrNewOrder = ( selectedPeopleOrder, updateOrCreateObject, dispatch ) => {

  const confirmAction = ( isChange ) => {
    isChange
      ? dispatch( updatePeopleOrder( updateOrCreateObject ) )
      : dispatch( createPeopleOrder( updateOrCreateObject ) );
    dispatch( addPeopleOrderIdToPeopleOrderNewOrChangeConfirmed( updateOrCreateObject.id ) );
  }

  vex.dialog.open({
    message: `You are currently viewing ${ selectedPeopleOrder.attributes.name }.  Would you like to change this order or create a new one?`,
    buttons: [
      $.extend({}, vex.dialog.buttons.YES, { text: 'Change This Order', click: { call: () => confirmAction( true ) }}),
      $.extend({}, vex.dialog.buttons.YES, { text: 'Create New Order', click: { call: () => confirmAction() } })
    ],
  })
}
