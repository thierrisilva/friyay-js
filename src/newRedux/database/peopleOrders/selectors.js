import { createSelector } from 'reselect';
import { sortAlpha } from 'Lib/utilities';
import { stateMappings } from 'Src/newRedux/stateMappings';
import get from 'lodash/get';

export const getPeopleOrders = createSelector(
  ( state ) => stateMappings( state ).peopleOrders,
  ( peopleOrders ) => sortAlpha( Object.values( peopleOrders ), 'name' )
)

export const getSelectedPeopleOrder = createSelector(
  ( state ) => stateMappings( state ).peopleOrders,
  ( state ) => stateMappings( state ).user.relationships.user_topic_people_order.data,
  ( state ) => stateMappings( state ).page.topicId,
  ( state ) => get( stateMappings( state ).topics[ stateMappings( state ).page.topicId ], 'relationships.people_order.data'),
  ( peopleOrders, userPeopleOrders, topicId, topicPeopleOrderId ) => {
    const relevantTopicId = topicId || '0';
    const usersPeopleOrderForTopic = userPeopleOrders.find( po => po.topic_id == relevantTopicId );
    return usersPeopleOrderForTopic
      ? peopleOrders[ usersPeopleOrderForTopic.people_order_id ]
      : peopleOrders[ topicPeopleOrderId ] || null;
  }
)


export default {
  getPeopleOrders,
  getSelectedPeopleOrder
}
