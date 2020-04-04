import tiphive from 'Lib/tiphive';
import { stateMappings } from 'Src/newRedux/stateMappings';

export const peopleFilters = {
  ALL: {
    key: 'ALL',
    name: 'All People',
    icon: 'globe',
    iconType: 'fontAwesome',
    contexts: ['PUBLIC', 'DOMAIN', 'GUESTINGROUP', 'OWNER', 'SUPPORT'],
    filter: () => ( person ) => true
  },
  FOLLOWING: {
    key: 'FOLLOWING',
    name: 'People I follow',
    icon: 'exchange',
    iconType: 'fontAwesome',
    contexts: ['PUBLIC', 'DOMAIN', 'GUEST', 'GUESTINGROUP', 'OWNER'],
    filter: ( user ) => ( person ) => user.relationships.following_users.data.includes( person.id )
  },
};
