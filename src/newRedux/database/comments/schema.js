import { normalize, schema } from 'normalizr';

const other = new schema.Entity('other');

const dbRecord = new schema.Entity('comments' )

const multiSchema = { data: { data: [dbRecord] }};

export const normalizeComment = ( serverRecord ) => normalize(serverRecord.data.data, dbRecord).entities;
export const normalizeComments = ( serverRecords ) => normalize(serverRecords, multiSchema).entities;


export const deNormalizeComment = ( comment ) => {
  const id = comment.id;
  const deNormalizedComment =  {
    type: 'comments',
    id,
    attributes: comment.attributes,
  }
  return deNormalizedComment;
}
