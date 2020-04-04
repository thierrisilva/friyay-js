// import { normalizeAttachment, normalizeAttachments } from './schema';
import { getCard } from 'Src/newRedux/database/cards/thunks';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { success, failure } from 'Utils/toast';
import api from './apiCalls';
import { addAttachments, deleteAttachment } from './actions';

export const createAttachment = (newFile) => async(dispatch) => {
  try {
    const newServerAttachment = await api.postAttachment( newFile );
    // dispatch( addAttachments( normalizeAttachment( newServerAttachment ).Attachments ));

    if (newFile.tip_id) dispatch(getCard(newFile.tip_id));
    success('New Attachment created!');
    return newServerAttachment;
  } catch (error) {
    failure('Unable to save new attachment');
    return null;
  }
};


export const getAttachments = ( AttachmentIds ) => async(dispatch) => {

  try {
    const AttachmentData = await api.fetchAttachments( AttachmentIds );
    // dispatch( addAttachments( normalizeAttachment( AttachmentData ).Attachments ));
    return AttachmentData;

  } catch (error) {
    failure('Unable to load Attachment');
    return null;
  }
};


export const removeAttachment = ( AttachmentId ) => async(dispatch, getState) => {

  const thisAttachment = stateMappings( getState() ).Attachments[ AttachmentId ];
  dispatch( deleteAttachment( AttachmentId ));

  try {
    await api.deleteAttachment( AttachmentId );

  } catch (error) {
    failure('Unable to remove Attachment');
    dispatch( addAttachments({ [thisAttachment.id]: thisAttachment } ));
  }
};
