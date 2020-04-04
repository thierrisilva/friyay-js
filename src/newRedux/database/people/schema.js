import { normalize, schema } from 'normalizr';
import get from 'lodash/get';


const dbRecord = new schema.Entity('people')
const userProfiles = new schema.Entity('userProfiles', {},
  { idAttribute: (profile) => get( profile, 'relationships.user.data.id' ),
});


const multiSchema = { data: { data: [dbRecord], included: [ userProfiles ] }};

const dbPerson = new schema.Entity('person', {}, {
  processStrategy: ( person ) => ({
    id: person.id,
    attributes: {
      ...person.relationships.user_profile.data,
      ...person.attributes
    },
    relationships: person.relationships
  })
});



export const normalizePerson = ( serverRecord ) => normalize(serverRecord.data.data, dbPerson).entities;
export const normalizePeople = ( serverRecords ) => normalize(serverRecords, multiSchema).entities;


const other = new schema.Entity('other');
