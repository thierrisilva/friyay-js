import { normalize, schema } from 'normalizr';

const other = new schema.Entity('other');

const dbRecord = new schema.Entity('labels', {
  relationships: {
    label_categories: {
      data: [ other ]
    }
  }
});

const multiSchema = { data: { data: [dbRecord] }};

export const normalizeLabel = ( serverRecord ) => normalize(serverRecord.data.data, dbRecord).entities;
export const normalizeLabels = ( serverRecords ) => normalize(serverRecords, multiSchema).entities;
