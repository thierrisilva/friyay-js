import tiphive from 'Lib/tiphive';

export const topicFilters = {
  ALL: {
    key: 'ALL',
    name: 'yays',
    icon: 'globe',
    iconType: 'fontAwesome',
    contexts: ['PUBLIC', 'DOMAIN', 'GUESTINGROUP', 'OWNER', 'SUPPORT'],
    filter: () => topic => true
  },
  FOLLOWING: {
    key: 'FOLLOWING',
    name: 'yays I follow',
    icon: 'exchange',
    iconType: 'fontAwesome',
    contexts: ['PUBLIC', 'DOMAIN', 'GUEST', 'OWNER', 'GUESTINGROUP'],
    filter: user => topic =>
      user.relationships.following_topics.data.includes(topic.id)
  },
  STARRED: {
    key: 'STARRED',
    name: 'yays I starred',
    icon: 'star',
    iconType: 'fontAwesome',
    contexts: ['PUBLIC', 'DOMAIN', 'GUEST', 'GUESTINGROUP', 'OWNER', 'SUPPORT'],
    filter: () => topic => topic.attributes.starred_by_current_user
  },
  CREATED: {
    key: 'CREATED',
    name: 'yays I created',
    icon: 'user',
    iconType: 'fontAwesome',
    contexts: ['PUBLIC', 'OWNER', 'DOMAIN'],
    filter: user => topic => topic.attributes.user_id == user.id
  },
  SHARED: {
    key: 'SHARED',
    icon: 'share-alt',
    iconType: 'fontAwesome',
    name: 'yays shared with me',
    contexts: ['PUBLIC', 'DOMAIN', 'GUEST', 'OWNER', 'GUESTINGROUP'],
    filter: user => topic =>
      user.relationships.topics_shared_with_user.data.includes(topic.id)
  }
};
//
// //TODO: MH - create a context object and list the filters available in that
// export const getTopicFilters = () => {
//   const filterContext = tiphive.isSupportDomain() ? 'support'
//     : tiphive.isPublicDomain() ? 'public'
//       : (tiphive.userIsGuest() && window.location.href.includes('group')) ? 'guestInGroup'
//         : tiphive.userIsGuest() ? 'guest'
//           : 'domain';
//   console.log('filterContext', filterContext, window.currentDomainName);
//   return Object.values(topicFilters).filter(filter => filter.contexts.includes( filterContext ));
// }
