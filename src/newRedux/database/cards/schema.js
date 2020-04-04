import { normalize, schema } from 'normalizr';
import { buildToOneRelationshipData, buildToManyRelationshipData } from 'Lib/utilities';
import get from 'lodash/get';

const other = new schema.Entity('other');


const tipAssignment = new schema.Entity('tipAssignment', {}, { idAttribute: 'assignment_id' });

const topics = new schema.Entity('topics', {}, {
  processStrategy: ( topic ) => ({
    id: topic.id,
    attributes: {
      slug: topic.slug,
      title: topic.title,
      parent_id: topic.parent_id
    }
  })
});



const dbCard = new schema.Entity('cards', {
  relationships: {
    depended_on_by: {
      data: [ other ]
    },
    depends_on: {
      data: [ other ]
    },
    follows_tip: {
      data: other
    },
    labels: {
      data: [ other ]
    },
    nested_tips: {
      data: [ other ]
    },
    subtopics: {
      data: [ topics ]
    },
    tip_assignments: {
      data: [ tipAssignment ]
    },
    topics: {
      data: [ topics ]
    },
    user: {
      data: other
    }
  }
});

const cardsSchema = { data: { data: [dbCard] } };

export const normalizeCard = ( serverCardRecord ) => {
  return normalize( serverCardRecord.data.data, dbCard ).entities;
}
export const normalizeCards = ( serverCardRecords ) => normalize( serverCardRecords, cardsSchema ).entities;


export const deNormalizeCard = ( card ) => {

  const attachments = get( card, 'relationships.attachments.data' ) && buildToManyRelationshipData( 'attachments', card.relationships.attachments.data );
  const depends_on =
    get(card, 'relationships.depends_on.data') &&
    buildToManyRelationshipData('tips', card.relationships.depends_on.data);

  const labels = get( card, 'relationships.labels.data' ) && buildToManyRelationshipData( 'labels', card.relationships.labels.data );

  // const follows_tip = get( card, 'relationships.follows_tip.data' ) && buildToOneRelationshipData( 'tips', card.relationships.follows_tip.data );
  const follows_tip = get( card, 'relationships.follows_tip' ) && buildToOneRelationshipData( 'tips', card.relationships.follows_tip.data );

  const nested_tips =
    get(card, 'relationships.nested_tips.data') &&
    buildToManyRelationshipData('tips', card.relationships.nested_tips.data);

  const subtopics = get( card, 'relationships.topics.data' ) && buildToManyRelationshipData( 'topics', card.relationships.topics.data );
  const tipAssignmentsData = get( card, 'relationships.tip_assignments.data' ) || [];
  const tip_assignments = { data: tipAssignmentsData.map(relId => ({ assignment_id: relId, tip_id: card.id, assignment_type: 'User' }) ) };
  const id = card.id;

  const share_settings = {
    data: get(
      card,
      'relationships.share_settings.data',
      []
      ).map(setting => ({ id: setting.sharing_object_id, type: setting.sharing_object_type })) };



  const deNormalizedCard =  {
    type: 'tips',
    id,
    attributes: card.attributes,
    relationships: {
      attachments,
      depends_on,
      follows_tip,
      labels,
      nested_tips,
      subtopics,
      tip_assignments,
      share_settings
    }
  }

  return deNormalizedCard;
}
