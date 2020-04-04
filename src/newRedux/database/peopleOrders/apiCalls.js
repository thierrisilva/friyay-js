//This file holds the API calls that hit the /peopleOrders route for DRY purposes
import { ApiRequest } from 'Lib/ApiRequest';


export const deletePeopleOrder = async( peopleId ) => {
  return ApiRequest.request({
    method: 'DELETE',
    url: `people_orders/${ peopleId }`
  });
}

export const fetchPeopleOrders = async() => {
  return ApiRequest.request({
    method: 'GET',
    url: `people_orders`
  });
}



export const patchPeopleOrder = async( updatedOrder ) => {
  return ApiRequest.request({
    method: 'PATCH',
    url: `people_orders/${ updatedOrder.id }`,
    data: {
      data: updatedOrder
    }
  });
}


export const postPeopleOrder = async( order ) => {
  return ApiRequest.request({
    method: 'POST',
    url: `people_orders`,
    data: {
      data: order

    }
  });
}






export default {
  deletePeopleOrder,
  fetchPeopleOrders,
  patchPeopleOrder,
  postPeopleOrder
}
