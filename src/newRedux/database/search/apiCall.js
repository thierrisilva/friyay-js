//This file holds the API calls that hit the /tips route for DRY purposes
import { ApiRequest } from 'Lib/ApiRequest';

/**
 * Fetch the search from the API.
 * 
 * @param {String} query 
 */
export const fetchSearchResult = async(query) => (
  ApiRequest.request({
    method: 'GET',
    url: `search?q=${query}`
  })
)
