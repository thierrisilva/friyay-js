import { normalize, schema } from 'normalizr';

const other = new schema.Entity('other');
const dbUserProfile = new schema.Entity('userProfile');

const dbRecord = new schema.Entity('user', {
  relationships: {
    invitations: {
      data: [ other ]
    },
    notifications: {
      data: [ other ]
    },
    topic_orders: {
      data: [ other ]
    },
    user_followers: {
      data: [ other ]
    },
    // user_topic_label_order: {
    //   data: [ other ]
    // },
    // user_topic_people_order: {
    //   data: [ other ]
    // },
  }
}, { processStrategy: ( person ) => ({
    id: person.id,
    attributes: {
      ...person.attributes,
      test: 'something',
      id: person.id,
      user_profile_id: person.relationships.user_profile.data.id
    },
    relationships: person.relationships
  })}
);



export const normalizeUser = ( serverRecord ) => normalize(serverRecord.data.data, dbRecord).entities;
