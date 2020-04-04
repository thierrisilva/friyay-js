//This file holds the API calls that hit the /user route for DRY purposes
import { ApiRequest } from 'Lib/ApiRequest';

export const fetchUser = async() =>
  ApiRequest.request({
    method: 'GET',
    url: `me`
  });


export const fetchUserFollows = async( userId ) =>
  ApiRequest.request({
    method: 'GET',
    url: `users/${ userId }/follows`,
  });



export const postOrderChange = async( userId, updateObject ) =>
  ApiRequest.request({
    method: 'POST',
    url: `users/${ userId }/update_order`,
    data: {
      data: updateObject
    }
  });


export const postUserProfile = async( userId, content ) =>
  ApiRequest.request({
    method: 'POST',
    url: `/users/${ userId }/user_profile`,
    data: {
      ...content
    }
  });
