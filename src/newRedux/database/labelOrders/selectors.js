import { createSelector } from 'reselect';
import { sortAlpha } from 'Lib/utilities';
import { stateMappings } from 'Src/newRedux/stateMappings';
import get from 'lodash/get';

export const getLabelOrders = createSelector(
  ( state ) => stateMappings( state ).labelOrders,
  ( labelOrders ) => sortAlpha( Object.values( labelOrders ), 'name' )
)

export const getSelectedLabelOrder = createSelector(
  ( state ) => stateMappings( state ).labelOrders,
  ( state ) => stateMappings( state ).user.relationships.user_topic_label_order.data,
  ( state ) => stateMappings( state ).page.topicId,
  ( state ) => get( stateMappings( state ).topics[ stateMappings( state ).page.topicId ], 'relationships.label_order.data'),
  ( labelOrders, userLabelOrders, topicId, topicLabelOrderId ) => {
    const relevantTopicId = topicId || '0';
    const usersLabelOrderForTopic = userLabelOrders.find( lo => lo.topic_id == relevantTopicId );
    return usersLabelOrderForTopic
      ? labelOrders[ usersLabelOrderForTopic.label_order_id ]
      : labelOrders[ topicLabelOrderId ];
  }
)


export default {
  getLabelOrders,
  getSelectedLabelOrder
}
