import { createSelector } from 'reselect';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { reduceArrayToMappedObjectForAttribute, sortAlpha } from 'Lib/utilities';
import { getTopicArray } from 'Src/newRedux/database/topics/selectors';
import get from 'lodash/get';
import mapValues from 'lodash/mapValues';


export const getRelevantTopicOrderForTopic = createSelector(
  (state, topicId) => topicId || '0',
  (state, topicId) => getTopicOrdersByTopic( state ),
  (state, topicId) => get(stateMappings(state), 'user.relationships.topic_orders.data', []),
  ( topicId = '0', topicOrdersByTopic, userDefaultTopicOrders ) => {
    const relevantTopicOrder = topicOrdersByTopic[ topicId ]
      ? topicOrdersByTopic[ topicId ].find( topicOrder => userDefaultTopicOrders.includes( topicOrder.id ))
        || topicOrdersByTopic[ topicId ].find( topicOrder => topicOrder.attributes.is_default )
      : null
    return relevantTopicOrder;
  }
)


export const getRelevantTopicOrderByTopic = createSelector(
  (state) => getTopicOrdersByTopic( state ),
  (state) => get(stateMappings(state), 'user.relationships.topic_orders.data', []),
  ( topicOrdersByTopic, userDefaultTopicOrders ) => mapValues(
    topicOrdersByTopic,
    ( arrayOfTopicOrders ) =>
      arrayOfTopicOrders.find( topicOrder => userDefaultTopicOrders.includes( topicOrder.id )) ||
      arrayOfTopicOrders.find( topicOrder => topicOrder.attributes.is_default) ||
      null
  )
)

const getTopicOrders = createSelector(
  ( state) => stateMappings(state).topicOrders ,
  ( topicOrders ) => sortAlpha( Object.values( topicOrders ), 'name' )
)


export const getTopicOrdersByTopic = createSelector(
  (state) => getTopicOrders( state ),
  ( topicOrders ) => reduceArrayToMappedObjectForAttribute( topicOrders, 'attributes.topic_id' )
);


//TODO: replace consumers of this with getBYtopic and remove this as it adds no value:
export const getTopicOrdersForTopic = createSelector(
  (state, topicId) => getTopicOrdersByTopic( state ),
  (state, topicId) => topicId,
  ( topicOrdersByTopic, topicId ) => topicOrdersByTopic[ topicId ]
)


export const getCardsByCreator = createSelector(
  ( state ) => getCardArray( state ),
  ( cards ) => cards.reduce(( a, b ) => {
    const cardCreatorId = get(b, 'attributes.creator.id', '0');
    a[ cardCreatorId ] = a[ cardCreatorId ] ? [ ...a[ cardCreatorId ], b ] : [ b ];
    return a;
  }, {})
);
