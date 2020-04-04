import moment from 'moment';

export const archivedFilter = archiveLabelId => card =>
  !card.attributes.is_disabled &&
  !card.relationships.labels.data.includes(archiveLabelId);

export const assignedFilter = (assignedIds = []) => card => {
  return assignedIds.length == 0
    ? true
    : assignedIds.some(assignedId =>
        card.relationships.tip_assignments.data.includes(assignedId)
      );
};

export const dueDateFilter = ({ startDate, endDate }) => card => {
  // card date is GMT, startDate and endDate are in local
  return startDate
    ? moment(new Date(card.attributes.due_date).toDateString()).isBetween(
        startDate,
        endDate
      )
    : true;
};

export const completedDateFilter = ({ startDate, endDate }) => card =>
  startDate
    ? moment(
        new Date(card.attributes.completion_date).toDateString()
      ).isBetween(startDate, endDate)
    : true;

export const createdDateFilter = ({ startDate, endDate }) => card =>
  startDate
    ? moment(new Date(card.attributes.created_at).toDateString()).isBetween(
        startDate,
        endDate
      )
    : true;

export const creatorFilter = (creatorIds = []) => card =>
  creatorIds.length == 0
    ? true
    : creatorIds.includes(card.attributes.creator.id);

export const cardGroupFilter = groupTipFollows => card =>
  groupTipFollows.includes(card.id);
export const topicGroupFilter = groupTopicFollows => topic =>
  groupTopicFollows.includes(topic.id);
export const peopleGroupFilter = groupPeopleFollows => person =>
  groupPeopleFollows.includes(person.id);

export const labelFilter = (labelIds = []) => card =>
  labelIds.length == 0
    ? true
    : labelIds.every(labelId =>
        card.relationships.labels.data.includes(labelId)
      );

export const startDateFilter = ({ startDate, endDate }) => card =>
  startDate
    ? moment(new Date(card.attributes.start_date).toDateString()).isBetween(
        startDate,
        endDate
      )
    : true;

export const priorityFilters = levels => card => {
  return levels.length ? levels.includes(card.attributes.priority_level) : true;
};

export const topicFilter = topicId => card => {
  return card.relationships.topics.data.includes(topicId);
};

export const nonNestedCardFilter = card => {
  return !(
    card.relationships.follows_tip && card.relationships.follows_tip.data
  );
};

export const nonCompletedCardFilter = card => {
  return !(card.attributes.completion_date && true);
};

export const nonUnCompletedCardFilter = card => {
  return card.attributes.completion_date && true;
};

export const nonSubtopicCardFilter = topicId => card => {
  return card.relationships.topics.data.includes(topicId);
};

export const searchCardsFilter = searchCardsResult => card => {
  return searchCardsResult !== 'ALL'
    ? searchCardsResult.includes(card.attributes.title)
    : true;
};
