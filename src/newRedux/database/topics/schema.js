import { normalize, schema } from 'normalizr';
import { buildToOneRelationshipData, buildToManyRelationshipData } from 'Lib/utilities';
import get from 'lodash/get';

const other = new schema.Entity('other');

const dbRecord = new schema.Entity('topics');

dbRecord.define({
  relationships: {
    children: {
      data: [ other ]
    },
    group_followers: {
      data: [ other ]
    },
    label_order: {
      data: other
    },
    parent: {
      data: other
    },
    people_order: {
      data: other
    },
    topic_orders: {
      data: [ other ]
    },
    user_followers: {
      data: [ other ]
    }
  }
});

const multiSchema = { data: { data: [dbRecord] }};
export const normalizeTopic = ( serverRecord ) => normalize(serverRecord.data.data, dbRecord).entities;
export const normalizeTopics = ( serverRecords ) => normalize(serverRecords, multiSchema).entities;


export const deNormalizeTopic = ( topic ) => {
  const label_order = get( topic, 'relationships.label_order.data' ) && buildToOneRelationshipData( 'label_order', topic.relationships.label_order.data );
  const parent = get( topic, 'relationships.parent.data' ) && buildToOneRelationshipData( 'topics', topic.relationships.parent.data );
  const people_order = get( topic, 'relationships.people_order.data' ) && buildToOneRelationshipData( 'people_order', topic.relationships.people_order.data );
  const topic_orders = get( topic, 'relationships.topic_orders.data' ) && buildToManyRelationshipData( 'topic_orders', topic.relationships.topic_orders.data );

  const id = topic.id;
  const deNormalizedTopic =  {
    type: 'topics',
    id,
    attributes: topic.attributes,
    relationships: {
      label_order,
      parent,
      people_order,
      roles: get(topic, 'relationships.roles'),
      topic_orders,
      share_settings: get(topic, 'relationships.share_settings')
    }
  }
  return deNormalizedTopic;
}
