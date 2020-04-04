//This file holds the API calls that hit the /labelOrders route for DRY purposes
import { ApiRequest } from 'Lib/ApiRequest';


export const deleteLabelOrder = async( labelId ) => {
  return ApiRequest.request({
    method: 'DELETE',
    url: `label_orders/${ labelId }`
  });
}

export const fetchLabelOrders = async() => {
  return ApiRequest.request({
    method: 'GET',
    url: `label_orders`
  });
}



export const patchLabelOrder = async( updatedOrder ) => {
  return ApiRequest.request({
    method: 'PATCH',
    url: `label_orders/${ updatedOrder.id }`,
    data: {
      data: updatedOrder
    }
  });
}


export const postLabelOrder = async( order ) => {
  return ApiRequest.request({
    method: 'POST',
    url: `label_orders`,
    data: {
      data: order

    }
  });
}






export default {
  deleteLabelOrder,
  fetchLabelOrders,
  patchLabelOrder,
  postLabelOrder
}
