import { ApiRequest } from 'Lib/ApiRequest';

export const fetchAttachments = async( attachmentIDs ) =>
  ApiRequest.request({
    method: 'GET',
    url: 'attachments',
    data: {
      ids: attachmentIDs
    }
  });

export const deleteAttachment = async( attachmentID ) =>
  ApiRequest.request({
    method: 'DELETE',
    url: `attachments/${attachmentID}`
  });

export const postAttachment = async( data ) =>
  ApiRequest.request({
    method: 'POST',
    url: 'attachments',
    data: data

    // data: {
    //   data: {
    //     attributes: {
    //       remote_file_url: file.url,
    //       mime_type: file.mimetype
    //     }
    //   }
    // }
  });

export default {
  deleteAttachment,
  fetchAttachments,
  postAttachment
};
