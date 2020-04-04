//This file holds the API calls that hit the /labelOrders route for DRY purposes
import { ApiRequest } from 'Lib/ApiRequest';

export const deleteTopicOrder = async( orderId ) => {

  return ApiRequest.request({
    method: 'DELETE',
    url: `topic_orders/${ orderId }`,
  });
}



export const fetchTopicOrders = async() => {
  return ApiRequest.request({
    method: 'GET',
    url: `topic_orders`
  });
}


export const patchTopicOrder = async( order ) => {

  return ApiRequest.request({
    method: 'PATCH',
    url: `topic_orders/${ order.id }`,
    data: {
      data: {
       attributes: order.attributes
      }
    }
  });
}


export const postTopicOrder = async( order ) => (
  ApiRequest.request({
    method: 'POST',
    url: `topic_orders`,
    data: {
      data: order
    }
  })
)

export default {
  deleteTopicOrder,
  fetchTopicOrders,
  patchTopicOrder,
  postTopicOrder
};
