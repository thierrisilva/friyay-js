import { normalize, schema } from 'normalizr';

const other = new schema.Entity('other');

const dbRecord = new schema.Entity('peopleOrders', {
  relationships: {
    users: {
      data: [ other ]
    }
  }
});

const multiSchema = { data: { data: [dbRecord] }};

export const normalizePeopleOrder = ( serverRecord ) => normalize(serverRecord.data.data, dbRecord).entities;
export const normalizePeopleOrders = ( serverRecords ) => normalize(serverRecords, multiSchema).entities;
