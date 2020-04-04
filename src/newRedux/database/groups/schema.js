import { normalize, schema } from 'normalizr';
import { buildToManyRelationshipData } from 'Lib/utilities';
import get from 'lodash/get';

const other = new schema.Entity('other');

const dbRecord = new schema.Entity('groups', {
  relationships: {
    user_followers: {
      data: [ other ]
    }
  }
});

const multiSchema = { data: { data: [dbRecord] }};

export const normalizeGroup = ( serverRecord ) => normalize(serverRecord.data.data, dbRecord).entities;
export const normalizeGroups = ( serverRecords ) => normalize(serverRecords, multiSchema).entities;



export const deNormalizeGroup = ( group ) => {
  const user_followers = get( group, 'relationships.user_followers.data' ) && buildToManyRelationshipData( 'users', group.relationships.user_followers.data );

  const id = group.id || null;
  const deNormalizedGroup =  {
    type: 'groups',
    id,
    attributes: group.attributes,
    relationships: {
      user_followers
    }
  }
  return deNormalizedGroup;
}
