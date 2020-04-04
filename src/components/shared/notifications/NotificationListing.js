import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { func, object } from 'prop-types';
import { createSelector } from 'reselect';
import moment from 'moment';
import { notificationConfig } from 'Lib/config/notifications';
import { markNotificationsAsRead } from 'Src/newRedux/database/notifications/thunks';
import { getNotificationArray } from 'Src/newRedux/database/notifications/selectors';

import IconButton from 'Components/shared/buttons/IconButton';
import NotificationItem from './NotificationItem';
import Tooltip from 'Components/shared/Tooltip';

const notificationTypes = Object.values( notificationConfig );


class NotificationListing extends PureComponent {

  static propTypes = {
    markNotificationsAsRead: func.isRequired,
    notificationsByAge: object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedNotificationType: 'all'
    };
  }


  handleNotificationTypeSelect = ( selectedNotificationType ) => {
    this.setState(state => ({ ...state, selectedNotificationType }));
  }


  filterNotifications = ( notifications ) => {
    const { selectedNotificationType } = this.state;
    if ( selectedNotificationType == 'all' ) {
      return notifications;
    }

    return notifications.filter( not =>
      not.attributes.action == notificationConfig[ selectedNotificationType ].dbAction
    )
  }


  render() {
    const { markNotificationsAsRead, notificationsByAge } = this.props;
    const { selectedNotificationType } = this.state;

    return (
      <div className='notification-listing'>
        <div className="notification-listing_header">
          { notificationTypes.map( type => (
            <span data-tip={ type.description } key={ type.key }>
              <IconButton additionalClasses={ selectedNotificationType == type.key ? 'active' : ''} fontAwesome icon={type.icon} onClick={ () => this.handleNotificationTypeSelect( type.key ) } />
            </span>
          ))}
          <a className='btn btn-default btn-sm pull-right mark-all' onClick={ markNotificationsAsRead }>Mark All As Read</a>
        </div>
        
        { notificationsByAge[ 'new' ].length > 0 &&
          <Fragment>
            <div className="notification-listing_header">
              New ({notificationsByAge[ 'new' ].length})
            </div>
            { this.filterNotifications( notificationsByAge[ 'new' ] ).map( notification => (
              <NotificationItem notification={ notification }  key={ notification.id } />
            ))}
            <div className="notification-listing_divider" />
          </Fragment>

        }
        { notificationsByAge[ 'yesterday' ].length > 0 &&
          <Fragment>
            <div className="notification-listing_header">
              Yesterday ({notificationsByAge[ 'yesterday' ].length})
            </div>
            { this.filterNotifications( notificationsByAge[ 'yesterday' ] ).map( notification => {
              return (
              <NotificationItem notification={ notification } key={ notification.id } />
            )})}
            <div className="notification-listing_divider" />
          </Fragment>
        }
        { notificationsByAge[ 'older' ].length > 0 &&
          <Fragment>
            <div className="notification-listing_header">
              Older ({notificationsByAge[ 'older' ].length})
            </div>
            { this.filterNotifications( notificationsByAge[ 'older' ] ).map( notification => (
              <NotificationItem notification={ notification }  key={ notification.id }  />
            ))}
            <div className="notification-listing_divider" />
          </Fragment>
        }
        { notificationsByAge.count == 0 &&
          <div className="notification-listing_header">
            No activity
          </div>
        }

        <Tooltip />
      </div>
    );
  }
}



const assessDateOfNotification = ( notification ) => {
  const activityDate = moment( notification.attributes.date );
  const today = moment().startOf('date');
  const yesterday = moment().subtract(1, 'days').startOf('date');
  return activityDate.isSame( today )
    ? 'new'
    : activityDate.isSame( yesterday )
      ? 'yesterday'
      : 'older';
}


export const mapNotificationsToAge = createSelector( //pass null for all cards
    ( state ) => getNotificationArray( state ),
    ( notifications ) => {
		return notifications.reduce( (a, b) => {
      		const key = assessDateOfNotification( b );
      		a[ key ] = [ ...a[ key ], b ];
      		a.count = a.count + 1;
      		return a;
    	}, { new: [], yesterday: [], older: [], count: 0 })
	}

)

const mapState = ( state, props ) => ({
  notificationsByAge: mapNotificationsToAge( state )
});


const mapDispatch = {
  markNotificationsAsRead
}

export default connect( mapState, mapDispatch )( NotificationListing );
