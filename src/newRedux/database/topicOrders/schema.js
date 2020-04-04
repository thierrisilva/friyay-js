import { normalize, schema } from 'normalizr';

const other = new schema.Entity('other');

const dbRecord = new schema.Entity('topicOrders', {
  relationships: {
    topic: {
      data: other
    },
    sub_topics: {
      data: [ other ]
    },
    tips: {
      data: [ other ]
    },
    users: {
      data: [ other ]
    },
  }
});

const multiSchema = { data: { data: [dbRecord] }};

export const normalizeTopicOrder = ( serverRecord ) => normalize(serverRecord.data.data, dbRecord).entities;
export const normalizeTopicOrders = ( serverRecords ) => normalize(serverRecords, multiSchema).entities;
