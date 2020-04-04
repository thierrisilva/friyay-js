//This file holds the API calls that hit the /labels route for DRY purposes
import { ApiRequest } from 'Lib/ApiRequest';

export const fetchDomains = async() =>
  ApiRequest.request({
    method: 'GET',
    url: `domains`
  });

export const postDomain = async( newDomain ) => (
  ApiRequest.request({
    method: 'POST',
    url: `domains`,
    data: {
      data: newDomain
    }
  })
)

export const updateDomain = async ( updatedDomain ) => (
  ApiRequest.request({
    method: 'PATCH',
    url: `domains/${updatedDomain.id}`,
    data: {
      data: updatedDomain
    }
  })
)

export const archiveHive = async ( domain ) => {
  ApiRequest.request({
    method: 'POST',
    url: `domains/${domain.id}/archive_hive`
  });
}

export const deleteHive = async ( domain ) => {
  ApiRequest.request({
    method: 'POST',
    url: `domains/${domain.id}/delete_hive`
  });
}
