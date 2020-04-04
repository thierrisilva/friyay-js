import { createSelector } from 'reselect';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { peopleFilters } from 'Lib/config/filters/people';
import { applyFilters, sortAlpha } from 'Lib/utilities';
import compact from 'lodash/compact';
import get from 'lodash/get';
import { peopleGroupFilter } from 'Lib/config/filters/other';

const getPeople = (state) => stateMappings( state ).people;

export const getPeopleArray = createSelector(
  ( state ) => getPeople( state ),
  ( people ) => sortAlpha( Object.values( people ), 'name' )
)


export const getFilteredPeople = createSelector(
  ( state ) => getPeopleArray( state ),
  ( state ) => stateMappings( state ).filters.peopleFilters,
  ( state ) => stateMappings( state ).user,
  ( state ) => stateMappings(state).page.groupId,
  ( state ) => stateMappings(state).groups,
  ( people, activePeopleFilters, user, groupId, groups ) => {
    const filters = compact([
      ...activePeopleFilters.map( key => peopleFilters[key].filter( user ) ),
      groupId && peopleGroupFilter( get( groups[ groupId ], 'relationships.following_users.data', [] ) ),
    ]);
    const filteredPeople = applyFilters( people, filters, true );
    return filteredPeople;
  });
