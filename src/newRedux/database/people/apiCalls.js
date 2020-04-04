//This file holds the API calls that hit the /people route for DRY purposes
import { ApiRequest } from 'Lib/ApiRequest';

export const fetchPeople = async() =>
  ApiRequest.request({
    method: 'GET',
    url: `users?include=user_profile&filter[users]=all&page[size]=999`
  });

export const fetchPerson = async( id ) =>
  ApiRequest.request({
    method: 'GET',
    url: `users/${id}`
  });


export const postActionOnPerson = async( id, action ) =>
  ApiRequest.request({
    method: 'POST',
    url: `users/${id}/${action}`
  });
