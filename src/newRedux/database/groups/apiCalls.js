//This file holds the API calls that hit the /labels route for DRY purposes
import { ApiRequest } from 'Lib/ApiRequest';
import { buildUserData } from 'Utils/buildTipData';


export const deleteGroup = async( groupId ) => (
  ApiRequest.request({
    method: 'DELETE',
    url: `groups/${groupId}`
  })
)


export const fetchGroups = async() =>
  ApiRequest.request({
    method: 'GET',
    url: `groups`
  });


export const fetchGroupFollows = async( groupId ) =>
  ApiRequest.request({
    method: 'GET',
    url: `groups/${ groupId }/follows`,
  });



export const patchGroup = async( group ) => {
  return ApiRequest.request({
    method: 'PATCH',
    url: `groups/${ group.id }`,
    data: {
      data: group
    }
  });
}


export const postGroup = async( group ) =>
  ApiRequest.request({
    method: 'POST',
    url: `groups`,
    data: {
      data: group
    }
  });


export default {
  deleteGroup,
  fetchGroups,
  fetchGroupFollows,
  patchGroup,
  postGroup
}
