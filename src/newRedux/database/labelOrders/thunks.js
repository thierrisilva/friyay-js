import api from './apiCalls';
import selectors from './selectors';
import topicapi from 'Src/newRedux/database/topics/apiCalls';

import { addLabelOrders, changeLabelOrder, deleteLabelOrder } from './actions';
import { addLabelOrderIdToLabelOrderNewOrChangeConfirmed } from 'Src/newRedux/session/actions';
import { normalizeLabelOrder, normalizeLabelOrders } from './schema';
import { overwriteRecordWithAttributesAndRelationships } from 'Lib/utilities';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { success, failure } from 'Utils/toast';
import {
  updateUserDefaultOrder,
  updateUserDefaultOrderForTopic
} from 'Src/newRedux/database/user/thunks';
import { updateTopic } from 'Src/newRedux/database/topics/thunks';
import { batchActions } from 'redux-batch-enhancer';
import { changeTopic } from 'Src/newRedux/database/topics/actions';

export const createLabelOrder = ({ attributes, relationships }) => async (
  dispatch,
  getState
) => {
  try {
    const newLabelOrderName = `${
      stateMappings(getState()).user.attributes.first_name
    }'s Label Order`;
    const newLabelOrder = await api.postLabelOrder({
      attributes: { ...attributes, name: newLabelOrderName }
    });
    const normalizedOrder = normalizeLabelOrder(newLabelOrder).labelOrders;
    const newOrderId = Object.keys(normalizedOrder)[0];

    dispatch(
      batchActions([
        addLabelOrders(normalizedOrder),
        addLabelOrderIdToLabelOrderNewOrChangeConfirmed(newOrderId),
        selectLabelOrder(newOrderId)
      ])
    );

    return newLabelOrder;
  } catch (error) {
    failure('Unable to save new order');
    return null;
  }
};

export const getLabelOrders = () => async dispatch => {
  try {
    const labelOrdersData = await api.fetchLabelOrders();
    dispatch(addLabelOrders(normalizeLabelOrders(labelOrdersData).labelOrders));
    return labelOrdersData;
  } catch (error) {
    failure('Unable to load label orders');
  }
};

export const safelyRemoveLabelOrder = orderId => async (dispatch, getState) => {
  const selectedLabelOrder = selectors.getSelectedLabelOrder(getState());
  dispatch(deleteLabelOrder(orderId));

  await api.deleteLabelOrder(orderId);
};

export const selectLabelOrder = labelOrderId => async (dispatch, getState) => {
  try {
    const sm = stateMappings(getState());
    const topicId = sm.page.topicId || '0';
    const userId = sm.user.id;
    const update = {
      topic_id: topicId,
      user_id: userId,
      label_order_id: labelOrderId,
      type: `label_orders`
    };
    dispatch(
      updateUserDefaultOrderForTopic({
        order: 'user_topic_label_order',
        update
      })
    );
  } catch (error) {
    console.error('error setting user default label order', error);
  }
};

export const updateLabelOrder = ({ id, attributes, relationships }) => async (
  dispatch,
  getState
) => {
  const sm = stateMappings(getState());
  const { topics } = sm;
  // copy object to prevent direct state mutation
  const topic = topics[sm.page.topicId];
  const topicCopy = { ...topics[topic.id] };

  const { attributes } = topicCopy;
  topicCopy.relationships.label_order.data = {
    id,
    attributes,
    relationships
  };
  try {
    dispatch(changeTopic(topicCopy));
    await topicapi.patchTopic(topicCopy);
  } catch (err) {
    dispatch(changeTopic({ ...topic }));
    failure('Unable to update yay');
    console.error(err);
  }
};

export const updateOrdersofLabels = ({
  id,
  attributes,
  relationships
}) => async (dispatch, getState) => {
  const existingRecord = stateMappings(getState()).labelOrders[id];

  try {
    const updatedOrder = overwriteRecordWithAttributesAndRelationships({
      existingRecord,
      attributes,
      relationships
    });
    dispatch(changeLabelOrder(updatedOrder));
    await api.patchLabelOrder({ id, attributes, relationships });
  } catch (error) {
    failure('Unable to save latest label order');
    dispatch(changeLabelOrder(existingRecord));
  }
};
