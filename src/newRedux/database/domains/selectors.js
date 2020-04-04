import { createSelector } from 'reselect';
import get from 'lodash/get';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { sortAlpha } from 'Lib/utilities';

export const getDomains = state => {
  return [
    state._newReduxTree.database.domains['0'],
    ...sortAlpha(
      Object.values(state._newReduxTree.database.domains),
      'name'
    ).filter(dom => dom.id != '0')
  ];
};

export const getUserDomainContext = createSelector(
  state => stateMappings(state).page.domainId,
  state => stateMappings(state).page.groupId,
  state => stateMappings(state).domains,
  (domainId, groupId, domains) => {
    const thisDomain = domains[domainId];
    const domainMasks = get(thisDomain, 'relationships.masks.data');
    if (domainMasks) {
      if (domainId === '0') {
        return 'PUBLIC';
      } else if (domainMasks.is_guest && groupId) {
        return 'GUESTINGROUP';
      } else if (domainMasks.is_guest) {
        return 'GUEST';
      } else if (domainMasks.is_owner) {
        return 'OWNER';
      } else if (window.location.href.includes('https://support')) {
        return 'SUPPORT';
      } else {
        return 'DOMAIN';
      }
    } else {
      return 'DOMAIN';
    }
  }
);
