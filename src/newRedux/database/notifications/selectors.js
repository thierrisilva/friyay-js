import { createSelector } from 'reselect';
import { stateMappings } from 'Src/newRedux/stateMappings';

const getNotifications = (state) => stateMappings( state ).notifications.all_notif;


export const getNotificationArray = createSelector(
  ( state ) => getNotifications( state ),
  ( notifications ) => Object.values( notifications ).reverse()
)


export const getUnreadNotifications = createSelector( //pass null for all cards
    ( state ) => getNotificationArray( state ),
    ( notifications ) => notifications.filter(not => not.attributes.read_at == null )
)
