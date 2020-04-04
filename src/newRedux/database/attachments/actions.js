import actionTypes from './actionEnum';

export const addAttachments = ( attachments ) => ({
  type: actionTypes.add,
  payload: attachments
})

export const deleteAttachment = ( attachmentId ) => ({
  type: actionTypes.delete,
  payload: attachmentId
})
