//This file holds the API calls for DRY purposes
import { ApiRequest } from 'Lib/ApiRequest';


export const fetchNotifications = async( ) => (
  ApiRequest.request({
    method: 'GET',
    url: `notifications`
  })
)


export const markNotificationAsRead = async( id ) => (
  ApiRequest.request({
    method: 'PATCH',
    url: 'notifications/mark_as_read',
    data: id ? { id } : null
  })
)


export default {
  fetchNotifications,
  markNotificationAsRead
}
