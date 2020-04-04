//This file holds the API calls that hit the /labelCategories route for DRY purposes
import { ApiRequest } from 'Lib/ApiRequest';

export const fetchLabelCategories = async () =>
  ApiRequest.request({
    method: 'GET',
    url: `label_categories`
  });

export const patchLabelCategory = async (categoryId, attributes) => {
  return ApiRequest.request({
    method: 'PATCH',
    url: `label_categories/${categoryId}`,
    data: {
      data: {
        attributes: attributes
      }
    }
  });
};

export const deleteCategory = async categoryId => {
  ApiRequest.request({
    method: 'DELETE',
    url: `label_categories/${categoryId}`
  });
};

export const postLabelCategory = async name =>
  ApiRequest.request({
    method: 'POST',
    url: `label_categories`,
    data: {
      data: {
        attributes: {
          name: name
        }
      }
    }
  });
