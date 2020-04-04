import { normalize, schema } from 'normalizr';

const other = new schema.Entity('other');

const dbRecord = new schema.Entity('labelOrders', {
  relationships: {
    users: {
      data: [ other ]
    }
  }
});

const multiSchema = { data: { data: [dbRecord] }};

export const normalizeLabelOrder = ( serverRecord ) => normalize(serverRecord.data.data, dbRecord).entities;
export const normalizeLabelOrders = ( serverRecords ) => normalize(serverRecords, multiSchema).entities;
