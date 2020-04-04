import { createSelector } from 'reselect';
import { getUserDomainContext } from 'Src/newRedux/database/domains/selectors';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { topicFilters } from 'Lib/config/filters/topics';
import { peopleFilters } from 'Lib/config/filters/people';


export const getTopicFiltersAsTopicsWithAttributesRequirements = ( state ) => {
  const currentTopicFilter = stateMappings( state ).filters.topicFilters[ 0 ];
  const userId = stateMappings( state ).user.id;
  switch (currentTopicFilter) {
    case 'FOLLOWING':
      return { followedBy: userId }
    case 'STARRED':
      return { type: 'starred' }
    case 'CREATED':
      return { createdBy: userId }
    case 'LIKED':
      return { type: 'liked' }
    case 'SHARED':
      return { sharedWith: userId }
    default:
      return {}
  }
}



export const getTopicFilters = createSelector(
  ( state ) => getUserDomainContext( state ),
  ( state ) => topicFilters,
  ( context, topicFilters ) =>
    Object.values(topicFilters).filter(filter => filter.contexts.includes( context ))
)


export const getPeopleFilters = createSelector(
  ( state ) => getUserDomainContext( state ),
  ( state ) => peopleFilters,
  ( context, peopleFilters ) =>
    Object.values(peopleFilters).filter(filter => filter.contexts.includes( context ))
)
