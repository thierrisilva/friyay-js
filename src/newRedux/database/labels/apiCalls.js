//This file holds the API calls that hit the /labels route for DRY purposes
import { ApiRequest } from 'Lib/ApiRequest';




export const assignLabelToTip = async( label, cardId ) => {
  return ApiRequest.request({
    method: 'POST',
    url: 'label_assignments',
    data: {
      data: {
        type: 'label_assignments',
        attributes: {
          label_id: label.id,
          item_id: cardId,
          item_type: 'Tip'
        }
      }
    }
  });
}



export const deleteLabel = async( labelId ) => {
  return ApiRequest.request({
    method: 'DELETE',
    url: `labels/${labelId}`
  });
}


export const fetchLabels = async() => {
  return ApiRequest.request({
    method: 'GET',
    url: `labels`
  });
}



export const patchLabel = async( updatedLabel ) =>
  ApiRequest.request({
    method: 'PATCH',
    url: `labels/${ updatedLabel.id }`,
    data: {
      data: updatedLabel
    }
  });



export const postLabel = async( newLabel ) => {
  return ApiRequest.request({
    method: 'POST',
    url: 'labels',
    data: {
      data: newLabel,
    }
  });
}



export const unassignLabelFromTip = async( label, cardId ) => {
  return ApiRequest.request({
    method: 'DELETE',
    url: 'label_assignments/do-not-need',
    data: {
      data: {
        type: 'label_assignments',
        attributes: {
          label_id: label.id,
          item_id: cardId,
          item_type: 'Tip'
        }
      }
    }
  });
}

export default {
  assignLabelToTip,
  deleteLabel,
  fetchLabels,
  patchLabel,
  postLabel,
  unassignLabelFromTip
}
