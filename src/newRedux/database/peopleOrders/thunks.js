import api from './apiCalls';
import selectors from './selectors';

import { addPeopleOrders, changePeopleOrder, deletePeopleOrder } from './actions';
import { addPeopleOrderIdToPeopleOrderNewOrChangeConfirmed } from 'Src/newRedux/session/actions';
import { batchActions } from 'redux-batch-enhancer'
import { logRollBarError, setRollbarUser } from 'Lib/rollbar';
import { normalizePeopleOrder, normalizePeopleOrders } from './schema';
import { overwriteRecordWithAttributesAndRelationships } from 'Lib/utilities';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { success, failure } from 'Utils/toast';
import { updateUserDefaultOrder, updateUserDefaultOrderForTopic } from 'Src/newRedux/database/user/thunks';
import { updateTopic } from 'Src/newRedux/database/topics/thunks';


export const createPeopleOrder = ({ attributes = {}, relationships }) => async( dispatch, getState ) => {
  try {
    const newPeopleOrderName = `${stateMappings(getState()).user.attributes.first_name}'s People Order`;
    const newPeopleOrder = await api.postPeopleOrder({ attributes: { ...attributes, name: newPeopleOrderName }});
    const normalizedOrder = normalizePeopleOrder( newPeopleOrder ).peopleOrders;
    const newOrderId = Object.keys(normalizedOrder)[ 0 ];

    dispatch( batchActions([
      addPeopleOrders( normalizedOrder ),
      addPeopleOrderIdToPeopleOrderNewOrChangeConfirmed( newOrderId ),
      selectPeopleOrder( newOrderId )
    ]));

    return newPeopleOrder;

  } catch (error) {
    failure('Unable to save new order');
    return null;
  }
};



export const getPeopleOrders = () => async( dispatch ) => {

  try {
    const peopleOrdersData = await api.fetchPeopleOrders();
    dispatch( addPeopleOrders( normalizePeopleOrders( peopleOrdersData ).peopleOrders ));
    return peopleOrdersData;

  } catch (error) {
    failure('Unable to load people orders');
  }
};



export const safelyRemovePeopleOrder = ( orderId ) => async( dispatch, getState ) => {

  const selectedPeopleOrder = selectors.getSelectedPeopleOrder( getState() );
  dispatch( deletePeopleOrder( orderId ) );
  await api.deletePeopleOrder( orderId );
}




export const selectPeopleOrder = ( peopleOrderId ) => async( dispatch, getState ) => {
  try {
    const sm = stateMappings( getState() );
    const topicId = sm.page.topicId || '0';
    const userId = sm.user.id;
    const update = { topic_id: topicId, user_id: userId, people_order_id: peopleOrderId, type: `people_orders` }
    dispatch( updateUserDefaultOrderForTopic({
      order: 'user_topic_people_order',
      update
    }));

  } catch (error) {
    logRollBarError( error, 'warning', 'Error with selectPeopleOrder' );
  }
}



export const updatePeopleOrder = ({ id, attributes, relationships }) => async( dispatch, getState ) => {

  const existingRecord = stateMappings(getState()).peopleOrders[ id ];

  try {
    const updatedOrder = overwriteRecordWithAttributesAndRelationships({ existingRecord, attributes, relationships })
    dispatch( changePeopleOrder( updatedOrder ));
    await api.patchPeopleOrder({ id, attributes, relationships });

  } catch (error) {
    failure('Unable to save latest people order');
    dispatch( changePeopleOrder( existingRecord ));
  }
}
