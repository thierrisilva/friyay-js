import { normalize, schema } from 'normalizr';

const label = new schema.Entity('labels');
const labelCategory = new schema.Entity('labelCategories', {
  relationships: {
    labels: {
      data: [ label ]
    }
  }
});
const labelCategoriesSchema = { data: { data: [labelCategory]}};

export const normalizeLC = ( serverRecord ) => normalize(serverRecord.data.data, labelCategory).entities;
export const normalizeLCs = ( serverRecords ) => normalize(serverRecords, labelCategoriesSchema).entities;
